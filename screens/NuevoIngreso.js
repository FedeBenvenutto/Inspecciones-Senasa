import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Dimensions,
  ScrollView,
  Image,
} from "react-native";
import { Button } from "@rneui/themed";
import { db } from "../database/firebase.js";
import { addDoc, collection } from "firebase/firestore";
import Toast from "react-native-toast-message";
import Formulario from "../Components/Formulario.js";
import { UserContext } from "../Context/UserContext";
import { DrawerView } from "../Components/DrawerView.js";
import Icon from "react-native-vector-icons/FontAwesome";
import { SafeAreaView } from "react-native-safe-area-context";
import girasol from "../assets/girasol.jpg";
import Animated, {
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useDrawerProgress } from "@react-navigation/drawer";
import { StatusBar } from "expo-status-bar";

const heightY = Dimensions.get("window").height;

const NuevoIngreso = (props) => {
  const { users, currentUserId, sendPushNotification } =
    useContext(UserContext);
  const currentUser = users.filter((user) => user.Uid === currentUserId);
  const drawerProgress = useDrawerProgress();
  const viewStyles = useAnimatedStyle(() => {
    const borderRadius = interpolate(drawerProgress.value, [0, 1], [0, 40]);
    return {
      borderRadius,
    };
  });
  const inicialState = {
    Renfo: "",
    Nombre: "",
    Localidad: "",
    Titular: "",
    Teltitular: "",
    RespTecnico: "",
    TelRespTecnico: "",
    Mail: "",
    ExpElec: "",
    FechaHabilitacion: "",
    Vencimiento: "",
    Observaciones: "",
    Notificacion: "",
    Color: 0,
  };
  const [ingreso, setIngreso] = useState(inicialState);

  const [loading, setLoading] = useState(false);

  const showToast = () => {
    Toast.show({
      type: "success",
      text1: `${ingreso.Nombre} se agregó correctamente`,
    });
  };

  const saveNewIngreso = async () => {
    if (!ingreso.Nombre) {
      Alert.alert("", "Complete todos los campos");
    } else if (ingreso.Notificacion && ingreso.Notificacion < new Date()) {
      Alert.alert(
        "",
        "La fecha de notificación debe ser posterior a la actual"
      );
    } else
      try {
        setLoading(true);
        await addDoc(collection(db, "Viveros"), {
          Renfo: ingreso.Renfo,
          Nombre: ingreso.Nombre,
          Localidad: ingreso.Localidad,
          Titular: ingreso.Titular,
          Teltitular: ingreso.Teltitular,
          RespTecnico: ingreso.RespTecnico,
          TelRespTecnico: ingreso.TelRespTecnico,
          Mail: ingreso.Mail,
          ExpElec: ingreso.ExpElec,
          FechaHabilitacion: ingreso.FechaHabilitacion,
          Vencimiento: ingreso.Vencimiento,
          Observaciones: ingreso.Observaciones,
          Notificacion: ingreso.Notificacion,
          createdAt: new Date(),
          Color: ingreso.Color,
        });
        await addDoc(collection(db, "Registros"), {
          User: currentUser[0].Nombre,
          Nombre: ingreso.Nombre,
          Accion: "agregó el vivero",
          createdAt: new Date(),
        });
        showToast();
        sendPushNotification(ingreso, "agregó");
        setIngreso(inicialState);
        setLoading(false);
      } catch (e) {
        setLoading(false);
        alert(e);
      }
  };

  return (
    <DrawerView style={styles.container}>
      <StatusBar style="dark" backgroundColor="transparent" />
      <Animated.Image
        source={girasol}
        style={[styles.bgimage, StyleSheet.absoluteFill, viewStyles]}
      />
      <SafeAreaView style={{ height: "97%" }}>
        <Icon
          name="bars"
          size={25}
          color={"gray"}
          style={{ marginStart: 15, marginTop: 10 }}
          onPress={() => props.navigation.toggleDrawer()}
        />
        <Text style={styles.titulo}>INGRESO NUEVO VIVERO</Text>
        <ScrollView>
          <Formulario ingreso={ingreso} setIngreso={setIngreso} />
          <View style={styles.buttton}>
            {loading ? (
              <Button containerStyle={styles.buttton} loading disabled />
            ) : (
              <Button
                containerStyle={styles.buttton}
                title="Agregar"
                onPress={() => saveNewIngreso()}
                color="#8FBC8F"
              />
            )}
          </View>
          <View style={styles.buttton}></View>
        </ScrollView>
      </SafeAreaView>
      <Toast />
    </DrawerView>
  );
};

const styles = StyleSheet.create({
  titulo: {
    marginTop: 10,
    alignItems: "center",
    fontSize: heightY * 0.039,
    justifyContent: "center",
    textAlign: "center",
    color: "#7c917f",
    marginBottom: 20,
    fontWeight: "bold",
  },
  container: {
    backgroundColor: "white",
  },
  buttton: {
    width: "88%",
    alignContent: "center",
    marginTop: 20,
    marginStart: 25,
    borderRadius: 15,
  },

  bgimage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    opacity: 0.2,
  },
});

export default NuevoIngreso;
