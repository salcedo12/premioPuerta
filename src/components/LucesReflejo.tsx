import React from "react";

const NUM_LUCES = 5;
const ANGULO_START = 60;
const ANGULO_END = 0;
const DESPLAZAMIENTO = 60; 
function generarHaces(
  color: "dorado" | "negro",
  leftOrRight: "left" | "right"
) {
  return Array.from({ length: NUM_LUCES }).map((_, i) => {
    const angulo =
      ANGULO_START - ((ANGULO_START - ANGULO_END) / (NUM_LUCES - 1)) * i;
    return (
      <div
        key={`${color}-${i}`}
        style={{
          position: "absolute",
          [leftOrRight]: "0",
          bottom: "0",
          width: "110px",
          height: "900px",
          background:
            color === "dorado"
              ? "radial-gradient(ellipse at 50% 100%, rgba(255,223,70,0.18) 0%, rgba(255,215,0,0.18) 62%, rgba(255,215,0,0.08) 100%)"
              : "radial-gradient(ellipse at 50% 100%, rgba(255,223,70,0.18) 0%, rgba(255,215,0,0.18) 62%, rgba(255,215,0,0.08) 100%)",
          filter: "blur(22px)",
          opacity: 0.82, 
          transform: `rotate(${leftOrRight === "left" ? angulo : -angulo}deg)`,
          animation: `${leftOrRight === "left" ? "moverIzq" : "moverDer"} 2.5s ease-in-out ${0.2*i}s infinite alternate`
        }}
      />
    );
  });
}
const LucesReflejo: React.FC = () => (
  <div
    style={{
      position: "fixed",
      inset: 0,
      pointerEvents: "none",
      zIndex: 13200
    }}
  >
    <style>{`
      @keyframes moverIzq {
        0%   { left: 0px; }
        100% { left: ${DESPLAZAMIENTO}px; }
      }
      @keyframes moverDer {
        0%   { right: 0px; }
        100% { right: ${DESPLAZAMIENTO}px; }
      }
    `}</style>

    {generarHaces("dorado", "left")}
  
    {generarHaces("negro", "right")}


    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "52%",
        transform: "translate(-50%, -50%)",
        width: "110px",
        height: "900px",
        background: "radial-gradient(ellipse at center, rgba(255,232,80,0.22) 0%, rgba(255,214,56,0.0) 100%)",
        opacity: 0.70,
        filter: "blur(25px)"
      }}
    />
  </div>
);

export default LucesReflejo;