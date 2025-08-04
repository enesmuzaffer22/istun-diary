import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "../firebase/config";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // İSTÜN e-posta kontrolü
  const isValidIstunEmail = (email) => {
    return email.endsWith("@istun.edu.tr");
  };

  const signup = async (email, password, firstName, lastName) => {
    // İSTÜN e-posta kontrolü
    if (!isValidIstunEmail(email)) {
      throw new Error(
        "Yalnızca @istun.edu.tr uzantılı e-posta adresleri kabul edilmektedir."
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

    // E-posta doğrulama gönder
    await sendEmailVerification(userCredential.user);

    return userCredential;
  };

  const login = async (email, password) => {
    // İSTÜN e-posta kontrolü
    if (!isValidIstunEmail(email)) {
      throw new Error(
        "Yalnızca @istun.edu.tr uzantılı e-posta adresleri ile giriş yapabilirsiniz."
      );
    }

    const result = await signInWithEmailAndPassword(auth, email, password);

    // Manuel olarak currentUser'ı güncelle
    setCurrentUser(result.user);

    return result;
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
