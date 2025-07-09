
import { useState, useEffect } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import Geolocation from "react-native-geolocation-service"; 

const useLocation = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  const requestLocationPermission = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message: "This app needs access to your location.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        setError(err.message); 
        return false;
      }
    } else {
      return true; 
    }
  };

  const getCurrentLocation = () => {
    requestLocationPermission().then((granted) => {
      if (granted) {
        console.log("Location permission granted");
        Geolocation.getCurrentPosition(
          (position) => {
            console.log("Current Position:", position);
            const { latitude, longitude } = position.coords;
            setLocation({ latitude, longitude });
          },
          (error) => {
            console.error("Geolocation error:", error);
            setError(error.message); 
          },
          { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
      } else {
        console.log("Location permission denied");
        setError("Location permission denied");
      }
    });
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return { location, error };
};

export default useLocation;
