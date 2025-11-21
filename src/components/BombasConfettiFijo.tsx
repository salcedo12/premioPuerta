import React, { useEffect, useState } from "react";
import Confetti from "react-confetti";
import LucesReflejo from "./LucesReflejo";

const NUM_BOMBAS = 40;
function getBombasSubiendo(width: number, height: number) {
 
  const modalWidth = width * 0.38;
  const modalHeight = height * 0.29;
  const modalLeft = (width - modalWidth) / 2;
  const modalRight = modalLeft + modalWidth;
  const modalTop = (height - modalHeight) / 2;
  const modalBottom = modalTop + modalHeight;

  function fueraDelModal(x: number, y: number) {
    return (
      x < modalLeft - 30 || x > modalRight + 30 ||
      y < modalTop - 30 || y > modalBottom + 30
    );
  }

  const bombasArr = [];
  let intentos = 0;
  while (bombasArr.length < NUM_BOMBAS && intentos < NUM_BOMBAS * 9) {
    const x = Math.random() * width;
    const y = Math.random() * 80 + height + 40; 
    if (fueraDelModal(x, y)) {
      bombasArr.push({
        left: x,
        top: y,
        size: Math.random() * 22 + 42,
        speed: Math.random() * 1.1 + 0.7,
        rotation: Math.random() * 360,
        src: Math.random() > 0.47 ? "/bomba-gold.png" : "/bomba-black.png"
      });
    }
    intentos++;
  }
  return bombasArr;
}

const BombasYConfettiSubiendo: React.FC = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const [bombas, setBombas] = useState(() => getBombasSubiendo(width, height));

  useEffect(() => {
    let id: NodeJS.Timeout;
    function animar() {
      setBombas(prevBombas =>
        prevBombas.map(bomba => {
          let newTop = bomba.top - bomba.speed; // SUBE
          let newRotation = bomba.rotation + bomba.speed * 1.3;
          let newLeft = bomba.left;
          if (newTop < -bomba.size - 14) {
            newTop = Math.random() * 80 + height + 40; 
            newLeft = Math.random() * width;
          }
          return {
            ...bomba,
            top: newTop,
            left: newLeft,
            rotation: newRotation
          };
        })
      );
      id = setTimeout(animar, 23);
    }
    animar();
    return () => clearTimeout(id);
  }, [width, height]);

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      width: "100vw",
      height: "100vh",
      pointerEvents: "none",
      zIndex: 13000,
      overflow: "hidden"
    }}>
       <LucesReflejo />
          <LucesReflejo />
   
      <Confetti
        width={width}
        height={height}
        numberOfPieces={520}
        recycle={true}
        gravity={0.13}
        initialVelocityY={3}
        colors={["#FFD700", "#212121", "#fff36b"]}
      />
     
      {bombas.map((bomba, idx) => (
        <img
          key={idx}
          src={bomba.src}
          alt="bomba"
          style={{
            position: "absolute",
            left: bomba.left,
            top: bomba.top,
            width: `120px`,
            height: `100px`,
            transform: `rotate(${bomba.rotation}deg)`,
            opacity: 0.97,
            zIndex: 13001,
            pointerEvents: "none",
            userSelect: "none"
          }}
          draggable={false}
        />
      ))}
    </div>
  );
};

export default BombasYConfettiSubiendo;
