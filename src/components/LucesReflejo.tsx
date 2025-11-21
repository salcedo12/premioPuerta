import React from "react";

// Reflectores haciendo una X (uno dorado y otro negro), animados en cruz
const LucesReflejo: React.FC = () => (
  <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 13200 }}>
    {/* Reflector dorado desde esquina inferior izquierda */}
    <div
      style={{
        position: "absolute",
        left: "-70px",
        bottom: "-170px",
        width: "480px",
        height: "1100px",
        background:
          "radial-gradient(ellipse at center, rgba(255,223,70,0.29) 0%, rgba(255,215,0,0.19) 43%, rgba(255,214,56,0.06) 87%, rgba(255,215,0,0.01) 100%)",
        filter: "blur(35px)",
        transform: "rotate(-23deg)",
        opacity: 0.67,
        animation: "reflector-dorado-x 6.8s ease-in-out infinite alternate"
      }}
    />
    {/* Reflector negro desde esquina superior derecha */}
<div
  style={{
    position: "absolute",
    right: "-120px",
    top: "-180px",
    width: "580px",
    height: "1350px",
    background:
      "radial-gradient(ellipse at center, rgba(40,40,44,0.68) 0%, rgba(30,30,34,0.49) 27%, rgba(44,42,46,0.33) 54%, rgba(30,30,32,0.2) 82%, rgba(0,0,0,0.12) 97%, rgba(0,0,0,0.01) 100%)",
    filter: "blur(38px)",
    transform: "rotate(27deg)",
    opacity: 0.6,
    animation: "reflector-negro-x 7.1s ease-in-out infinite alternate"
  }}
/>
    <style>
      {`
      @keyframes reflector-dorado-x {
        0%   { left: -70px; bottom: -170px; transform: rotate(-26deg) scale(1,1.01);}
        34%  { left: 47vw; bottom: 19vh; transform: rotate(-12deg) scale(1.08,1.04);}
        66%  { left: 8vw; bottom: 6vh; transform: rotate(-36deg) scale(1.04,1.1);}
        100% { left: -61px; bottom: -120px; transform: rotate(-21deg) scale(1,1.02);}
      }
      @keyframes reflector-negro-x {
        0%   { right: -74px; top: -120px; transform: rotate(21deg) scale(1.02,1.02);}
        31%  { right: 41vw; top: 22vh; transform: rotate(36deg) scale(1.10,1.01);}
        68%  { right: 4vw; top: 4vh; transform: rotate(13deg) scale(1.06,1.08);}
        100% { right: -61px; top: -62px; transform: rotate(23deg) scale(1,0.98);}
      }
      `}
    </style>
  </div>
);

export default LucesReflejo;
