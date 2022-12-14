import "react-native-gesture-handler";
import React, { useContext, useEffect, useRef, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { UserContext, UserProvider } from "./Context/UserContext";
import Login from "./screens/Login";
import VerIngresos from "./screens/VerIngresos";
import NuevoIngreso from "./screens/NuevoIngreso";
import IngresoDetalle from "./screens/IngresoDetalle";
import Actas from "./screens/Actas";
import * as Notifications from "expo-notifications";
import Registros from "./screens/Registros";
import * as Device from "expo-device";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import { Button } from "@rneui/base";
import { auth } from "./database/firebase.js";
import { signOut } from "firebase/auth";
import Icon from "react-native-vector-icons/FontAwesome";
import senasa from "./assets/senasa.png";
import NetInfo from "@react-native-community/netinfo";
import { StatusBar } from "expo-status-bar";

const heightY = Dimensions.get("window").height;

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
  const [isConnected, setIsConnected] = useState(false);
  useEffect(() => {
    NetInfo.fetch().then((state) => {
      state.isConnected ? setIsConnected(true) : setIsConnected(false);
    });
  }, []);

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
      token = (
        await Notifications
          .getExpoPushTokenAsync
          // {experienceId:'@federicoand/Inpecciones-Senasa'}
          ()
      ).data;
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
      Notifications.addNotificationResponseReceivedListener((response) => {});
    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const Drawer = createDrawerNavigator();

  function MyDrawer() {
    const {
      currentUserId,
      currentUser,
      setLoading,
      setCurrentUserId,
      setUsers,
    } = useContext(UserContext);
    if (!currentUserId) {
      return <Login expoPushToken={expoPushToken} />;
    }
    const alertaConfirmacion = () => {
      Alert.alert(
        "Cerrando sesión",
        "¿Esta seguro?",
        [
          {
            text: "Confirmar",
            onPress: () => {
              setLoading(true);
              signOut(auth)
                .then(() => {
                  setLoading(false);
                  console.log("Sign-out successful");
                  setCurrentUserId(null);
                  setUsers(null);
                })
                .catch((error) => {
                  setLoading(false);
                  Alert.alert(error);
                });
            },
          },
          { text: "Cancelar", onPress: () => console.log("canceled") },
        ],
        {
          cancelable: true,
        }
      );
    };
    if (!isConnected) {
      <StatusBar style="dark" backgroundColor="transparent" />;
      return (
        <View style={styles.loader}>
          <Text> No se ha detectado una conexión a internet activa</Text>
          <Button
            onPress={() =>
              NetInfo.fetch().then((state) => {
                state.isConnected
                  ? setIsConnected(true)
                  : setIsConnected(false);
              })
            }
          >
            {" "}
            Reintentar{" "}
          </Button>
        </View>
      );
    }

    return (
      <Drawer.Navigator
        screenOptions={{
          drawerStyle: styles.drawerStyle,
          drawerLabelStyle: { fontSize: heightY * 0.021, marginStart: -20 },
          drawerActiveTintColor: "black",
          drawerInactiveTintColor: "#999999",
          drawerActiveBackgroundColor: "#60c5a8",
          sceneContainerStyle: styles.sceneContainer,
          drawerType: "slide",
          overlayColor: "transparent",
          headerShown: false,
        }}
        drawerContent={(props) => {
          return (
            <View style={styles.container}>
              <Image source={senasa} style={styles.image} />
              <View style={styles.view}>
                <Text style={styles.titulo}>INSPECCIONES</Text>
              </View>
              <DrawerContentScrollView style={styles.view}>
                <DrawerItemList {...props} />
              </DrawerContentScrollView>
              <View style={styles.view}>
                {currentUser && (
                  <View style={{ flexDirection: "row" }}>
                    <Icon name="user-circle-o" size={25} />
                    <Text style={styles.text}>Usuario:</Text>
                    <Text style={styles.text}>{currentUser[0].Nombre}</Text>
                  </View>
                )}
                <Button
                  containerStyle={styles.button}
                  color="rgb(221, 83, 83)"
                  onPress={() => alertaConfirmacion()}
                >
                  Cerrar sesión
                </Button>
              </View>
            </View>
          );
        }}
      >
        <Drawer.Screen
          name="VerIngresos"
          component={VerIngresos}
          options={{
            title: "Viveros",
            drawerIcon: ({ focused }) => (
              <Icon
                name="wpforms"
                size={35}
                color={focused ? "black" : "#999999"}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="NuevoIngreso"
          component={NuevoIngreso}
          options={{
            title: "Nuevo Ingreso",
            drawerIcon: ({ focused }) => (
              <Icon
                name="plus-square-o"
                size={35}
                color={focused ? "black" : "#999999"}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="IngresoDetalle"
          component={IngresoDetalle}
          options={{
            title: "Detalle",
            drawerItemStyle: { display: "none" },
            unmountOnBlur: true,
          }}
        />
        <Drawer.Screen
          name="Actas"
          component={Actas}
          options={{
            title: "Actas",
            drawerItemStyle: { display: "none" },
            unmountOnBlur: true,
          }}
        />
        <Drawer.Screen
          name="Registros"
          component={Registros}
          options={{
            title: "Registros",
            drawerIcon: ({ focused }) => (
              <Icon
                name="history"
                size={35}
                color={focused ? "black" : "#999999"}
              />
            ),
          }}
        />
      </Drawer.Navigator>
    );
  }

  return (
    <UserProvider>
      <NavigationContainer>
        <MyDrawer />
      </NavigationContainer>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 70,
    maxHeight: "87%",
  },
  view: {
    padding: 16,
    borderRadius: 10,
    backgroundColor: "transparent",
    marginHorizontal: 5,
    marginTop: 10,
  },
  titulo: {
    fontSize: heightY * 0.035,
    alignItems: "flex-start",
    textAlign: "center",
    alignContent: "flex-start",
    fontWeight: "800",
  },
  text: {
    alignItems: "flex-end",
    alignContent: "center",
    marginTop: 0,
    marginStart: 10,
    fontSize: heightY * 0.023,
    maxWidth: "57%",
  },
  image: {
    width: "95%",
    height: "20%",
    resizeMode: "cover",
    marginStart: "0%",
    borderRadius: 10,
  },
  button: {
    marginTop: 20,
    borderRadius: 5,
    marginStart: "4%",
    width: "89%",
  },
  drawerStyle: {
    backgroundColor: "#FFEFD6",
  },
  sceneContainer: {
    backgroundColor: "#FFEFD6",
  },
  loader: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
});
