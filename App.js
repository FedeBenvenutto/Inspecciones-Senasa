import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { UserContext, UserProvider } from "./Context/UserContext";
import Login from "./screens/Login";
import { NotificationsProvider } from "./Context/Notifications";
import VerIngresos from "./screens/VerIngresos";
import NuevoIngreso from "./screens/NuevoIngreso";
import IngresoDetalle from "./screens/IngresoDetalle";

const Stack = createStackNavigator();
function MyStack() {
  const { currentUserId } = useContext(UserContext);
  console.log(currentUserId)
  if (!currentUserId) {
    return <Login />;
  }
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="VerIngresos"
        component={VerIngresos}
        options={{ title: "Ver ingresos" }}
      />
      <Stack.Screen
        name="NuevoIngreso"
        component={NuevoIngreso}
        options={{ title: "Nuevo Ingreso" }}
      />
      <Stack.Screen
        name="IngresoDetalle"
        component={IngresoDetalle}
        options={{ title: "Detalle del Ingreso" }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <UserProvider>
      <NotificationsProvider>
          <NavigationContainer>
            <MyStack />
          </NavigationContainer>
      </NotificationsProvider>
    </UserProvider>
  );
}