import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  FlatList,
  Alert,
  Linking,
} from "react-native";
import { auth, db } from "../firebaseConfig";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

const SOSScreen = () => {
  const [contacts, setContacts] = useState([]);
  const [contactName, setContactName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [sosMessage, setSosMessage] = useState("");

  const user = auth.currentUser;

  
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const q = query(
          collection(db, "contacts"),
          where("userId", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);
        const userContacts = querySnapshot.docs.map((doc) => doc.data());
        setContacts(userContacts);
      } catch (error) {
        console.error("Error fetching contacts: ", error);
      }
    };

    if (user) {
      fetchContacts();
    }
  }, [user]);

  const addContact = async () => {
    if (!contactName || !contactNumber) {
      Alert.alert("Empty Contact", "Please fill in both name and number.");
      return;
    }

    if (contacts.length < 3) {
      try {
        await addDoc(collection(db, "contacts"), {
          userId: user.uid,
          name: contactName,
          number: contactNumber,
        });
        setContacts((prevContacts) => [
          ...prevContacts,
          { name: contactName, number: contactNumber },
        ]);
        setContactName("");
        setContactNumber("");
      } catch (error) {
        Alert.alert("Error adding contact", error.message);
      }
    } else {
      Alert.alert(
        "Contact Limit Reached",
        "You can only add up to 3 contacts."
      );
    }
  };

  const sendSOS = () => {
    if (contacts.length === 0) {
      Alert.alert(
        "No Contacts",
        "Please add at least one contact to send SOS."
      );
      return;
    }

    const contactNumbers = contacts.map((contact) => contact.number).join(",");
    const message = "SOS! I need help, please reach me!";

    
    const url = `sms:${contactNumbers}?body=${encodeURIComponent(message)}`;

    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          Alert.alert(
            "SMS not supported",
            "Your device does not support sending SMS."
          );
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((error) => console.error("Error opening SMS app: ", error));
  };

  const renderItem = ({ item }) => (
    <View style={styles.contactItem}>
      <Text style={styles.contactText}>
        {item.name}: {item.number}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SOS Contacts</Text>

      <TextInput
        style={styles.input}
        placeholder="Contact Name"
        value={contactName}
        onChangeText={setContactName}
      />
      <TextInput
        style={styles.input}
        placeholder="Contact Number"
        value={contactNumber}
        onChangeText={setContactNumber}
        keyboardType="phone-pad"
      />
      <Button title="Add Contact" onPress={addContact} />

      <FlatList
        data={contacts}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />

      <Button title="Send SOS" onPress={sendSOS} />

      {sosMessage ? (
        <Text style={styles.successMessage}>{sosMessage}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  contactItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  contactText: {
    fontSize: 18,
  },
  successMessage: {
    marginTop: 20,
    fontSize: 16,
    color: "green",
    textAlign: "center",
  },
});

export default SOSScreen;
