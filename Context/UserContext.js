import React, { useState, useEffect, createContext } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../database/firebase";

export const UserContext = createContext();
export const UserProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [users, setUsers] = useState(null);
  // console.log("User: " + users)
  const takeUsers = () => {
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
      }

  return (
    <UserContext.Provider
      value={{
        currentUserId,
        setCurrentUserId,
        setLoading,
        loading,
        users,
        setUsers,
        takeUsers
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
