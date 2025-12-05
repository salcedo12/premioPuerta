import { onDocumentCreated } from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";

admin.initializeApp();

export const notificarGanador = onDocumentCreated(
  "participantes/{id}",
  async (event) => {
    const snap = event.data;
    if (!snap) {
      logger.warn("No hay snapshot en el evento");
      return;
    }

    const data = snap.data() as any;
    if (!data || data.premio !== "20 Millones") return;

    await admin.firestore().collection("mail").add({
      to: ["sistemas1.meraki@gmail.com"],
      message: {
        subject: "Nuevo ganador del premio",
        html: `
          <p>Se registró un nuevo ganador:</p>
          <ul>
            <li>Nombre: ${data.nombre}</li>
            <li>Documento: ${data.documento}</li>
            <li>Teléfono: ${data.telefono}</li>
            <li>Correo: ${data.correo}</li>
            <li>Terreno: ${data.terrenoInteresado}</li>
            <li>Ciudad: ${data.ciudad}</li>
            <li>Premio: ${data.premio}</li>
          </ul>
        `,
      },
    });
  }
);
