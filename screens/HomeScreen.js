import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Button,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import useToilet from "../src/hooks/useToilet"; 

const HomeScreen = ({ userEmail, onLogout, navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [publicMarkers, setPublicMarkers] = useState([]);
  const [loading, setLoading] = useState(true); 
  const { toilets } = useToilet(); 

  const firstLetter = userEmail ? userEmail.charAt(0).toUpperCase() : "U";

 
  const fetchOSMPlaces = async (latitude, longitude, radius = 2000) => {
    const overpassUrl = "https://overpass-api.de/api/interpreter";
    const query = `
      [out:json];
      (
        node["amenity"="public_bath"](around:${radius},${latitude},${longitude});
        node["amenity"="theatre"](around:${radius},${latitude},${longitude});
        node["amenity"="fuel"](around:${radius},${latitude},${longitude});
        node["leisure"="park"](around:${radius},${latitude},${longitude});
      );
      out body;
    `;

    try {
      const response = await fetch(overpassUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `data=${encodeURIComponent(query)}`,
      });
      const data = await response.json();
      return data.elements;
    } catch (error) {
      console.error("Error fetching OSM places:", error);
      return [];
    }
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert(
          "Location permission not granted. Please enable location services."
        );
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation(location.coords);

      
      const osmPlaces = await fetchOSMPlaces(
        location.coords.latitude,
        location.coords.longitude
      );

      const formattedMarkers = osmPlaces.map((place) => ({
        id: place.id,
        latitude: place.lat,
        longitude: place.lon,
        title: place.tags.amenity || place.tags.leisure || "Public Place",
        description: place.tags.name || "Public Location",
      }));

      setPublicMarkers(formattedMarkers);
      setLoading(false); 
    })();
  }, []);

  const handleSOS = () => {
    navigation.navigate("SOSScreen");
  };

  const handleMarkToilet = () => {
    navigation.navigate("AddToiletScreen");
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.accountIcon}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.accountIconText}>{firstLetter}</Text>
      </TouchableOpacity>

      <Text style={styles.locationText}>Your Location</Text>
      {userLocation && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
        >
          <Marker
            coordinate={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
            title={"Your Location"}
            description={"This is where you are currently located."}
          />

          {/* Public Places Markers */}
          {publicMarkers.map((marker) => (
            <Marker
              key={marker.id}
              coordinate={{
                latitude: marker.latitude,
                longitude: marker.longitude,
              }}
              title={marker.title}
              description={marker.description}
            />
          ))}

          {/* Added Toilets Markers */}
          {toilets.map((toilet) => (
            <Marker
              key={toilet.id}
              coordinate={{
                latitude: toilet.latitude,
                longitude: toilet.longitude,
              }}
              title={toilet.name}
              description={toilet.description}
              pinColor="blue" 
            />
          ))}
        </MapView>
      )}

      <Modal transparent={true} visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Account Options</Text>
            <Button title="SOS" onPress={handleSOS} />
            <Button title="Mark Toilet" onPress={handleMarkToilet} />
            <Button title="Logout" color="red" onPress={onLogout} />
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  accountIcon: {
    position: "absolute",
    top: 20,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,  
  },
  accountIconText: {
    color: "#fff",
    fontSize: 18,
  },
  locationText: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 10,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

export default HomeScreen;
