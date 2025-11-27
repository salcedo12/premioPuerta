import  { useState } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Formulario from "./components/Formulario";
import OpenDoor from "./components/OpenDoor";
import ConsultaPremio from "./components/ConsultaPremio";
import Participantes from './components/Participantes';

import "./App.css";
function App() {
  const [completado, setCompletado] = useState(false);
  const [usuario, setUsuario] = useState<{
    nombre: string;
    documento: string;
    telefono: string;
    correo: string;
    ciudad: string;
  } | null>(null);

  const handleCompletado = (datos: {
    nombre: string;
    documento: string;
    telefono: string;
    correo: string;
    ciudad: string;
  }) => {
    setUsuario(datos);
    setCompletado(true);
  };

  return (
    <HashRouter>
      <div className="app-contenedor">
        <Routes>
          <Route
  path="/"
  element={
    !completado ? (
      <Formulario onCompletado={handleCompletado} />
    ) : (
      <OpenDoor
        usuario={usuario}
        onReiniciar={() => {
          setCompletado(false);
          setUsuario(null);
        }}
      />
    )
  }
/>
          <Route path="/consulta-premio" element={<ConsultaPremio />} />
         <Route path="/participantes" element={<Participantes />} />

        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;

// import { useState, useEffect } from "react";

// function App() {
//   const [, setCompletado] = useState(false);
//   const [usuario, setUsuario] = useState<{ nombre: string; documento: string; telefono: string; correo: string; ciudad: string;} | null>(null);

//   // Recupera el usuario si existe (al recargar)
//   useEffect(() => {
//     const datos = localStorage.getItem("usuario");
//     if (datos) {
//       setUsuario(JSON.parse(datos));
//       setCompletado(true);
//     }
//   }, []);

// const handleCompletado = (datos: {
//   nombre: string;
//   documento: string;
//   telefono: string;
//   correo: string;
//   ciudad: string;
// }) => {
//   setUsuario(datos);
//   setCompletado(true);
//   localStorage.setItem("usuario", JSON.stringify(datos));
// };

//   return (
//     <BrowserRouter>
//       <div className="app-contenedor">
//         <Routes>
//         <Route path="/" element={<OpenDoor usuario={usuario} />} />
//           <Route path="/consulta-premio" element={<ConsultaPremio />} />
//         </Routes>
//       </div>
//     </BrowserRouter>
//   );
// }

// export default App;
