import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  Dimensions,
  Image,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { db } from "../database/firebase.js";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
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
const Registros = (props) => {
  const { loading, setLoading } = useContext(UserContext);
  const [registros, setRegistros] = useState([]);
  const Meses = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];
  const DiasSemana = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];
  const drawerProgress = useDrawerProgress();
  const viewStyles = useAnimatedStyle(() => {
    const borderRadius = interpolate(drawerProgress.value, [0, 1], [0, 40]);
    return {
      borderRadius,
    };
  });

  useEffect(() => {
    setLoading(true);
    const collectionRef = collection(db, "Registros");
    const q = query(collectionRef, orderBy("createdAt", "asc"));
    const unsuscribe = onSnapshot(q, (querySnapshot) => {
      setRegistros(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          Nombre: doc.data().Nombre,
          createdAt: doc.data().createdAt,
          User: doc.data().User,
          Accion: doc.data().Accion,
        }))
      );
      setLoading(false);
    });
    return unsuscribe;
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <StatusBar style="dark" backgroundColor="transparent" />
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
      <SafeAreaView>
        <Icon
          name="bars"
          size={25}
          color={"gray"}
          style={{ marginStart: 15, marginTop: 10 }}
          onPress={() => props.navigation.toggleDrawer()}
        />
        <Text style={styles.titulo}>REGISTRO DE ACTIVIDAD</Text>
        <ScrollView>
          {registros?.map((registro) => {
            var dia = registro.createdAt.toDate().getDate();
            var mes = Meses[registro.createdAt.toDate().getMonth()].slice(0, 3);
            var diasemana = DiasSemana[
              registro.createdAt.toDate().getDay()
            ].slice(0, 3);
            var hora = registro.createdAt.toDate().getHours();
            var minuto = String(registro.createdAt.toDate().getMinutes());
            if (minuto.length === 1) {
              minuto = "0" + minuto;
            }
            return (
              <View key={registro.id} style={{ flexDirection: "row" }}>
                <Text
                  style={{ fontWeight: "800", width: "35%", marginStart: 5 }}
                >
                  {" "}
                  {diasemana} {dia} {mes} {hora}:{minuto}:{" "}
                </Text>
                <Text style={{ flexWrap: "wrap", width: "65%" }}>
                  {registro.User} {registro.Accion} {registro.Nombre}{" "}
                </Text>
              </View>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </DrawerView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

  titulo: {
    marginTop: 10,
    alignItems: "center",
    fontSize: heightY * 0.038,
    justifyContent: "center",
    textAlign: "center",
    color: "#7c917f",
    marginBottom: 30,
    fontWeight: "bold",
  },
  bgimage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    opacity: 0.3,
  },
});

export default Registros;
