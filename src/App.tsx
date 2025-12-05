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
     terrenoInteresado: string; 
  } | null>(null);

  const handleCompletado = (datos: {
    nombre: string;
    documento: string;
    telefono: string;
    correo: string;
    ciudad: string;
     terrenoInteresado: string; 
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



// import { useState } from "react";
// import { HashRouter, Routes, Route } from "react-router-dom";
// import Formulario from "./components/Formulario";
// import OpenDoor from "./components/OpenDoor";
// import ConsultaPremio from "./components/ConsultaPremio";
// import Participantes from './components/Participantes';

// import "./App.css";

// const usuarioMock = {
//   nombre: "Juan Pérez",
//   documento: "12345678",
//   telefono: "555-1234567",
//   correo: "juan@example.com",
//   ciudad: "Ciudad Ejemplo",
//   terrenoInteresado: "Terreno A",
// };

// function App() {
//   const [completado, setCompletado] = useState(true); // Comienza en true para saltar el formulario
//   const [usuario, setUsuario] = useState<{
//     nombre: string;
//     documento: string;
//     telefono: string;
//     correo: string;
//     ciudad: string;
//     terrenoInteresado: string;
//   } | null>(usuarioMock);

//   const handleCompletado = (datos: {
//     nombre: string;
//     documento: string;
//     telefono: string;
//     correo: string;
//     ciudad: string;
//     terrenoInteresado: string;
//   }) => {
//     setUsuario(datos);
//     setCompletado(true);
//   };

//   return (
//     <HashRouter>
//       <div className="app-contenedor">
//         <Routes>
//           <Route
//             path="/"
//             element={
//               !completado ? (
//                 <Formulario onCompletado={handleCompletado} />
//               ) : (
//                 <OpenDoor
//                   usuario={usuario}
//                   onReiniciar={() => {
//                     setCompletado(false);
//                     setUsuario(null);
//                   }}
//                 />
//               )
//             }
//           />
//           <Route path="/consulta-premio" element={<ConsultaPremio />} />
//           <Route path="/participantes" element={<Participantes />} />
//         </Routes>
//       </div>
//     </HashRouter>
//   );
// }

// export default App;