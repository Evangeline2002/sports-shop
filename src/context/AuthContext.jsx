import React, { createContext, useState, useContext, useEffect } from "react";
import { auth, isFirebaseConfigured } from "../firebase/config";
import { 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged 
} from "firebase/auth";

const AuthContext = createContext();

const MOCK_ADMIN_EMAIL = "admin@sportshop.tn";
const MOCK_ADMIN_PASSWORD = "adminpassword123";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState("mock"); // mock or firebase

  useEffect(() => {
    let unsubscribe = () => {};

    if (isFirebaseConfigured && auth) {
      setAuthMode("firebase");
      try {
        unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
          if (firebaseUser) {
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || "Admin User",
              isMock: false
            });
          } else {
            setUser(null);
          }
          setLoading(false);
        });
      } catch (err) {
        console.warn("Firebase Auth listener failed, falling back to mock auth.", err);
        initializeMockAuth();
      }
    } else {
      setAuthMode("mock");
      initializeMockAuth();
    }

    return () => unsubscribe();
  }, []);

  const initializeMockAuth = () => {
    const saved = localStorage.getItem("mock_admin_session");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {
        localStorage.removeItem("mock_admin_session");
      }
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    if (authMode === "firebase" && auth) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const fbUser = userCredential.user;
        const mappedUser = {
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: fbUser.displayName || "Admin User",
          isMock: false
        };
        setUser(mappedUser);
        return { success: true };
      } catch (err) {
        console.error("Firebase Login Error", err);
        // If login failed on firebase, let's also try mock login in case the user wants to test with local credentials
        return tryMockLogin(email, password, err.message);
      }
    } else {
      return tryMockLogin(email, password, "Configuration missing");
    }
  };

  const tryMockLogin = (email, password, originalErrorMsg) => {
    if (email === MOCK_ADMIN_EMAIL && password === MOCK_ADMIN_PASSWORD) {
      const mockUser = {
        uid: "mock-admin-id",
        email: MOCK_ADMIN_EMAIL,
        displayName: "Tamil Nadu Sports Admin (Mock)",
        isMock: true
      };
      setUser(mockUser);
      localStorage.setItem("mock_admin_session", JSON.stringify(mockUser));
      return { success: true };
    }
    return { 
      success: false, 
      error: `Invalid credentials. For offline mock access, use Email: ${MOCK_ADMIN_EMAIL} and Password: ${MOCK_ADMIN_PASSWORD}.` 
    };
  };

  const logout = async () => {
    if (authMode === "firebase" && auth) {
      try {
        await firebaseSignOut(auth);
      } catch (err) {
        console.error("Firebase SignOut Error", err);
      }
    }
    setUser(null);
    localStorage.removeItem("mock_admin_session");
    return { success: true };
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin: !!user, loading, authMode, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
