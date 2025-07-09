// src/screens/AddToiletScreen.js
import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import useToilet from "../src/hooks/useToilet";
import Toast from "react-native-toast-message"; // Import Toast

const AddToiletScreen = () => {
  const navigation = useNavigation();
  const { addToilet } = useToilet();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [accessible, setAccessible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleMapPress = (event) => {
    const { coordinate } = event.nativeEvent;
    setSelectedLocation(coordinate);
  };

  const handleSubmit = async () => {
    if (!selectedLocation) {
      alert("Please select a location on the map.");
      return;
    }
    const toiletData = {
      name,
      latitude: selectedLocation.latitude,
      longitude: selectedLocation.longitude,
      description,
      accessible,
    };
    await addToilet(toiletData);

   
    Toast.show({
      text1: "Success",
      text2: "Toilet added successfully!",
      type: "success",
    });

    navigation.goBack();
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Toilet</Text>
      <TextInput
        placeholder="Toilet Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 10.0,
          longitude: 78.0,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onPress={handleMapPress}
      >
        {selectedLocation && (
          <Marker coordinate={selectedLocation} title="Selected Location" />
        )}
      </MapView>
      <Button title="Add Toilet" onPress={handleSubmit} />
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
  map: {
    width: "100%",
    height: 300,
    marginBottom: 10,
  },
});

export default AddToiletScreen;
