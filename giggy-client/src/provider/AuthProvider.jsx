// src/provider/AuthProvider.jsx
import React, { useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import app from "../firebase/firebase.config";
import Loading from "../components/Loading";
import {
    getAuth,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    GoogleAuthProvider,
    signInWithPopup,
} from "firebase/auth";

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const BACKEND_URL = "https://giggy-server.vercel.app/users";

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Create user (email + password)
    const createUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password)
            .then(async (result) => {
                await saveUserToBackend(result.user);
                return result;
            });
    };

    // Sign in (email + password)
    const signIn = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password)
            .then(async (result) => {
                // Optionally update lastSignInTime in backend:
                await saveUserToBackend(result.user);
                return result;
            });
    };

    // Google Sign-In
    const signInWithGoogle = () => {
        setLoading(true);
        return signInWithPopup(auth, googleProvider)
            .then(async (result) => {
                await saveUserToBackend(result.user);
                return result;
            });
    };

    // Update displayName / photoURL
    const updateUser = (data) => {
        setLoading(true);
        return updateProfile(auth.currentUser, data);
    };

    // Logout
    const logOut = () => {
        setLoading(true);
        return signOut(auth);
    };

    // Helper: persist a Firebase user to your backend
    const saveUserToBackend = async (firebaseUser) => {
        const payload = {
            name: firebaseUser.displayName || "",
            email: firebaseUser.email,
            photo: firebaseUser.photoURL || "",
            creationTime: firebaseUser.metadata?.creationTime,
            lastSignInTime: firebaseUser.metadata?.lastSignInTime,
        };
        try {
            await fetch(BACKEND_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
        } catch (err) {
            console.error("Failed saving user to backend:", err);
        }
    };

    // Listen for auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (current) => {
            setUser(current);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const authData = {
        user,
        loading,
        createUser,
        signIn,
        signInWithGoogle,
        updateUser,
        logOut,
    };

    return (
        <AuthContext.Provider value={authData}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
