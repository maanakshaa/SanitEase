import { useState, useEffect } from "react";
import { firestore } from "../../firebaseConfig";

const useContacts = () => {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const contactsSnapshot = await firestore.collection("contacts").get();

        const contactsList = contactsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setContacts(contactsList);
      } catch (error) {
        console.error("Error fetching contacts: ", error);
      }
    };

    fetchContacts();
  }, []);

  const addContact = async (contact) => {
    try {
      const docRef = await firestore.collection("contacts").add(contact);
      setContacts([...contacts, { id: docRef.id, ...contact }]);
    } catch (error) {
      console.error("Error adding contact: ", error);
    }
  };

  return {
    contacts,
    addContact,
  };
};

export default useContacts;
