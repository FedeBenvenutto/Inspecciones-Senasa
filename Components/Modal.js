import * as React from "react";
import {
  Text,
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Image,
  Dimensions,
} from "react-native";
import llamada from "../assets/llamada.png";

const heightY = Dimensions.get("window").height;
export default function MyModal({
  isModalOpen,
  setIsModalOpen,
  ingresoinModal,
  props,
}) {
  const handleText = (date) => {
    if(!date) {return "No se ha seleccionado ninguna fecha"}
    const ano= date.getFullYear()
    const mes=date.getMonth()+1
    const day=date.getDate()
    return day+"/"+mes+"/"+ano
  }
  return (
    <Modal visible={isModalOpen} transparent={true} animationType={"slide"}>
      <View style={styles.modalContainer}>
        <View style={styles.modal}>
          <Text style={styles.text2}>
            {ingresoinModal.Nombre.toUpperCase()}
          </Text>
          <Text style={styles.text}>
            Renfo: {ingresoinModal.Renfo}
          </Text>
          <Text style={styles.text}>
            Titular: {ingresoinModal.Titular}
          </Text>
          <TouchableOpacity
            style={{ flexDirection: "row" }}
            onPress={() => Linking.openURL(`tel:${ingresoinModal.Teltitular}`)}
          >
            <Image source={llamada} style={styles.image} />
            <Text style={styles.text}>Tel titular: {ingresoinModal.Teltitular}</Text>
          </TouchableOpacity>
          <Text style={styles.text}>
            Resp. Técnico: {ingresoinModal.RespTecnico}
          </Text>
          <TouchableOpacity
            style={{ flexDirection: "row" }}
            onPress={() => Linking.openURL(`tel:${ingresoinModal.TelRespTecnico}`)}
          >
            <Image source={llamada} style={styles.image} />
            <Text style={styles.text}>
              Tel Resp. Tec. : {ingresoinModal.TelRespTecnico}
            </Text>
          </TouchableOpacity>
          <Text style={styles.text}>
            Mail: {ingresoinModal.Mail}
          </Text>
          <Text style={styles.text}>
            Exp. Electrónico: {ingresoinModal.ExpElec}
          </Text>
          <Text style={styles.text}>
            Fecha habilitación: {ingresoinModal.FechaHabilitacion 
            && handleText(ingresoinModal.FechaHabilitacion.toDate())}
          </Text>
          <Text style={styles.text}>
            Fecha Notificación: {ingresoinModal.Notificacion 
            && handleText(ingresoinModal.Notificacion.toDate())}
          </Text>
          <Text style={styles.text}>
            Ver Actas
          </Text>
          <TouchableOpacity
            onPress={() => {
              setIsModalOpen(!setIsModalOpen);
              props.navigation.navigate("IngresoDetalle", {
                ingresoId: ingresoinModal.id,
              });
            }}
          >
            <Text style={styles.text3}>Actualizar/Eliminar </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsModalOpen(!setIsModalOpen)}>
            <Text style={styles.text3}>Volver</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modal: {
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
  },

  text: {
    fontSize: heightY * 0.021,
    marginTop: 10,
    color: "white",
  },
  text3: {
    fontSize: heightY * 0.023,
    marginTop: 10,
    color: "white",
  },
  text2: {
    fontSize: heightY * 0.035,
    marginTop: 10,
    fontWeight: "500",
    marginBottom: 10,
    color: "white",
    textAlign: "center",
  },
  text3: {
    fontSize: heightY * 0.026,
    marginTop: 20,
    fontWeight: "500",
    marginBottom: 10,
    color: "white",
    width: "100%",
  },
  image: {
    width: 30,
    height: 30,
    marginTop: 10,
  },
});
