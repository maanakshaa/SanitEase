import { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import { collection, addDoc, onSnapshot } from "firebase/firestore";

const useToilet = () => {
  const [toilets, setToilets] = useState([]);

  const addToilet = async (toiletData) => {
    try {
      const docRef = await addDoc(collection(db, "toilets"), toiletData);
      console.log("Toilet added with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding toilet: ", e);
    }
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "toilets"), (snapshot) => {
      const toiletList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setToilets(toiletList);
    });

    
    return () => unsubscribe();
  }, []);

  return { toilets, addToilet };
};

export default useToilet;
