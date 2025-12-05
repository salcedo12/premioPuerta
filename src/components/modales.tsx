import ReactDOM from "react-dom";
import BombasConfettiFijo from "./BombasConfettiFijo";
import premio5 from "../assets/premio5.jpg";
import premio10 from "../assets/premio10.jpg";
import premio15 from "../assets/premio15.jpg";
import premio20 from "../assets/premio20.jpg";
import premio25 from "../assets/premio25.jpg";
import premio30 from "../assets/premio30.jpg";

type ModalAction = {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
};

type PremioModalProps = {
  premio: string;
  modo?: "intento" | "final";
  mensajeExtra?: string;
  actions?: ModalAction[];   
  onDescargar?: () => void; 
  onClose?: () => void;
};

function getPremioImage(premio: string) {
  switch (premio) {
    case "5 Millones":
      return premio5;
    case "10 Millones":
      return premio10;
    case "15 Millones":
      return premio15;
    case "20 Millones":
      return premio20;
    case "25 Millones":
      return premio25;
    case "30 Millones":
      return premio30;
    default:
      return premio5;
  }
}


export function PremioModal({
  premio,
 
  mensajeExtra,
  actions,
  onDescargar,
  
}: PremioModalProps) {
  const imagen = getPremioImage(premio);

  const renderButtons = () => {
 
    if (actions && actions.length > 0) {
      return (
        <div className="botones-premio">
          {actions.map((a, idx) => (
            <button
              key={idx}
              className={
                a.variant === "secondary" ? "boton-cerrar" : "boton-descarga"
              }
              onClick={a.onClick}
            >
              {a.label}
            </button>
          ))}
        </div>
      );
    }


    if (!onDescargar) {
      return null;
    }

   
    return (
      <div className="botones-premio">
        {onDescargar && (
          <button className="boton-descarga" onClick={onDescargar}>
            Descargar recompensa
          </button>
        )}
       
      </div>
    );
  };

  return ReactDOM.createPortal(
    <div className="premio-modal-portal">
      <div className="modal-portal-overlay" />
      <div className="confetti-bg show-bombas">
        <BombasConfettiFijo />
      </div>

      <div className="premio-solo-container" role="dialog" aria-modal="true">
        <div className="premio-solo-row">
          <img src={imagen} alt="Imagen del premio" className="premio-bg-img" />
          <div className="premio-solo-content">
            <h2 className="titulo-premio">
             
            </h2>
            {mensajeExtra && (
              <p className="texto-premio-extra">{mensajeExtra}</p>
            )}

            {renderButtons()}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}


type AlertModalAction = {
  label: string;
  onClick: () => void;
};

type AlertModalProps = {
  mensaje: string | string[];
  onClose?: () => void;
  actions?: AlertModalAction[];
};

export function AlertModal({ mensaje, onClose, actions }: AlertModalProps) {
  const lineas = Array.isArray(mensaje) ? mensaje : [mensaje];

  return ReactDOM.createPortal(
    <div className="open-door-alert-modal">
      <div className="open-door-alert-backdrop" />
      <div className="open-door-alert-box">
        <div className="open-door-alert-content">
          {lineas.map((line, idx) => (
            <p
              key={idx}
              style={{
                margin: idx === 0 ? "0 0 4px" : "4px 0 0",
              }}
            >
              {line}
            </p>
          ))}
        </div>

        <div className="open-door-alert-actions">
          {actions && actions.length > 0 ? (
            actions.map((a) => (
              <button
                key={a.label}
                className="open-door-alert-btn"
                onClick={a.onClick}
              >
                {a.label}
              </button>
            ))
          ) : (
            onClose && (
              <button
                className="open-door-alert-btn"
                onClick={onClose}
              >
                OK
              </button>
            )
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
