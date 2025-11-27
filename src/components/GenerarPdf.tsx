// src/utils/generarPDF.ts
import jsPDF from "jspdf";
import QRCode from "qrcode";
import fondo from "../assets/bono.png";
import type { Usuario } from "../types"

const BASE_URL = "hhttps://premio-puerta.vercel.app";

export async function generarPDF(usuario: Usuario, premio: string, uuidPremio: string) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = 210;
  

  doc.addImage(fondo, "JPEG", 0, 0, pageWidth, 297);


  const qrData = `${BASE_URL}/consulta-premio?codigo=${uuidPremio}`;
  const qrImg = await QRCode.toDataURL(qrData);

  
  doc.setFontSize(13);
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.text(`Nombre: ${usuario.nombre}`, 70, 155, { align: "center", maxWidth: 100 });

  
  doc.text(`Documento: ${usuario.documento}`, 25, 165, { align: "left", maxWidth: 55 });


  doc.setTextColor(255, 215, 0); 
  doc.text(`Premio: ${premio}`, 25, 175, { align: "left", maxWidth: 55 });

  
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`Fecha: ${new Date().toLocaleString()}`, 25, 185, { align: "left", maxWidth: 55 });


  doc.setFontSize(10);
  doc.setTextColor(200, 200, 200);
  doc.text("Escanea el QR", 145, 155, { align: "center" });
  doc.text("para validar", 145, 160, { align: "center" });
  doc.text("tu premio", 145, 165, { align: "center" });


  doc.addImage(qrImg, "PNG", 125, 168, 40, 40);

  doc.save(`Premio_${usuario.documento}.pdf`);
}