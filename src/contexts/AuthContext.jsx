import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase/config";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // İstun email domaini kontrolü
  const isValidIstunEmail = (email) => {
    return email.endsWith("@istun.edu.tr");
  };

  const signup = async (email, password, firstName, lastName) => {
    if (!isValidIstunEmail(email)) {
      throw new Error(
        "Sadece @istun.edu.tr uzantılı e-posta adresleri kabul edilir."
      );
    }

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Kullanıcı profilini güncelle
    if (firstName && lastName) {
      await updateProfile(userCredential.user, {
        displayName: `${firstName} ${lastName}`,
      });
    }

    await sendEmailVerification(userCredential.user);
    return userCredential;
  };

  const login = (email, password) => {
    if (!isValidIstunEmail(email)) {
      throw new Error(
        "Sadece @istun.edu.tr uzantılı e-posta adresleri kabul edilir."
      );
    }
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout,
    isValidIstunEmail,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
