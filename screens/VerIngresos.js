import React, { useState, useEffect, useContext, useLayoutEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Text,
  Alert,
  Dimensions,
  Linking
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
import * as Notifications from "expo-notifications";
import * as Application from 'expo-application';
import { Searchbar } from 'react-native-paper';


const heightY = Dimensions.get("window").height;
const VerIngresos = (props) => {
  // const navigation = useNavigation();
  const { loading, setLoading, setUsers, setCurrentUserId } = useContext(UserContext);
  const [ingresos, setIngresos] = useState([]);
  const [ingresosFiltered, setIngresosFiltered] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ingresoinModal, setIngresoinModal] = useState([]);
  const [orden, setOrden] = useState("vencimiento");
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {  
            if (searchQuery) {
            setIngresosFiltered(ingresosFiltered.filter((ingreso) => {
            return ingreso.Nombre.toUpperCase().indexOf(searchQuery.toUpperCase()) > -1
            || ingreso.Renfo.toUpperCase().indexOf(searchQuery.toUpperCase()) > -1
            || ingreso.ExpElec.toUpperCase().indexOf(searchQuery.toUpperCase()) > -1
            }))}
            else {
              setIngresosFiltered(ingresos)
            }
            }, [searchQuery])
  

  const handleDate = (date) => {
    if(!date) {return "No se ha seleccionado ninguna fecha"}
    const ano= date.getFullYear()
    const mes=date.getMonth()+1
    const day=date.getDate()
    return day+"/"+mes+"/"+ano
  }

  const handleColor = ({ingreso}) => {
    if (ingreso.Color) {    
      switch (ingreso.Color) {
        case 1: return  ["rgb(221, 83, 83)", "rgb(237, 219, 192)"]
        case 2: return  ["green", "lightgreen"]
        case 3: return  ["#FF884B", "#FFAD6098"]
        case 4: return  ["#FFB200", "#FFF4CF"]          
        default:break
      }}
    if (ingreso.Vencimiento) { 
      if (ingreso.Vencimiento.toDate() < new Date()) return ["rgb(221, 83, 83)", "rgb(237, 219, 192)"]
      if (((ingreso.Vencimiento.toDate() - new Date()) / 1000 /60 /60 /24) < 90) return ["#FF884B", "#FFAD6098"]
      if (((ingreso.Vencimiento.toDate() - new Date()) / 1000 /60 /60 /24) < 240) return ["#FFB200", "#FFF4CF"]}
    return ["green", "lightgreen"]
  }

  useEffect(() => {
    const collectionRef = collection(db, "Aplicacion");
    const q = query(collectionRef)
    const unsub = onSnapshot(doc(db, "Aplicacion", "Version"), (doc) => {
      if (doc.data().actual !== Application.nativeApplicationVersion ){
        Alert.alert(
          "Hay una versión de la aplicación disponible",
          "¿Desea descargarla?",
          [
            { text: "Confirmar", onPress: () => Linking.openURL(doc.data().updateLink)},
            { text: "Cancelar", onPress: () => console.log("canceled") },
          ],
          {
            cancelable: true,
          }
        );
      }
  });  
  }, [])
  

  useEffect(() => {
    const collectionRef = collection(db, "Viveros");  
    const q = orden === "vencimiento"
      ? query(collectionRef, orderBy("Vencimiento", "asc"))
      : orden === "nombre" ? 
       query(collectionRef, orderBy("Nombre", "asc")) 
      : query(collectionRef, orderBy("Localidad", "asc")) ;
    const unsuscribe = onSnapshot(q, (querySnapshot) => {
      const Data =  querySnapshot.docs.map((doc) => ({
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
        Notificacion: doc.data().Notificacion,
        createdAt: doc.data().createdAt,
        Color: doc.data().Color
      }))
      if (orden === "vencimiento") {        
        const DataRed = Data.filter((el) => el.Color === 1)
        const DataNoRed = Data.filter((el) => el.Color !== 1)
        DataNoRed.map((data)=> DataRed.push(data))
        setIngresos(DataRed)
        setIngresosFiltered(DataRed)
        setLoading(false)
      } else {
      setIngresos(Data)
      setIngresosFiltered(Data)  
      setLoading(false)}
    });
    return unsuscribe;
  }, [orden]);

  useEffect(() => {
    if (ingresos[0]) {
      Notifications.cancelAllScheduledNotificationsAsync()
      ingresos.map((ingreso) => {
        if (ingreso.Vencimiento && ingreso.Notificacion) {
        let triggerSec = ingreso.Notificacion && Math.ceil((ingreso.Notificacion.toDate() - new Date()) /1000);
        Notifications.scheduleNotificationAsync({
          content: {
            title: `Este es un recordatorio del vivero ${ingreso.Nombre}`,
            body: `La habilitación vence el día ${handleDate(ingreso.Vencimiento.toDate())}`,
          },
          trigger: { seconds: triggerSec},
        })}}
      )
    }
  }, [ingresos])
  
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

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#9E9E9E" />
      </View>
    );
  }
  
  return (
    <>
      <View style={styles.container}>
      <View style={{flexDirection: 'row'}}>
      <Searchbar
      placeholder="Buscar"
      onChangeText={(query) => setSearchQuery(query)}
      value={searchQuery}
      style={styles.searchBar}
    />
        <TouchableOpacity
          style={styles.text}
          onPress={() => orden === "vencimiento" ? setOrden("nombre") :
        orden === "nombre" ? setOrden("localidad")
         : setOrden("vencimiento")}
        >
          <Text>Ordenado por: {orden}</Text>
        </TouchableOpacity>
        </View>
        <ScrollView>
          {ingresosFiltered?.map((ingreso) => {
            return (
              <LinearGradient
                key={ingreso.id}
                colors={handleColor({ingreso})
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
                         Fecha de vencimiento: {handleDate(ingreso.Vencimiento.toDate())}
                      </ListItem.Subtitle>
                    )}
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
      <Button
        containerStyle={styles.button2}
        color="#D49B54"
        onPress={() => props.navigation.navigate("Registros")}
      >
        Ver Registros
      </Button>
      {/* <Button
        containerStyle={styles.button2}
        color="#D49B54"
        onPress={() => setIsModalInspOpen(!isModalInspOpen)}
      >
        Cambiar inspección
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
    width: "50%",
    alignContent: "center",
    marginTop: 0,
    // backgroundColor: 'blue',
    height: '75%',
    marginTop: '2%'
    // justifyContent: "center"

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
    left: "37.3%",
    right: 0,
    top: "91%",
    bottom: 0,
    position: "absolute",
    borderRadius: 50,
    width: "45%",
    height: 46,
  },
  modal: {
    marginTop: '150%',
    backgroundColor: "gray",
    alignItems: "center",
    margin: 20,
    borderRadius: 16,
    paddingHorizontal: 30,
    paddingVertical: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    // backgroundColor: "blue",
    // height: '80%',
    justifyContent: "flex-end"
  },
  searchBar: {
    width: '50%', 
    height: '70%',
     backgroundColor: '#EBE6E6', 
     borderColor: 'white'
  },
  modalContainer: {
    // flex: 1,
    // justifyContent: "flex-end",
    // alignContent: "flex-end",
    // backgroundColor: "blue",
    // height: '100%'
  },
  

});

export default VerIngresos;
