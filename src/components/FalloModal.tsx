import React from 'react';
import "../styles/falloModal.css"; 

interface FalloModalProps {
  mensaje: string;
  intentosRestantes: number;
  onClose: () => void;
  onIntentarOtraVez?: () => void;
}

export const FalloModal: React.FC<FalloModalProps> = ({
  mensaje,
  intentosRestantes,
  onClose,
  onIntentarOtraVez
}) => {
  return (
    <div className="modal-overlay">
      <div className="fallo-modal">
        <div className="fallo-icon">❌</div>
        <h3 className="fallo-titulo">{mensaje}</h3>
        
        {intentosRestantes > 0 ? (
          <div className="fallo-acciones">
            <button 
              className="btn-intentar-nuevamente"
              onClick={onIntentarOtraVez}
            >
              🔄 Intentar otra vez
            </button>
         
          </div>
        ) : (
          <div className="fallo-final">
            <p>¡Gracias por participar!</p>
            <button 
              className="btn-descargar-certificado"
              onClick={onClose}
          
            >
              Finalizar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
