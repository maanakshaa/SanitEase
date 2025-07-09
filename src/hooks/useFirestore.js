import { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import { collection, addDoc, getDocs } from "firebase/firestore";

const useFirestore = () => {
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState(null);

  const addContact = async (contactName, contactNumber) => {
    try {
      const docRef = await addDoc(collection(db, "sosContacts"), {
        name: contactName,
        number: contactNumber,
      });
      console.log("Document written with ID: ", docRef.id);
      fetchContacts();
    } catch (e) {
      setError(e);
      console.error("Error adding document: ", e);
    }
  };

  const fetchContacts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "sosContacts"));
      const fetchedContacts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setContacts(fetchedContacts);
    } catch (e) {
      setError(e);
      console.error("Error fetching contacts: ", e);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  return {
    contacts,
    addContact,
    error,
  };
};

export default useFirestore;
