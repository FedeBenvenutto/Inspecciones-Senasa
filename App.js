import React, { useContext, useEffect, useRef, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import { createNativeStackNavigator  } from "@react-navigation/stack";
import { UserContext, UserProvider } from "./Context/UserContext";
import Login from "./screens/Login";
// import { NotificationsProvider } from "./Context/Notifications";
import VerIngresos from "./screens/VerIngresos";
import NuevoIngreso from "./screens/NuevoIngreso";
import IngresoDetalle from "./screens/IngresoDetalle";
import Actas from "./screens/Actas";
import * as Notifications from 'expo-notifications';
import Registros from "./screens/Registros";
// import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Hubo un error en los permisos de la notificaciones");
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
    } else {
      alert("Must use physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return token;
  }

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
      });
    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  
  const Stack = createNativeStackNavigator();
  function MyStack() {
    const { currentUserId } = useContext(UserContext);
    console.log(currentUserId)
    if (!currentUserId) {
      return <Login 
       expoPushToken={expoPushToken}
      />;
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

  return (
    <UserProvider>
      {/* <NotificationsProvider> */}
          <NavigationContainer>
            <MyStack />
          </NavigationContainer>
      {/* </NotificationsProvider> */}
    </UserProvider>
  );
}