import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AddToiletScreen from "../screens/AddToiletScreen";
import MapPickerScreen from "../screens/MapPickerScreen";

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="AddToiletScreen" component={AddToiletScreen} />
      <Stack.Screen name="MapPickerScreen" component={MapPickerScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
