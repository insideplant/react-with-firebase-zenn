import React, { useContext, useState, useEffect } from "react";
import { auth } from "../firebase";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  function signup(email, password) {
    return auth.createUserWithEmailAndPassword(email, password);
  }

  function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password)
  }

  function logout() {
    return auth.signOut();
  }

  function resetPassword(email) {
    // .env use case      url: process.env.REACT_APP_MAIL_URL + '?email=' + email,
    // local dev case     url: "http://localhost:3000/?email=" + email,
    // product case     url: "https://you-domain/?email=' + email,
    const actionCodeSettings = {
      url: `${process.env.REACT_APP_MAIL_URL + 'dashboard'}/?email=` + firebase.auth().currentUser.email,
    };
    return auth.sendPasswordResetEmail(email, actionCodeSettings);
  }

  function sendEmailVerification() {
    // .env use case      url: process.env.REACT_APP_MAIL_URL + 'dashboard'
    // local dev case     url: "http://localhost:3000/dashboard"
    // product case     url: "https://you-domain/dashboard'
    const actionCodeSettings = {
      url: "http://localhost:3000/" + 'dashboard'
    };
    return currentUser.sendEmailVerification(actionCodeSettings);
  }


  const value = {
    currentUser,
    signup,
    login,
    logout,
    resetPassword,
    sendEmailVerification
  };

  useEffect(() => {
    // Firebase Authのメソッド。ログイン状態が変化すると呼び出される
    auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
  }, []);

  return (
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
  )
} 