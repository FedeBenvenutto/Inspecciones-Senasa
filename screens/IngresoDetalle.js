import {
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  addDoc,
  collection,
} from "firebase/firestore";
import { db } from "../database/firebase.js";
import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Image,
} from "react-native";
import { Button } from "@rneui/themed";
import Formulario from "../Components/Formulario.js";
import { UserContext } from "../Context/UserContext.js";
import { DrawerView } from "../Components/DrawerView.js";
import Icon from "react-native-vector-icons/FontAwesome";
import { SafeAreaView } from "react-native-safe-area-context";
import girasol from "../assets/girasol.jpg";
import Animated, {
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useDrawerProgress } from "@react-navigation/drawer";

const heightY = Dimensions.get("window").height;

const IngresoDetalle = (props) => {
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
  const [loading, setLoading] = useState(true);
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

  const getIngresoById = async (id) => {
    const docRef = doc(db, "Viveros", id);
    await getDoc(docRef).then((doc) => {
      const ingreso = doc.data();
      let vencimiento = ingreso.Vencimiento ? ingreso.Vencimiento.toDate() : "";
      let fechaHabilitacion = ingreso.FechaHabilitacion
        ? ingreso.Vencimiento.toDate()
        : "";
      let notificacion = ingreso.Notificacion
        ? ingreso.Notificacion.toDate()
        : "";
      setIngreso({
        ...ingreso,
        FechaHabilitacion: fechaHabilitacion,
        Vencimiento: vencimiento,
        Notificacion: notificacion,
        id: doc.id,
      });
      setLoading(false);
    });
  };

  const borrarIngreso = async () => {
    try {
      setLoading(true);
      const docRef = doc(db, "Viveros", props.route.params.ingresoId);
      await deleteDoc(docRef);
      await addDoc(collection(db, "Registros"), {
        User: currentUser[0].Nombre,
        Nombre: ingreso.Nombre,
        Accion: "eliminó el vivero",
        createdAt: new Date(),
      });
      setLoading(false);
      Alert.alert("", "Borrado");
      props.navigation.navigate("VerIngresos");
    } catch (e) {
      alert(e);
    }
  };

  const alertaConfirmacion = () => {
    Alert.alert(
      "Eliminando Vivero",
      "¿Esta seguro?",
      [
        { text: "Confirmar", onPress: () => borrarIngreso() },
        { text: "Cancelar", onPress: () => console.log("canceled") },
      ],
      {
        cancelable: true,
      }
    );
  };

  const actualizarIngreso = async () => {
    if (ingreso.Notificacion && ingreso.Notificacion < new Date()) {
      Alert.alert(
        "",
        "La fecha de notificación debe ser posterior a la actual"
      );
    } else
      try {
        setLoading(true);
        const docRef = doc(db, "Viveros", props.route.params.ingresoId);
        const data = {
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
        };
        await setDoc(docRef, data);
        await addDoc(collection(db, "Registros"), {
          User: currentUser[0].Nombre,
          Nombre: ingreso.Nombre,
          Accion: "actualizó el vivero",
          createdAt: new Date(),
        });
        sendPushNotification(ingreso, "actualizó");
        setLoading(false);
        Alert.alert("", "Actualizado");
        props.navigation.navigate("VerIngresos");
      } catch (e) {
        alert(e);
      }
  };

  useEffect(() => {
    getIngresoById(props.route.params.ingresoId);
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#9E9E9E" />
      </View>
    );
  }

  return (
    <DrawerView style={styles.container}>
      <Animated.Image
        source={girasol}
        style={[styles.bgimage, StyleSheet.absoluteFill, viewStyles]}
      />
      <SafeAreaView style={{ height: "97%" }}>
        <Icon
          name="bars"
          size={25}
          color={"gray"}
          style={{ marginStart: 10 }}
          onPress={() => props.navigation.toggleDrawer()}
        />
        <Text style={styles.titulo}>DETALLE CONTACTO</Text>
        <ScrollView>
          <Formulario ingreso={ingreso} setIngreso={setIngreso} />
          <View style={styles.buttton}>
            <Button
              containerStyle={styles.buttton}
              title="Actualizar"
              onPress={() => actualizarIngreso()}
              color="#8FBC8F"
            />
          </View>
          <View style={styles.buttton}>
            <Button
              containerStyle={styles.buttton}
              title="Eliminar"
              buttonStyle={{ backgroundColor: "orangered" }}
              onPress={() => {
                alertaConfirmacion();
              }}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </DrawerView>
  );
};

const styles = StyleSheet.create({
  titulo: {
    marginTop: 10,
    alignItems: "center",
    fontSize: heightY * 0.04,
    justifyContent: "center",
    textAlign: "center",
    color: "blue",
    marginBottom: 20,
    fontWeight: "bold",
    color: "#7c917f",
  },
  container: {
    backgroundColor: "white",
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
  buttton: {
    width: "88%",
    alignContent: "center",
    marginTop: 10,
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

export default IngresoDetalle;
