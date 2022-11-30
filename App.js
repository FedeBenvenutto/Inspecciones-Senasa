import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import { createNativeStackNavigator  } from "@react-navigation/stack";
import { UserContext, UserProvider } from "./Context/UserContext";
import Login from "./screens/Login";
import { NotificationsProvider } from "./Context/Notifications";
import VerIngresos from "./screens/VerIngresos";
import NuevoIngreso from "./screens/NuevoIngreso";
import IngresoDetalle from "./screens/IngresoDetalle";
import Actas from "./screens/Actas";
import * as Notifications from 'expo-notifications';
import Registros from "./screens/Registros";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const Stack = createNativeStackNavigator();
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
        options={{ title: "Detalle" }}
      />
      <Stack.Screen
        name="Actas"
        component={Actas}
        options={{ title: "Actas" }}
      />
      <Stack.Screen
        name="Registros"
        component={Registros}
        options={{ title: "Registros" }}
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