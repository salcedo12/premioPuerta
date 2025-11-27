
import ReactDOM from "react-dom";
import BombasConfettiFijo from "./BombasConfettiFijo"; 
import premio from "../assets/premio.png"
type PremioModalProps = {
  premio: string;
  onDescargar: () => void;
  onVer: () => void;
};

export function PremioModal({  onDescargar,  }: PremioModalProps) {
  return ReactDOM.createPortal(
    <div className="premio-modal-portal">
    
      <div className="premio-modal-portal">
      <div className="modal-portal-overlay" style={{ pointerEvents: "none" }} />
        <div className="confetti-bg show-bombas">
    <BombasConfettiFijo />
  </div>
  
      <div className="premio-solo-container" role="dialog" aria-modal="true">
        <div className="premio-solo-row">
            <img src={premio} alt="Imagen del premio" className="premio-bg-img" />
          <div className="premio-solo-content">
        
            <div className="botones-premio">
              <button className="boton-descarga" onClick={onDescargar}>Descargar recompensa</button>
    
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>,
    document.body
  );
}


type AlertModalProps = {
  mensaje: string;
  onClose: () => void;
};

export function AlertModal({ mensaje, onClose }: AlertModalProps) {
  return ReactDOM.createPortal(
    <div className="open-door-alert-modal">
      <div className="open-door-alert-backdrop" style={{ pointerEvents: "none" }} />
      <div className="open-door-alert-box">
        <div className="open-door-alert-content">{mensaje}</div>
        <button className="open-door-alert-btn" onClick={onClose}>OK</button>
      </div>
    </div>,
    document.body
  );
}
