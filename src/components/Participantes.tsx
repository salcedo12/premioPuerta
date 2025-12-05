import React, { useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../utils/firebaseConfig";
import * as XLSX from "xlsx";
import "../styles/participantes.css";

interface Participante {
  id: string;
  nombre: string;
  documento: string;
  telefono: string;
  correo: string;
  terrenoInteresado: string;
  premio: string;
  ciudad: string;
  fecha?: { seconds: number; nanoseconds: number };
}

const Participantes: React.FC = () => {
  const [datos, setDatos] = useState<Participante[]>([]);
  const [datosFiltrados, setDatosFiltrados] = useState<Participante[]>([]);
  const [busquedaCedula, setBusquedaCedula] = useState("");

  useEffect(() => {
  const fetchData = async () => {
    const querySnapshot = await getDocs(collection(db, "participantes"));
    const docs = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Participante[];

    // 1) Ordenar por fecha DESC (más reciente primero)
    const ordenados = docs.sort((a, b) => {
      const fechaA = a.fecha ? a.fecha.seconds : 0;
      const fechaB = b.fecha ? b.fecha.seconds : 0;
      return fechaB - fechaA;
    });

    // 2) Quedarse solo con la jugada más reciente por documento (cédula)
    const vistos = new Set<string>();
    const unicosPorDocumento: Participante[] = [];

    for (const p of ordenados) {
      const cedula = p.documento ?? "";
      if (!vistos.has(cedula)) {
        vistos.add(cedula);
        unicosPorDocumento.push(p);
      }
    }

    setDatos(unicosPorDocumento);
    setDatosFiltrados(unicosPorDocumento);
  };

  fetchData();
}, []);
  
  useEffect(() => {
    if (busquedaCedula.trim() === "") {
      setDatosFiltrados(datos);
    } else {
      const filtrados = datos.filter(p =>
        p.documento?.toLowerCase().includes(busquedaCedula.toLowerCase())
      );
      setDatosFiltrados(filtrados);
    }
  }, [busquedaCedula, datos]);

  const descargarExcel = () => {
    const datosExcel = datosFiltrados.map(p => ({
      Nombre: p.nombre ?? "",
      Documento: p.documento ?? "",
      Teléfono: p.telefono ?? "",
      Correo: p.correo ?? "",
      "Terreno Interesado": p.terrenoInteresado ?? "",
      Premio: p.premio ?? "",
      Ciudad: p.ciudad ?? "",
      Fecha:
        p.fecha && typeof p.fecha === "object"
          ? new Date(p.fecha.seconds * 1000).toLocaleString()
          : "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(datosExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Participantes");

    const columnWidths = [
      { wch: 25 },
      { wch: 15 },
      { wch: 15 },
      { wch: 30 },
      { wch: 20 },
      { wch: 15 },
      { wch: 15 },
      { wch: 20 },
    ];
    worksheet["!cols"] = columnWidths;

    XLSX.writeFile(
      workbook,
      `Participantes_${busquedaCedula || "todos"}.xlsx`
    );
  };

  return (
    <div className="participantes-bg">
      <div className="tabla-container">
        <div className="header-participantes">
          <div className="titulo-participantes">Participantes</div>
          <div className="buscador-container">
            <input
              type="text"
              placeholder="Buscar por cédula..."
              value={busquedaCedula}
              onChange={e => setBusquedaCedula(e.target.value)}
              className="input-buscador"
            />
            
          </div>

          <button className="btn-descargar" onClick={descargarExcel}>
            📥 Descargar Excel
          </button>
        </div>

        <div className="resultados-info">
          Mostrando {datosFiltrados.length} de {datos.length} participantes
          {busquedaCedula && ` (filtrados por: "${busquedaCedula}")`}
        </div>

        <div className="tabla-scroll">
          <table className="tabla-participantes">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Documento</th>
                <th>Teléfono</th>
                <th>Correo</th>
                <th>Terreno Interesado</th>
                <th>Premio</th>
                <th>Ciudad</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {datosFiltrados.map(p => (
                <tr key={p.id}>
                  <td>{p.nombre ?? ""}</td>
                  <td>{p.documento ?? ""}</td>
                  <td>{p.telefono ?? ""}</td>
                  <td>{p.correo ?? ""}</td>
                  <td>{p.terrenoInteresado ?? ""}</td>
                  <td>{p.premio ?? ""}</td>
                  <td>{p.ciudad ?? ""}</td>
                  <td>
                    {p.fecha && typeof p.fecha === "object"
                      ? new Date(p.fecha.seconds * 1000).toLocaleString()
                      : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Participantes;