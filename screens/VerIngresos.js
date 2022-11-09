import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Text,
  Alert,
  Dimensions,
} from "react-native";
import { ListItem, Avatar } from "@rneui/themed";
import { ScrollView } from "react-native-gesture-handler";
import { db } from "../database/firebase.js";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  deleteDoc,
  doc,
} from "firebase/firestore";
import plus from "../assets/plus.png";
import MyModal from "../Components/Modal.js";
import TouchableScale from "react-native-touchable-scale";
import { LinearGradient } from "expo-linear-gradient";
// import fondo from "../assets/fondo3.jpg";
import { UserContext } from "../Context/UserContext";
import { Button } from "@rneui/base";
import { auth } from "../database/firebase.js";
import { signOut } from "firebase/auth";
// import Dialog from "react-native-dialog";

const heightY = Dimensions.get("window").height;
const VerIngresos = (props) => {
  const { user, setUser, loading, setLoading, setUsers, setCurrentUserId } = useContext(UserContext);
  const [ingresos, setIngresos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ingresoinModal, setIngresoinModal] = useState([]);
  const [orden, setOrden] = useState("vencimiento");
  // const [alertVisible, setalertVisible] = useState(false);
  // const [textAlert, settextAlert] = useState(false);
  const handleText = (date) => {
    if(!date) {return "No se ha seleccionado ninguna fecha"}
    const ano= date.getFullYear()
    const mes=date.getMonth()+1
    const day=date.getDate()
    return day+"/"+mes+"/"+ano
  }

  useEffect(() => {
    const collectionRef = collection(db, "Viveros");
    const q = orden === "vencimiento"
      ? query(collectionRef, orderBy("Vencimiento", "asc"))
      : orden === "nombre" ? 
       query(collectionRef, orderBy("Nombre", "asc")) 
      : query(collectionRef, orderBy("Localidad", "asc")) ;
    const unsuscribe = onSnapshot(q, (querySnapshot) => {
      setIngresos(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          Renfo: doc.data().Renfo,
          Nombre: doc.data().Nombre,
          Localidad: doc.data().Localidad,
          Titular: doc.data().Titular,
          Teltitular: doc.data().Teltitular,
          RespTecnico: doc.data().RespTecnico,
          TelRespTecnico: doc.data().TelRespTecnico,
          Mail: doc.data().Mail,
          ExpElec: doc.data().ExpElec,
          FechaHabilitacion: doc.data().FechaHabilitacion,
          Vencimiento: doc.data().Vencimiento,
          Observaciones: doc.data().Observaciones,
          Actas: doc.data().Actas,
          Notificacion: doc.data().Notificacion,
          createdAt: doc.data().createdAt,
        }))
      );
      setLoading(false);
    });
    return unsuscribe;
  }, [orden]);
  // const handleDelete = async () => {
  //   if (textAlert == "confirmar") {
  //     try {
  //       settextAlert("");
  //       ingreso.map(async (persona) => {
  //         const docRef = doc(db, user, persona.id);
  //         await deleteDoc(docRef);
  //         console.log("Confirmado");
  //       });
  //       setLoading(false);
  //       setalertVisible(false);
  //     } catch (error) {
  //       Alert.alert(error);
  //       setLoading(false);
  //       setalertVisible(false);
  //     }
  //   }
  // };

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
              console.log(error);
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
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#9E9E9E" />
      </View>
    );
  }

  return (
    <>
      {/* <Image source={fondo} style={[styles.image, StyleSheet.absoluteFill]} /> */}
      {/* <View style={styles.alertContainer}>
      <Dialog.Container
        visible={alertVisible}
        contentStyle={{ borderRadius: 20 }}
      >
        <Dialog.Title
        style={{fontSize: heightY * 0.030, color: 'black'}}
        >Reinicio de datos</Dialog.Title>
        <Dialog.Description
        style={{fontSize: heightY * 0.022, color: 'black'}}
        >
          Se borrarán todos los datos. Esta acción no se puede deshacer. Si está
          seguro escriba: confirmar
        </Dialog.Description>
        <Dialog.Input
          autoCapitalize="none"
          style={{ fontSize: heightY * 0.026, color: 'black' }}
          onChangeText={(value) => settextAlert(value.trim())}
        ></Dialog.Input>
        <Dialog.Button
          label="Cancelar"
          onPress={() => setalertVisible(false)}
        />
        <Dialog.Button label="Borrar" onPress={handleDelete} />
      </Dialog.Container> */}
      {/* </View> */}
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.text}
          onPress={() => orden === "vencimiento" ? setOrden("nombre") :
        orden === "nombre" ? setOrden("localidad")
         : setOrden("vencimiento")}
        >
          <Text>Ordenado por: {orden}</Text>
          {/* <Text>
            {orden === "vencimiento" ? "Ordenar por nombre" 
            : orden === "nombre" ? "Ordenar por localidad" 
            : "Ordenar por vencimiento"}
          </Text> */}
        </TouchableOpacity>
        <ScrollView>
          {ingresos?.map((ingreso) => {
            return (
              <LinearGradient
                key={ingreso.id}
                colors={
                  // !ingreso.Trabajando
                  //   ? 
                    ["green", "lightgreen"]
                    // : ["rgb(221, 83, 83)", "rgb(237, 219, 192)"]
                }
                style={styles.listacontainer}
              >
                <ListItem
                  key={ingreso.id}
                  containerStyle={styles.lista}
                  onPress={() => {
                    setIngresoinModal(ingreso);
                    setIsModalOpen(!isModalOpen);
                  }}
                  Component={TouchableScale}
                  friction={90}
                  tension={100}
                  activeScale={0.95}
                >
                  {/* <Avatar size={45} rounded title={ingreso.Prioridad} /> */}

                  <ListItem.Content>
                    <ListItem.Title style={styles.title}>
                      {ingreso.Nombre.toUpperCase()}
                    </ListItem.Title>
                    <ListItem.Subtitle 
                    // style={styles.title}
                    >
                      Localidad: {ingreso.Localidad}
                    </ListItem.Subtitle>
                    {ingreso.Vencimiento && (
                      <ListItem.Subtitle>
                         Fecha de vencimiento: {handleText(ingreso.Vencimiento.toDate())}
                      </ListItem.Subtitle>
                    )}


                    {/* <ListItem.Subtitle
                    //  style={styles.title}
                     >
                      Fecha de vencimiento: {handleText(ingreso.Vencimiento.toDate())}
                    </ListItem.Subtitle> */}
                    {ingreso.Observaciones && (
                      <ListItem.Subtitle>
                        Observaciones: {ingreso.Observaciones}
                      </ListItem.Subtitle>
                    )}
                  </ListItem.Content>
                </ListItem>
              </LinearGradient>
            );
          })}
        </ScrollView>
      </View>
      <TouchableOpacity
        onPress={() =>
          props.navigation.navigate("NuevoIngreso")
        }
        style={styles.iconcontainer}
      >
        <View style={styles.iconview}>
          <Image source={plus} style={styles.icon}></Image>
        </View>
      </TouchableOpacity>
      <Button
        containerStyle={styles.button}
        color="rgb(221, 83, 83)"
        onPress={() => alertaConfirmacion()}
      >
        Cerrar sesión
      </Button>
      {/* <Button
        containerStyle={styles.button2}
        color="rgb(221, 83, 83)"
        onPress={() => setalertVisible(true)}
      >
        {" "}
        Reiniciar{" "}
      </Button> */}
      <MyModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        ingresoinModal={ingresoinModal}
        props={props}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    maxHeight: "87%",
    backgroundColor: "transparent",
  },
  alertContainer: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  lista: {
    marginTop: 0,
    alignContent: "center",
    marginStart: 10,
    marginEnd: 10,
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
  iconcontainer: {
    left: "83%",
    right: 10,
    bottom: 0,
    position: "absolute",
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  iconview: {
    width: 55,
    height: 55,
    backgroundColor: "gray",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    bottom: 14,
  },
  icon: {
    width: 22,
    height: 22,
    tintColor: "white",
  },
  text: {
    alignItems: "flex-end",
    width: "96%",
  },
  title: {
    fontSize: heightY * 0.029,
    fontWeight: "700",
    marginBottom: 10,
    alignSelf: 'center'
  },
  listacontainer: {
    borderRadius: 35,
    marginTop: 5,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  button: {
    left: 10,
    right: 0,
    top: "91%",
    bottom: 0,
    position: "absolute",
    borderRadius: 50,
    width: "33%",
    height: 46,
    backgroundColor: "rgb(221, 83, 83)",
    alignContent: "center",
    alignSelf: "center",
    textAlignVertical: "center",
    alignItems: "center",
  },
  button2: {
    left: "43.5%",
    right: 0,
    top: "91%",
    bottom: 0,
    position: "absolute",
    borderRadius: 50,
    width: "33%",
    height: 46,
    backgroundColor: "rgb(221, 83, 83)",
  },
});

export default VerIngresos;
