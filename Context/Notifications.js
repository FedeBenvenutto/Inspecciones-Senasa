import React, {
  useState,
  useEffect,
  createContext,
  useRef,
  useContext,
} from "react";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { UserContext } from "../Context/UserContext";

export const NotificationContext = createContext();
export const NotificationsProvider = ({ children }) => {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const { currentUserId, users } = useContext(UserContext);

  async function sendPushNotification(ingreso, accion) {
    // console.log(ingreso)
    const currentUser = users.filter((user) => user.Uid === currentUserId);
    const nocurrentUser = users.filter((user) => user.Uid !== currentUserId);
    nocurrentUser.map(async (user) => {
      const message = {
        to: user.Token,
        sound: "default",
        title: `${currentUser[0].Nombre} ${accion}  un vivero`,
        body: `${ingreso.Nombre} de ${ingreso.Localidad}`,
        data: { someData: "goes here" },
      };
      await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Accept-encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
        
      });
    });
  }
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
  return (
    <NotificationContext.Provider
      value={{
        expoPushToken,
        notification,
        sendPushNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
