import React, { useState, useEffect, createContext } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../database/firebase";
import { Alert } from "react-native";

export const UserContext = createContext();
export const UserProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [users, setUsers] = useState(null);
  const currentUser = users?.filter((user) => user.Uid === currentUserId);
  const nocurrentUser = users?.filter((user) => user.Uid !== currentUserId);

  async function sendPushNotification(ingreso, accion) {
    
    nocurrentUser.map(async (user) => {
      const message = {
        to: user.Token,
        sound: "default",
        title: `${currentUser[0].Nombre} ${accion}  un vivero`,
        body: `${ingreso.Nombre} de ${ingreso.Localidad}`,
        data: { someData: "goes here" },
      };
      await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Accept-encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
        
      });
    });
  }

  const takeUsers = () => {
    try {
      const collectionRef = collection(db, "Users");
      const q = query(collectionRef);
      onSnapshot(q, (querySnapshot) => {
          setUsers(
            querySnapshot.docs.map((doc) => ({
              Mail: doc.data().Mail,
              Token: doc.data().Token,
              Uid: doc.data().Uid,
              Nombre: doc.data().Nombre,
            }))
          );
        });  
    } catch (error) {
      Alert.alert("Se produjo un error obteniendo los usuarios de la aplicación:" + error)
    }}

  return (
    <UserContext.Provider
      value={{
        currentUserId,
        setCurrentUserId,
        setLoading,
        loading,
        users,
        setUsers,
        takeUsers,
        sendPushNotification,
        currentUser
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
