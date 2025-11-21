import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { consultarPremioPorUUID } from "../components/PremioService";
import bono from "../assets/bono.png";

const ConsultaPremio = () => {
  const [searchParams] = useSearchParams();
  const codigo = searchParams.get("codigo");
  const [resultado, setResultado] = useState<any>(null);

  useEffect(() => {
    if (codigo) {
      consultarPremioPorUUID(codigo).then(setResultado);
    }
  }, [codigo]);

  if (resultado === null) return <p style={{ color: "#fff" }}>Cargando...</p>;
  if (!resultado) return <p style={{ color: "#fff" }}>No se encontró ningún premio con ese código QR.</p>;

  return (
    <div className="consulta-container"
      style={{
        width: "100vw",
        minHeight: "100vh",
        background: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{
        position: "relative",
        width: 490,

        maxWidth: "97vw",
        minHeight: 320,
        height:"auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 19,
     
      }}>
     <img src={bono} alt="Bono de descuento" style={{
          width: "100%", height: "100%", objectFit: "cover",
          borderRadius: 18, boxShadow: "0 0 36px 5px #d4af37"
        }} />
 
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            width: "100%",
            transform: "translateY(-10%) translateX(-5%)",
        
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 3,
            padding: "0 18px"
          }}
        >
          <div
            style={{
              color: "#fff",
              fontWeight: "bold",
              fontSize: "1rem",
              margin: "8px 0 8px 0",
              textShadow: "1px 1px 6px #000"
            }}
          >
            Nombre: {resultado.nombre}
          </div>
          <div
            style={{
              color: "#fff",
              fontWeight: "bold",
              fontSize: ".97rem",
              margin: "4px 0 8px 0"
            }}
          >
            Documento: {resultado.documento}
          </div>
          <div
            style={{
              color: "#fff",
              fontSize: ".96rem",
              fontFamily: "monospace",
              margin: "4px 0 8px 0"
            }}
          >
            Fecha: {resultado.fecha && resultado.fecha.toDate ? resultado.fecha.toDate().toLocaleString() : String(resultado.fecha)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultaPremio;
