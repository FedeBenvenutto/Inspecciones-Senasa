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
// import fondo from "../assets/fondo3.jpg";
import { UserContext } from "../Context/UserContext";
import { NotificationContext } from "../Context/Notifications.js";
import { DatePicker } from "react-native-woodpicker";


const heightY = Dimensions.get("window").height;

const NuevoIngreso = (props) => {
  const { user, setUser } = useContext(UserContext);
  const { sendPushNotification } = useContext(NotificationContext);
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
    // Actas: "",
    Notificacion: ""
  }
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
    } else if (ingreso.Notificacion < new Date()) {
      Alert.alert("", "La fecha de notificación debe ser posterior a la actual");
    } else 
      try {
        setLoading(true);
        const docRef = await addDoc(collection(db, "Viveros"), {
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
          // Actas: ingreso.Actas,
          Notificacion: ingreso.Notificacion,
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
    <>
      {/* <Image source={fondo} style={[styles.image, StyleSheet.absoluteFill]} /> */}
      <ScrollView style={styles.container}>
        <Text style={styles.titulo}>INGRESO NUEVO VIVERO</Text>
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
      <Toast />
    </>
  );
};

const styles = StyleSheet.create({
  titulo: {
    marginTop: 20,
    alignItems: "center",
    fontSize: heightY * 0.039,
    justifyContent: "center",
    textAlign: "center",
    color: "#7c917f",
    marginBottom: 30,
    fontWeight: "bold",
  },
  container: {},
  buttton: {
    width: "88%",
    alignContent: "center",
    marginTop: 20,
    marginStart: 25,
    borderRadius: 15,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    opacity: 0.3,
  },
});

export default NuevoIngreso;
