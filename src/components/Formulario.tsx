import React, { useState } from "react";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { db } from "../utils/firebaseConfig";
import logo from "../assets/LOGO2.png";
import "../styles/formulario.css"; 

const infoTexto = (
  <div className="form-info-text">
    <h2> 🎉 Participa por tu bono de descuento</h2>
    <p style={{ textAlign:"center" }}>
     <strong><h3>🚪✨ “Abre la puerta de tu Club de Campo” 🔑🎁</h3> </strong>
    </p>

   

  </div>


);
interface FormData {
  nombre: string;
  documento: string;
  telefono: string;
}
interface Props {
  onCompletado: (datos: FormData) => void;
}
const Formulario: React.FC<Props> = ({ onCompletado }) => {
  const [form, setForm] = useState({
    nombre: "",
    documento: "",
    telefono: "",
  });
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
    setError("");
    if (!form.nombre || !form.documento || !form.telefono) {
      setError("Por favor, completa todos los campos.");
      return;
    }
    setCargando(true);
    try {
      const q = query(collection(db, "participantes"), where("documento", "==", form.documento));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setError("Este documento ya participó anteriormente 🚫");
        setCargando(false);
        return;
      }
      await addDoc(collection(db, "participantes"), {
        ...form,
        fecha: new Date(),
        premio: null,
      });
      onCompletado(form);
    } catch (err) {
      console.error(err);
      setError("Ocurrió un error al registrar. Intenta nuevamente.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="page-center">
      <div className="logo-section">
        <img src={logo} alt="Logo Meraki" className="form-logo" />
      </div>
      <div className="formulario-contenedor">
        {infoTexto}
        <form className="formulario" onSubmit={handleSubmit}>
          <div className="inputs-flex">
            <div className="inputs-col">
              <div className="campo">
                <label>Nombre completo</label>
                <input type="text" name="nombre" placeholder="Ingresa tu nombre completo" value={form.nombre} onChange={handleChange} />
              </div>
              <div className="campo">
                <label>Documento de identidad</label>
                <input type="text" name="documento" placeholder="Número de documento" value={form.documento} onChange={handleChange} />
              </div>
              <div className="campo">
                <label>Teléfono</label>
                <input type="tel" name="telefono" placeholder="Número de contacto" value={form.telefono} onChange={handleChange} />
              </div>
            </div>
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit" disabled={cargando}>
            {cargando ? "Guardando..." : "Continuar"}
          </button>
          <div className="logo-firma">
            <p>
      <b>Al continuar, autorizas el uso de tus datos conforme a nuestra  politica de datos, consulta terminos y condiciones en el enlace. </b>
      <a href="https://grupoconstructormeraki.com.co/politica-de-informacion/">https://grupoconstructormeraki.com.co/politica-de-informacion/</a>
    </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Formulario;
