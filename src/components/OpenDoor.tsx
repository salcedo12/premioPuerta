import React, { useState, useMemo, useRef, useEffect } from "react";
import "../styles/OpenDoor.css";
import { generarPDF } from "../components/GenerarPdf";
import { actualizarPremio } from "../components/PremioService";
import type { Usuario } from "../types";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import { AlertModal, PremioModal } from "./modales";
import llave from "../assets/llaves.png";
import puerta from "../assets/PUERTA1.png";
import {FalloModal} from "./FalloModal";


const NUM_LLAVES = 8;
const NUM_PREMIOS = 2;

interface Props {
  usuario: Usuario | null;
   onReiniciar?: () => void;  
}

const OpenDoor: React.FC<Props> = ({ usuario, onReiniciar }) => {
  const [, setLlaveAbierta] = useState<number | null>(null);
  const [premio, setPremio] = useState<string | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [puertaAbierta, setPuertaAbierta] = useState(false);
  const [uuidPremio, setUuidPremio] = useState<string | null>(null);
  const [llavesEscogidas, setLlavesEscogidas] = useState<number[]>([]);
  const [llavesFallidas, setLlavesFallidas] = useState<number[]>([]);
  const [intentos, setIntentos] = useState(0);
  const [alertaVisible, setAlertaVisible] = useState(false);
  const [alertaTexto, ] = useState("");
  const [falloModalVisible, setFalloModalVisible] = useState(false);
  const [mensajeFallo, setMensajeFallo] = useState("");
  const [intentosRestantes, setIntentosRestantes] = useState(2);

  const puertaRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: PageTransitionEvent) => {
      if (e.persisted) window.location.reload();
    };
    window.addEventListener("pageshow", handler);
    return () => window.removeEventListener("pageshow", handler);
  }, []);

  useEffect(() => {
    if (mostrarModal && premio === "20 Millones") {
      confetti({
        particleCount: 140,
        spread: 120,
        origin: { y: 0.65 },
        colors: ["#FFD700", "#222", "#fff36b"],
        shapes: ["circle"],
        scalar: 1.4,
      });
      confetti({
        particleCount: 70,
        angle: 60,
        spread: 100,
        origin: { x: 0.1, y: 0.65 },
        colors: ["#FFD700", "#222"],
        shapes: ["circle"],
        scalar: 1.35,
      });
      confetti({
        particleCount: 70,
        angle: 120,
        spread: 100,
        origin: { x: 0.9, y: 0.65 },
        colors: ["#FFD700", "#222"],
        shapes: ["circle"],
        scalar: 1.35,
      });
    }
  }, [mostrarModal, premio]);

  const premiosIndices = useMemo(() => {
    const indices = Array.from({ length: NUM_LLAVES }, (_, i) => i);
    return indices.sort(() => Math.random() - 0.5).slice(0, NUM_PREMIOS);
  }, []);

  const premiosPorLlave = useMemo(() => {
    const arr = Array(NUM_LLAVES).fill("Sin suerte");
    premiosIndices.forEach((index) => (arr[index] = "20 Millones"));
    return arr;
  }, [premiosIndices]);

  const waitForDoorToOpen = (): Promise<void> =>
    new Promise((resolve) => {
      const el = puertaRef.current;
      if (!el) {
        setTimeout(resolve, 1400);
        return;
      }
      let finished = false;
      const onEnd = (e: TransitionEvent) => {
        if (e.propertyName === "transform") {
          finished = true;
          resolve();
        }
      };
      el.addEventListener("transitionend", onEnd as EventListener, { once: true });
      setTimeout(() => {
        if (!finished) resolve();
      }, 2000);
    });

  const resetPuerta = () => {
    setPuertaAbierta(false);
    setLlaveAbierta(null);
    setPremio(null);
  };

  const handleAbrirLlave = async (i: number) => {
    if (llavesEscogidas.includes(i) || intentos >= 2 || puertaAbierta) return;

    setLlaveAbierta(i);
    setPremio(premiosPorLlave[i]);
    setPuertaAbierta(true);
    setIntentos((prev) => prev + 1);
    setLlavesEscogidas((prev) => [...prev, i]);
    setIntentosRestantes((prev) => prev - 1);

    await waitForDoorToOpen();

    if (!usuario) {
      alert("No hay datos de usuario, no se puede guardar el resultado.");
      resetPuerta();
      return;
    }

    if (premiosPorLlave[i] === "20 Millones") {
      const nuevoUUID = crypto.randomUUID();
      setUuidPremio(nuevoUUID);
      await actualizarPremio(usuario.documento, "20 Millones", nuevoUUID);
      setMostrarModal(true);
    } else {
      setLlavesFallidas((prev) => [...prev, i]);

      if (intentosRestantes > 0) {
        setMensajeFallo("¡No tuviste suerte! Intenta con otra llave.");
        setFalloModalVisible(true);
      } else {
        setMensajeFallo("¡No tuviste suerte! Gracias por participar.");
        const nuevoUUID = crypto.randomUUID();
        setUuidPremio(nuevoUUID);
        await actualizarPremio(usuario.documento, "No ganó nada", nuevoUUID);
        await generarPDF(usuario, "No ganó nada", nuevoUUID);
        setFalloModalVisible(true);
      }
    }
  };

  const handleIntentarOtraVez = () => {
    resetPuerta();
    setFalloModalVisible(false);
  };

  const handleDescargarRecompensa = async () => {
    if (!usuario) {
      alert("No hay datos de usuario");
      return;
    }
    const premioFinal = premio ? premio : "No ganó nada";
    const nuevoUUID = crypto.randomUUID();
    setUuidPremio(nuevoUUID);
    await actualizarPremio(usuario.documento, premioFinal, nuevoUUID);
    await generarPDF(usuario, premioFinal, nuevoUUID);
  };

  const handleVerRecompensa = () => {
    if (!uuidPremio) {
      alert("No hay código!");
      return;
    }
    navigate(`/consulta-premio?codigo=${uuidPremio}`);
  };

  const renderLlave = (i: number) => (
    <div
      key={i}
      className="llave-img"
      onClick={() => handleAbrirLlave(i)}
    >
      <img
        src={llave}
        alt="Llave"
        className={`llave-disenio${llavesEscogidas.includes(i) ? " llave-opaque" : ""}`}
      />
      {llavesFallidas.includes(i) && <span className="x-falla-llave">×</span>}
    </div>
  );

  const llavesRender = (
    <div className="llaves-y-puerta-layout">
      <div className="columna-llaves columna-izquierda">
        {[0, 1, 2].map(renderLlave)}
      </div>
      <div className="puerta-centro-disenio">
        <div
          ref={puertaRef}
          className={`puerta-animada ${puertaAbierta ? "open" : ""}`}
          aria-hidden={false}
        >
          <img src={puerta} className="puerta-img-disenio" alt="Puerta" />
        </div>
      </div>
      <div className="columna-llaves columna-derecha">
        {[3, 4, 5].map(renderLlave)}
      </div>
    </div>
  );

  const llavesArribaRender = (
    <div className="fila-llaves fila-superior">
      {[6, 7].map(renderLlave)}
    </div>
  );

  return (
    <div className="open-door-container">
      <div className="open-door-welcome">
        <h2 className="bienvenida-titulo">
          ¿Listo para jugar? <span role="img" aria-label="diana">🎯</span>
        </h2>
        <div className="bienvenida-texto">
          Selecciona una de las <b>llaves doradas</b> para que <strong>abras</strong> la puerta de tu
          Club de Campo.<br />
          <h2>👉 Tienes dos oportunidades </h2>
        </div>
      </div>

      <div className="contenedor-disenio-llaves-puerta">
        {llavesArribaRender}
        {llavesRender}
      </div>

      {alertaVisible && (
        <AlertModal mensaje={alertaTexto} onClose={() => setAlertaVisible(false)} />
      )}

    {falloModalVisible && (
  <FalloModal
    mensaje={mensajeFallo}
    intentosRestantes={intentosRestantes}
    onClose={() => {
      setFalloModalVisible(false);
      if (onReiniciar) {
        onReiniciar();        
      }
      navigate("/");          
    }}
    onIntentarOtraVez={intentosRestantes > 0 ? handleIntentarOtraVez : undefined}
  />
)}

      {mostrarModal && (
        <PremioModal
          premio={premio ?? ""}
          onDescargar={handleDescargarRecompensa}
          onVer={handleVerRecompensa}
        />
      )}
    </div>
  );
};

export default OpenDoor;