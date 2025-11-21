import { db } from "../utils/firebaseConfig";
import { collection, query, where, getDocs, updateDoc,  } from "firebase/firestore";



export async function actualizarPremio(documento: string, premio: string,  uuidPremio: string) {
  const q = query(collection(db, "participantes"), where("documento", "==", documento));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    const docRef = querySnapshot.docs[0].ref;
    await updateDoc(docRef, { premio, uuidPremio  });
    return true;
  }
  return false;
}

export async function consultarPremioPorUUID(uuid: string): Promise<any> {
  const ref = query(collection(db, "participantes"), where("uuidPremio", "==", uuid));
  const snap = await getDocs(ref);
  if (!snap.empty) return snap.docs[0].data();
  return null;
}