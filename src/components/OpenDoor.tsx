import React, { useState, useMemo, useEffect } from "react";
import ReactDOM from "react-dom";
import "../styles/OpenDoor.css";
import { generarPDF } from "../components/GenerarPdf";
import { actualizarPremio } from "../components/PremioService";
import type { Usuario } from "../types";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import BombasConfettiFijo from "./BombasConfettiFijo";
const NUM_LLAVES = 8;
const NUM_PREMIOS = 8;

interface Props { usuario: Usuario | null; }
type PremioModalProps = {
  premio: string;
  onDescargar: () => void;
  onVer: () => void;
};


function AlertModal({ mensaje, onClose }: { mensaje: string, onClose: () => void }) {
  return ReactDOM.createPortal(
    <div className="open-door-alert-modal">
      <div className="open-door-alert-backdrop" onClick={onClose} />
      <div className="open-door-alert-box">
        <div className="open-door-alert-content">{mensaje}</div>
        <button className="open-door-alert-btn" onClick={onClose}>OK</button>
      </div>
    </div>,
    document.body
  );
}


function PremioModal({ onDescargar,  }: PremioModalProps) {
  return ReactDOM.createPortal(
    <div className="premio-modal-portal">
      <div className="modal-portal-overlay"></div>
      <BombasConfettiFijo />
      <div className="premio-solo-container">
        <div className="premio-solo-row">
          <div className="premio-solo-content">

            <div className="botones-premio">
              <button className="boton-descarga" onClick={onDescargar}>Descargar recompensa</button>

            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}


function explosionBombasConfetti() {
  confetti({
    particleCount: 140,
    spread: 120,
    origin: { y: 0.65 },
    colors: ['#FFD700', '#222', '#fff36b'],
    shapes: ['circle'],
    scalar: 1.4,
  });
  confetti({
    particleCount: 70,
    angle: 60,
    spread: 100,
    origin: { x: 0.1, y: 0.65 },
    colors: ['#FFD700', '#222'],
    shapes: ['circle'],
    scalar: 1.35,
  });
  confetti({
    particleCount: 70,
    angle: 120,
    spread: 100,
    origin: { x: 0.9, y: 0.65 },
    colors: ['#FFD700', '#222'],
    shapes: ['circle'],
    scalar: 1.35,
  });
}

const OpenDoor: React.FC<Props> = ({ usuario }) => {
  const [, setLlaveAbierta] = useState<number | null>(null);
  const [premio, setPremio] = useState<string | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [puertaAbierta, setPuertaAbierta] = useState(false);
  const [uuidPremio, setUuidPremio] = useState<string | null>(null);
  const [llavesEscogidas, setLlavesEscogidas] = useState<number[]>([]);
  const [llavesFallidas, setLlavesFallidas] = useState<number[]>([]);
  const [intentos, setIntentos] = useState(0);
  const [alertaVisible, setAlertaVisible] = useState(false);
  const [alertaTexto, setAlertaTexto] = useState("");

  const navigate = useNavigate();


  useEffect(() => {
    if (mostrarModal && premio === "20 Millones") {
      explosionBombasConfetti();
    }
  }, [mostrarModal, premio]);

  const premiosIndices = useMemo(() => {
    let indices = Array.from({ length: NUM_LLAVES }, (_, i) => i);
    return indices.sort(() => Math.random() - 0.5).slice(0, NUM_PREMIOS);
  }, []);

  const premiosPorLlave = useMemo(() => {
    const arr = Array(NUM_LLAVES).fill("Sin suerte");
    premiosIndices.forEach(index => arr[index] = "20 Millones");
    return arr;
  }, [premiosIndices]);

  const handleAbrirLlave = (i: number) => {
    if (llavesEscogidas.includes(i) || intentos >= 2 || puertaAbierta) return;
    setLlaveAbierta(i);
    setPremio(premiosPorLlave[i]);
    setPuertaAbierta(true);
    setIntentos(prev => prev + 1);
    setLlavesEscogidas(prev => [...prev, i]);
    setTimeout(async () => {
      if (!usuario) {
        alert("No hay datos de usuario, no se puede guardar el resultado.");
        return;
      }
      if (premiosPorLlave[i] === "20 Millones") {
        const nuevoUUID = crypto.randomUUID();
        setUuidPremio(nuevoUUID);
        await actualizarPremio(usuario.documento, "20 Millones", nuevoUUID);
        await generarPDF(usuario, "20 Millones", nuevoUUID);
        setMostrarModal(true);
      } else {
        setLlavesFallidas((prev) => [...prev, i]);
        if (intentos === 0) {
          setAlertaTexto("¡No tuviste suerte! Intenta con otra llave.");
          setAlertaVisible(true);
          setTimeout(() => {
            setPuertaAbierta(false);
            setLlaveAbierta(null);
            setPremio(null);
          }, 1800);
        }
        if (intentos === 1) {
          setAlertaTexto("No tuviste suerte, ¡gracias por participar!");
          setAlertaVisible(true);
          const nuevoUUID = crypto.randomUUID();
          setUuidPremio(nuevoUUID);
          await actualizarPremio(usuario.documento, "No ganó nada", nuevoUUID);
          await generarPDF(usuario, "No ganó nada", nuevoUUID);
        }
      }
    }, 1800);
  }

  const handleDescargarRecompensa = async () => {
    if (!usuario) { alert("No hay datos de usuario"); return; }
    const premioFinal = premio ? premio : "No ganó nada";
    const nuevoUUID = crypto.randomUUID();
    setUuidPremio(nuevoUUID);
    await actualizarPremio(usuario.documento, premioFinal, nuevoUUID);
    await generarPDF(usuario, premioFinal, nuevoUUID);
  };

  const handleVerRecompensa = () => {
    if (!uuidPremio) { alert("No hay código!"); return; }
    navigate(`/consulta-premio?codigo=${uuidPremio}`);
  };

  const llavesRender = (
    <div className="llaves-y-puerta-layout">
      <div className="columna-llaves columna-izquierda">
        {[0, 1, 2].map(i =>
          <div className={`llave-img${llavesEscogidas.includes(i) ? " llave-opaque" : ""}`}
              onClick={() => handleAbrirLlave(i)}
              style={{position: "relative"}} key={i}>
            <img src="/llavesV.png" alt="Llave" className="llave-disenio" />
            {llavesFallidas.includes(i) && <span className="x-falla-llave">×</span>}
          </div>
        )}
      </div>
      <div className="puerta-centro-disenio">
        <img src="/PUERTA1.png" className="puerta-img-disenio" alt="Puerta" />
      </div>
      <div className="columna-llaves columna-derecha">
        {[3, 4, 5].map(i =>
          <div className={`llave-img${llavesEscogidas.includes(i) ? " llave-opaque" : ""}`}
              onClick={() => handleAbrirLlave(i)}
              style={{position: "relative"}} key={i}>
            <img src="/llavesV.png" alt="Llave" className="llave-disenio llave-sombra" />
            {llavesFallidas.includes(i) && <span className="x-falla-llave">×</span>}
          </div>
        )}
      </div>
    </div>
  );

  const llavesArribaRender = (
    <div className="fila-llaves fila-superior">
      {[6, 7].map(i =>
        <div className={`llave-img${llavesEscogidas.includes(i) ? " llave-opaque" : ""}`}
             onClick={() => handleAbrirLlave(i)}
             style={{position: "relative"}} key={i}>
          <img src="/llaves.png" alt="Llave" className="llave-disenio" />
          {llavesFallidas.includes(i) && <span className="x-falla-llave">×</span>}
        </div>
      )}
    </div>
  );

  return (
    <div className="open-door-container">
      <div className="open-door-welcome">
        <h2 className="bienvenida-titulo">¿Listo para jugar? <span role="img" aria-label="diana">🎯</span></h2>
        <div className="bienvenida-texto">
          Selecciona una de las <b>llaves doradas</b> para que <strong>abras</strong> la puerta de tu Club de Campo.<br /><br />
          <b>👉 Tienes dos oportunidades para encontrar la llave correcta.</b>
          Si aciertas, <b>¡ganas un bono de descuento exclusivo para invertir en tu terreno campestre con Meraki!</b>
        </div>
      </div>
      <div className="contenedor-disenio-llaves-puerta">
        {llavesArribaRender}
        {llavesRender}
      </div>
      {alertaVisible && (
        <AlertModal mensaje={alertaTexto} onClose={() => setAlertaVisible(false)} />
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
