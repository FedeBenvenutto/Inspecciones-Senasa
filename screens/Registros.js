import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  Dimensions,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { db } from "../database/firebase.js";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { UserContext } from "../Context/UserContext";

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
  
  useEffect(() => {
    setLoading(true)
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
        <ActivityIndicator size="large" color="#9E9E9E" />
      </View>
    );
  }

  return (

      <View style={styles.container}>
        <ScrollView>
          <Text style={styles.titulo}>REGISTRO DE ACTIVIDAD</Text>
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
                <Text style={{ fontWeight: "800" }}>
                  {" "}
                  {diasemana} {dia} {mes} {hora}:{minuto}:{" "}
                </Text>
                <Text style={{ flexWrap: "wrap", width: "70%" }}>
                  {registro.User} {registro.Accion} {registro.Nombre}{" "}
                </Text>
              </View>
            );
          })}
        </ScrollView>
      </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    maxHeight: "87%",
    backgroundColor: "transparent",
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
    marginTop: 20,
    alignItems: "center",
    fontSize: heightY * 0.039,
    justifyContent: "center",
    textAlign: "center",
    color: "#7c917f",
    marginBottom: 30,
    fontWeight: "bold",
  },
});

export default Registros;
