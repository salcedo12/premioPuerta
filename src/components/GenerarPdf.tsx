import jsPDF from "jspdf";
import QRCode from "qrcode";
import type { Usuario } from "../types";

// Fondos por premio
import bono5 from "../assets/BONO5.jpg";
import bono10 from "../assets/BONO10.jpg";
import bono15 from "../assets/BONO15.jpg";
import bono20 from "../assets/BONO20.png";
import bono25 from "../assets/BONO25.jpg";
import bono30 from "../assets/BONO30.jpg";

const BASE_URL = "https://puertabono.grupoconstructormeraki.com.co/#";


function getFondoPorPremio(premio: string) {
  const numero = parseInt(premio); 

  switch (numero) {
    case 5:
      return bono5;
    case 10:
      return bono10;
    case 15:
      return bono15;
    case 20:
      return bono20;
    case 25:
      return bono25;
    case 30:
      return bono30;
    default:
      return bono5; 
  }
}

export async function generarPDF(
  usuario: Usuario,
  premio: string,
  uuidPremio: string
) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 210;

  // 1) Fondo según premio
  const fondo = getFondoPorPremio(premio);
  doc.addImage(fondo, "JPEG", 0, 0, pageWidth, 297);

  // 2) QR
  const qrData = `${BASE_URL}/consulta-premio?codigo=${uuidPremio}`;
  const qrImg = await QRCode.toDataURL(qrData);

  // 3) Textos
  doc.setFontSize(13);
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.text(`Nombre: ${usuario.nombre}`, 70, 155, {
    align: "center",
    maxWidth: 100,
  });

  doc.text(`Documento: ${usuario.documento}`, 25, 165, {
    align: "left",
    maxWidth: 55,
  });

  doc.setTextColor(255, 215, 0);
  doc.text(`Premio: ${premio}`, 25, 175, {
    align: "left",
    maxWidth: 55,
  });

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`Fecha: ${new Date().toLocaleString()}`, 25, 185, {
    align: "left",
    maxWidth: 55,
  });

  doc.setFontSize(10);
  doc.setTextColor(200, 200, 200);
  doc.text("Escanea el QR", 145, 155, { align: "center" });
  doc.text("para validar", 145, 160, { align: "center" });
  doc.text("tu premio", 145, 165, { align: "center" });

  doc.addImage(qrImg, "PNG", 125, 168, 40, 40);

  doc.save(`Premio_${usuario.documento}.pdf`);
}
