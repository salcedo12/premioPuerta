// src/components/ParticipanteService.ts
import { db } from "../utils/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import type { Usuario } from "../types";

export const registrarParticipante = async (
  usuario: Usuario,
  premio: string
) => {
  const participantesRef = collection(db, "participantes");
  await addDoc(participantesRef, {
    nombre: usuario.nombre,
    documento: usuario.documento,
    telefono: usuario.telefono,
    correo: usuario.correo,
    terrenoInteresado: usuario.terrenoInteresado,
    premio,
    ciudad: usuario.ciudad,
    fecha: serverTimestamp(),
  });
};
