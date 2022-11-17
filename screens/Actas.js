import React, { useState, useRef, useEffect, useContext } from "react";
import {
  Image,
  View,
  StyleSheet,
  Alert,
  Modal,
  ActivityIndicator,
  TouchableOpacity, Text
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Camera, CameraType } from "expo-camera";
import Constants from "expo-constants";
import CamaraButtons from "../Components/CamaraButtons";
import * as MediaLibrary from "expo-media-library";
import { Button } from "@rneui/base";
import { storage } from "../database/firebase";
import uuid from "react-native-uuid";
import {
  ref,
  uploadBytes,
  listAll,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import ImageViewer from "react-native-image-zoom-viewer";
import { NotificationContext } from "../Context/Notifications.js";

const Actas = (props) => {
  const [images, setImages] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [imageSelected, setImageSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [camaraImage, setCamaraImage] = useState(null);
  const [camaraOpen, setCamaraOpen] = useState(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const cameraRef = useRef(null);
  const { sendPushNotification } = useContext(NotificationContext);

  const takeImages = async () => {
    setImages([]);
    const listRef = ref(storage, `${props.route.params.ingresoId}/`);
    const list = await listAll(listRef);
    const imageUrl = await Promise.all(
      list.items.map(async (itemRef) => {
        return await getDownloadURL(itemRef);
      })
    );
    imageUrl.forEach((item, i) =>
      setImages((prev) => [
        ...prev,
        { url: item, path: list.items[i]._location.path_ },
      ])
    );
    setLoading(false);
  };

  useEffect(() => {
    takeImages().catch((error) => {
      setLoading(false);
      Alert.alert("", error);
    });
  }, []);

  useEffect(() => {
    (async () => {
      MediaLibrary.requestPermissionsAsync();
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === "granted");
    })();
  }, []);

  const uploadImage = async (image) => {
    setLoading(true);
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", image, true);
      xhr.send(null);
    });
    //   blob.close();
    const storageRef = ref(
      storage,
      `${props.route.params.ingresoId}/${uuid.v4()}`
    );
    uploadBytes(storageRef, blob)
      .then(() => {
        sendPushNotification(props.route.params.ingreso, "agregó un acta en");
        takeImages().catch((error) => {
          setLoading(false);
          Alert.alert("", error);
        });
        Alert.alert("", "Acta cargada correctamente");
      })
      .catch((error) => {
        setLoading(false);
        Alert.alert("", error);
      });
  };

  const alertaConfirmacion = () => {
    if (images[0] === undefined) {
      return null;
    }
    Alert.alert(
      "Borrando imagen",
      "¿Esta seguro?",
      [
        {
          text: "Confirmar",
          onPress: () => {
            deleteImage();
          },
        },
        { text: "Cancelar", onPress: () => console.log("canceled") },
      ],
      {
        cancelable: true,
      }
    );
  };

  const deleteImage = () => {
    setLoading(true);
    const path = images[imageSelected - 1].path;
    const desertRef = ref(storage, path);
    deleteObject(desertRef)
      .then(() => {
        Alert.alert("", "Acta eliminada");
        takeImages();
      })
      .catch((error) => {
        Alert.alert(error);
        setLoading(false);
      });
  };

  const takePicture = async () => {
    if (cameraRef) {
      try {
        const data = await cameraRef.current.takePictureAsync();
        setCamaraImage(data.uri);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      // aspect: [6, 9],
      quality: 1,
    });
    if (!result.cancelled) {
      uploadImage(result.uri);
    }
  };

  const savePicture = async () => {
    if (camaraImage) {
      try {
        uploadImage(camaraImage);
        setCamaraOpen(false);
      } catch (error) {
        setCamaraOpen(false);
        Alert.alert(error);
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#9E9E9E" />
        <Button
          buttonStyle={{ backgroundColor: "gray"}}
          title="Volver"
          onPress={() => {
            setLoading(false);
            props.navigation.navigate("VerIngresos");
          }}
          // containerStyle={{position: 'absolute', top: '60%'}}
        />
      </View>
    );
  }

  if (camaraOpen) {
    if (hasCameraPermission === false) {
      Alert.alert("", "Se deben conceder permisos para usar la Cámara");
      setCamaraOpen(false)
    }
    return (
      <View style={styles.camaraContainer}>
        {!camaraImage ? (
          <Camera
            style={styles.camera}
            type={type}
            ref={cameraRef}
            flashMode={flash}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingHorizontal: 30,
              }}
            >
              <CamaraButtons
                title=""
                icon="retweet"
                onPress={() => {
                  setType(
                    type === CameraType.back
                      ? CameraType.front
                      : CameraType.back
                  );
                }}
              />
              <CamaraButtons
                onPress={() =>
                  setFlash(
                    flash === Camera.Constants.FlashMode.off
                      ? Camera.Constants.FlashMode.on
                      : Camera.Constants.FlashMode.off
                  )
                }
                icon="flash"
                color={
                  flash === Camera.Constants.FlashMode.off ? "gray" : "#fff"
                }
              />
              <CamaraButtons
                title="Volver"
                icon="back"
                onPress={() => setCamaraOpen(false)}
              />
            </View>
          </Camera>
        ) : (
          <Image source={{ uri: camaraImage }} style={styles.camera} />
        )}
        <View style={styles.controls}>
          {camaraImage ? (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingHorizontal: 50,
              }}
            >
              <CamaraButtons
                title="Volver a sacar"
                onPress={() => setCamaraImage(null)}
                icon="retweet"
              />
              <CamaraButtons
                title="Guardar"
                onPress={savePicture}
                icon="check"
              />
            </View>
          ) : (
            <>
              <CamaraButtons
                title="Sacar foto"
                onPress={takePicture}
                icon="camera"
              />
            </>
          )}
        </View>
      </View>
    );
  }
  return (
    <>
      <ImageViewer
        imageUrls={images}
        saveToLocalByLongPress={false}
        renderIndicator={(e, i) => {
          setImageSelected(e);
        }}
        onSwipeDown={(e) => console.log(e)}
        onClick={() => {
          setModalVisible(!modalVisible);
        }}
        enablePreload={true}
      />

      <Modal 
      visible={modalVisible} 
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
      >
        <ImageViewer
          imageUrls={images}
          saveToLocalByLongPress={false}
          // enableSwipeDown={true}
          renderIndicator={(e, i) => {
            setImageSelected(e);
          }}
          onSwipeDown={(e) => console.log(e)}
          onClick={() => {
            setModalVisible(!modalVisible);
          }}
          enablePreload={true}
        />
      </Modal>
      <View style={styles.container}>
        <Button
          containerStyle={styles.button}
          title="Agregar acta desde la galería"
          onPress={() => pickImage()}
        />
        <Button
          containerStyle={styles.button}
          title="Agregar acta desde la cámara"
          onPress={() => setCamaraOpen(true)}
        />
        <Button
          containerStyle={styles.button}
          title="Borrar acta"
          color="rgb(221, 83, 83)"
          onPress={() => alertaConfirmacion()}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    justifyContent: "center",
  },

  camaraContainer: {
    flex: 1,
    justifyContent: "center",
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "#000",
    padding: 8,
  },
  controls: {
    flex: 0.5,
  },
  button: {
    borderRadius: 50,
    height: "13%",
    width: "80%",
    // flexDirection: "row",
    // alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginLeft: 50,
  },
  text: {
    fontSize: 20,
    color: "blue",
    marginLeft: 10,
    marginTop: 15,
  },
  camera: {
    flex: 5,
    borderRadius: 20,
  },
  topControls: {
    flex: 1,
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

export default Actas;
