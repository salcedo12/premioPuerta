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
import { FalloModal } from "./FalloModal";
import { registrarParticipante } from "../components/ParticipantesService";


const PREMIOS = [0, 0, 5, 10, 15, 20, 25, 30];

interface Props {
  usuario: Usuario | null;
  onReiniciar?: () => void;
}

const OpenDoor: React.FC<Props> = ({ usuario, onReiniciar }) => {
  const [, setLlaveAbierta] = useState<number | null>(null);
  const [, setPremio] = useState<string | null>(null);

  
  const [mostrarModalPremioSimple, setMostrarModalPremioSimple] =
    useState(false); 
  const [mostrarModalDecision, setMostrarModalDecision] = useState(false); 
  
  const [mostrarModalPremioSegundo, setMostrarModalPremioSegundo] =
    useState(false); 
  const [mostrarModalDecisionSegundo, setMostrarModalDecisionSegundo] =
    useState(false); 

  const [mostrarModalPremioFinal, setMostrarModalPremioFinal] = useState(false);
  const [mostrarModalEleccionFinal, setMostrarModalEleccionFinal] =
    useState(false); 

  const [puertaAbierta, setPuertaAbierta] = useState(false);
  const [uuidPremio, setUuidPremio] = useState<string | null>(null);
  const [llavesEscogidas, setLlavesEscogidas] = useState<number[]>([]);
  const [llavesOcultas, setLlavesOcultas] = useState<number[]>([]);
  const [intentos, setIntentos] = useState(0);
  const [intentoRevancha, setIntentoRevancha] = useState(false);
  const [llaveGanadora, setLlaveGanadora] = useState<number | null>(null);
  const [mejorPremio, setMejorPremio] = useState<number | null>(null); 
  const [segundoPremio, setSegundoPremio] = useState<number | null>(null); 
  const [premioFinalConfirmado, setPremioFinalConfirmado] =
    useState<string | null>(null);
  const [alertaVisible, setAlertaVisible] = useState(false);
  const [alertaTexto, ] = useState("");
  const [falloModalVisible, setFalloModalVisible] = useState(false);
  const [mensajeFallo, ] = useState("");
  const [intentosRestantes, setIntentosRestantes] = useState(2);

  const puertaRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const premiosPorLlave = useMemo(() => {
    let copiaPremios = [...PREMIOS];
    for (let i = copiaPremios.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copiaPremios[i], copiaPremios[j]] = [copiaPremios[j], copiaPremios[i]];
    }
    console.log("Premios por llave:", copiaPremios);
    return copiaPremios;
  }, []);

  const notificarGanadorPHP = async (usuario: Usuario, premioFinal: string) => {
    try {
      await fetch("https://grupoconstructormeraki.com.co/notificar-ganador.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: usuario.nombre,
          documento: usuario.documento,
          telefono: usuario.telefono,
          correo: usuario.correo,
          terrenoInteresado: usuario.terrenoInteresado,
          ciudad: usuario.ciudad,
          premio: premioFinal,
        }),
      });
    } catch (error) {
      console.error("Error notificando al jefe:", error);
    }
  };

  useEffect(() => {
    const handler = (e: PageTransitionEvent) => {
      if (e.persisted) window.location.reload();
    };
    window.addEventListener("pageshow", handler);
    return () => window.removeEventListener("pageshow", handler);
  }, []);

  useEffect(() => {
    if (
      mostrarModalPremioFinal &&
      premioFinalConfirmado &&
      parseInt(premioFinalConfirmado) >= 0
    ) {
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
  }, [mostrarModalPremioFinal, premioFinalConfirmado]);

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

  const registrarResultadoFinal = async (premioFinal: string) => {
    if (!usuario) return;
    try {
      await registrarParticipante(usuario, premioFinal);
    } catch (error) {
      console.error("Error registrando participante:", error);
    }
  };

  const handleAbrirLlave = async (i: number) => {
    if (
      llavesEscogidas.includes(i) ||
      puertaAbierta ||
      llavesOcultas.includes(i) ||
      (intentos >= 2 && !intentoRevancha)
    )
      return;

    setLlaveAbierta(i);
    setPuertaAbierta(true);

    const premioSeleccionado = premiosPorLlave[i];
    setPremio(`${premioSeleccionado} Millones`);

    await waitForDoorToOpen();

    if (!usuario) {
      alert("No hay datos de usuario, no se puede guardar el resultado.");
      resetPuerta();
      return;
    }

    if (!intentoRevancha) {
      setMejorPremio(premioSeleccionado);
      setLlaveGanadora(i);

      if (premioSeleccionado === 0) {
        setMostrarModalPremioSimple(false);
        setMostrarModalDecision(true);
      } else {
        setMostrarModalPremioSimple(true);
        setMostrarModalDecision(false);

        setTimeout(() => {
          setMostrarModalPremioSimple(false);
          setMostrarModalDecision(true);
        }, 4000);
      }
    } else {
      setLlavesEscogidas((prev) => [...prev, i]);
      setIntentos((prev) => prev + 1);
      setIntentosRestantes(0);
      setSegundoPremio(premioSeleccionado);

      if (premioSeleccionado === 0) {
        setMostrarModalPremioSegundo(false);
        setMostrarModalDecisionSegundo(true);
        setMostrarModalEleccionFinal(false);

        setTimeout(() => {
          setMostrarModalDecisionSegundo(false);
          setMostrarModalEleccionFinal(true);
        }, 4000);
      } else {
      
        setMostrarModalPremioSegundo(true);
        setMostrarModalEleccionFinal(false);

        setTimeout(() => {
          setMostrarModalPremioSegundo(false);
          setMostrarModalEleccionFinal(true);
        }, 4000);
      }
    }
  };

  const mantenerPremio = async () => {
    setMostrarModalDecision(false);

    if (mejorPremio === null) return;
    const premioFinalTexto = `${mejorPremio} Millones`;

    setPremioFinalConfirmado(premioFinalTexto);
    setMostrarModalPremioFinal(true);
    setIntentos(2);
    setLlavesEscogidas((prev) =>
      llaveGanadora !== null ? [...prev, llaveGanadora] : prev
    );

    if (!usuario) return;

    const nuevoUUID = crypto.randomUUID();
    setUuidPremio(nuevoUUID);
    await actualizarPremio(usuario.documento, premioFinalTexto, nuevoUUID);
    await registrarResultadoFinal(premioFinalTexto);
    await notificarGanadorPHP(usuario, premioFinalTexto);
  };

  const hacerRevancha = () => {
    if (llaveGanadora !== null) {
      setLlavesOcultas([llaveGanadora]);
    }
    setIntentoRevancha(true);
    setMostrarModalDecision(false);
    setLlaveAbierta(null);
    setPuertaAbierta(false);
    setPremio(null);
    setIntentosRestantes(1);
  };

  const confirmarPremioFinal = async (opcion: "primero" | "segundo") => {
    if (!usuario || mejorPremio === null || segundoPremio === null) return;

    const premioElegidoNumero =
      opcion === "primero" ? mejorPremio : segundoPremio;

    const premioFinalTexto = `${premioElegidoNumero} Millones`;
    setPremioFinalConfirmado(premioFinalTexto);
    setMostrarModalEleccionFinal(false);
    setMostrarModalPremioFinal(true);

    const nuevoUUID = crypto.randomUUID();
    setUuidPremio(nuevoUUID);
    await actualizarPremio(usuario.documento, premioFinalTexto, nuevoUUID);
    await registrarResultadoFinal(premioFinalTexto);
    await notificarGanadorPHP(usuario, premioFinalTexto);
  };

  const handleDescargarRecompensa = async () => {
    if (!usuario) {
      alert("No hay datos de usuario");
      return;
    }
    if (!premioFinalConfirmado) {
      alert("No hay premio para descargar");
      return;
    }

    const nuevoUUID = uuidPremio ?? crypto.randomUUID();
    setUuidPremio(nuevoUUID);

    await actualizarPremio(usuario.documento, premioFinalConfirmado, nuevoUUID);
    await generarPDF(usuario, premioFinalConfirmado, nuevoUUID);
  };



  const renderLlave = (i: number) => (
    <div
      key={i}
      className="llave-img"
      onClick={() => handleAbrirLlave(i)}
      style={{
        display: llavesEscogidas.includes(i) || llavesOcultas.includes(i)
          ? "none"
          : "block",
        cursor: "pointer",
      }}
    >
      <img
        src={llave}
        alt="Llave"
        className={`llave-disenio${
          llavesEscogidas.includes(i) ? " llave-opaque" : ""
        }`}
      />
       
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
          Selecciona una de las <b>llaves doradas</b> para que <strong>abras</strong> la puerta de tu Club de Campo.<br />
          <h2>👉 Tienes dos oportunidades </h2>
        </div>
      </div>

      <div className="contenedor-disenio-llaves-puerta">
        {llavesArribaRender}
        {llavesRender}
      </div>

      {alertaVisible && (
        <AlertModal
          mensaje={alertaTexto}
          onClose={() => setAlertaVisible(false)}
        />
      )}

      {falloModalVisible && (
        <FalloModal
          mensaje={mensajeFallo}
          intentosRestantes={intentosRestantes}
          onClose={() => {
            setFalloModalVisible(false);
            if (onReiniciar) onReiniciar();
            navigate("/");
          }}
          onIntentarOtraVez={
            intentosRestantes > 0
              ? () => {
                  resetPuerta();
                  setFalloModalVisible(false);
                }
              : undefined
          }
        />
      )}

      {mostrarModalPremioSimple && mejorPremio !== null && mejorPremio > 0 && (
        <PremioModal
          premio={`${mejorPremio} Millones`}
          modo="intento"
          onClose={() => setMostrarModalPremioSimple(false)}
        />
      )}

      {mostrarModalDecision && mejorPremio !== null && (
        <AlertModal
          mensaje={
            mejorPremio === 0
              ? [
                  "Esta vez no has ganado nada.",
                  "",
                  "¿Quieres intentar una revancha?",
                ]
              : [
                  `¡Has ganado ${mejorPremio} Millones!`,
                  "",
                  "¿Quieres mantener tu premio o intentar una revancha?",
                ]
          }
          actions={
            mejorPremio === 0
              ? [
                  {
                    label: "Revancha",
                    onClick: hacerRevancha,
                  },
                ]
              : [
                  {
                    label: "Mantener premio",
                    onClick: mantenerPremio,
                  },
                  {
                    label: "Revancha",
                    onClick: hacerRevancha,
                  },
                ]
          }
          onClose={() => setMostrarModalDecision(false)}
        />
      )}

      {mostrarModalPremioSegundo && segundoPremio !== null && segundoPremio > 0 && (
        <PremioModal
          premio={`${segundoPremio} Millones`}
          modo="intento"
          onClose={() => setMostrarModalPremioSegundo(false)}
        />
      )}

      {mostrarModalDecisionSegundo && segundoPremio === 0 && (
        <AlertModal
          mensaje={[
            "En la revancha no has ganado nada.",
            "",
            "En unos segundos podrás elegir con qué premio quedarte.",
          ]}
          actions={[]}
          onClose={() => setMostrarModalDecisionSegundo(false)}
        />
      )}

      {mostrarModalEleccionFinal &&
        mejorPremio !== null &&
        segundoPremio !== null && (
          <AlertModal
            mensaje={[
              `Primer intento: ${mejorPremio} Millones`,
              `Segundo intento: ${segundoPremio} Millones`,
              "",
              "¿Qué premio quieres redimir?",
            ]}
            actions={[
              {
                label: `Quedarme con ${mejorPremio}M`,
                onClick: () => confirmarPremioFinal("primero"),
              },
              {
                label: `Quedarme con ${segundoPremio}M`,
                onClick: () => confirmarPremioFinal("segundo"),
              },
            ]}
          />
        )}

      {mostrarModalPremioFinal && premioFinalConfirmado && (
        <PremioModal
          premio={premioFinalConfirmado}
          modo="final"
          onDescargar={handleDescargarRecompensa}
          onClose={() => {
            setMostrarModalPremioFinal(false);
            if (onReiniciar) onReiniciar();
          }}
        />
      )}
    </div>
  );
};

export default OpenDoor;
