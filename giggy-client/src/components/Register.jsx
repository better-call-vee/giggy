import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from '../provider/AuthContext';
import Swal from 'sweetalert2';
import { FaEye, FaEyeSlash, FaGoogle } from 'react-icons/fa';

const BACKEND_URL = "https://giggy-server.vercel.app/users";

export default function Register() {
    const [nameError, setNameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const { createUser, signInWithGoogle, updateUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const validatePassword = (pwd) => {
        const errs = [];
        if (pwd.length < 6) errs.push("at least 6 characters");
        if (!/[A-Z]/.test(pwd)) errs.push("an uppercase letter");
        if (!/[a-z]/.test(pwd)) errs.push("a lowercase letter");
        return errs;
    };

    const saveToBackend = async (user) => {
        const payload = {
            name: user.displayName || "",
            email: user.email,
            photoURL: user.photoURL || "",
            creationTime: user.metadata?.creationTime,
            lastSignInTime: localTime,
        };

        const localTime = new Date(user.metadata.lastSignInTime)
            .toLocaleString();

        const res = await fetch(BACKEND_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const txt = await res.text();
            console.error("Backend POST /users error:", res.status, txt);
            throw new Error(`Backend returned ${res.status}`);
        }

        const data = await res.json();
        if (!data.success) {
            throw new Error("Unknown backend error");
        }
        // data.user is the existing or new user document
        return data.user;
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        const { name, email, photoURL, password } = e.target.elements;

        // Name validation
        if (name.value.trim().length < 5) {
            setNameError("Name must be at least 5 characters");
            return;
        }
        setNameError("");

        // Password validation
        const pwdErrs = validatePassword(password.value);
        if (pwdErrs.length) {
            setPasswordError(`Password must contain ${pwdErrs.join(", ")}`);
            return;
        }
        setPasswordError("");

        try {
            // 1) Firebase signup
            const result = await createUser(email.value, password.value);

            // 2) Set displayName and photoURL
            await updateUser({
                displayName: name.value.trim(),
                photoURL: photoURL.value.trim(),
            });

            // 3) Save or upsert on backend
            await saveToBackend(result.user);

            // 4) Success alert
            await Swal.fire({
                position: "center",
                icon: "success",
                title: "Account created!",
                showConfirmButton: false,
                timer: 1500,
            });

            navigate("/");
        } catch (err) {
            console.error("Registration error:", err);
            const message = err.code === 'auth/operation-not-allowed'
                ? 'Please enable Email/Password in Firebase console.'
                : err.message;
            await Swal.fire({
                position: "center",
                icon: "error",
                title: "Registration error",
                text: message,
            });
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithGoogle();
            await saveToBackend(result.user);
            await Swal.fire({
                position: "center",
                icon: "success",
                title: "Signed in with Google",
                showConfirmButton: false,
                timer: 1200,
            });
            navigate("/");
        } catch (err) {
            console.error("Google login error:", err);
            await Swal.fire({
                position: "center",
                icon: "error",
                title: "Google Login error",
                text: err.message,
            });
        }
    };

    return (
        <div className="flex justify-center min-h-screen items-center">
            <div className="card bg-gray-800 text-white w-full max-w-sm shadow-2xl py-5">
                <h2 className="text-2xl font-semibold text-center mb-4 text-sky-400">
                    Register
                </h2>
                <form onSubmit={handleRegister} className="card-body space-y-4">
                    {/* Name */}
                    <div>
                        <label className="label text-white">Name</label>
                        <input name="name" className="input bg-gray-900 border-sky-400 text-white" required />
                        {nameError && <p className="text-red-500 text-xs mt-1">{nameError}</p>}
                    </div>
                    {/* Email */}
                    <div>
                        <label className="label text-white">Email</label>
                        <input name="email" type="email" className="input bg-gray-900 border-sky-400 text-white" required />
                    </div>
                    {/* Photo URL */}
                    <div>
                        <label className="label text-white">Photo URL</label>
                        <input name="photoURL" className="input bg-gray-900 border-sky-400 text-white" required />
                    </div>
                    {/* Password */}
                    <div className="relative">
                        <label className="label text-white">Password</label>
                        <input
                            name="password"
                            type={showPassword ? "text" : "password"}
                            className="input bg-gray-900 border-sky-400 text-white pr-10"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-6 top-4 flex items-center text-gray-400 hover:text-white"
                        >
                            {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                        </button>
                        {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
                    </div>
                    {/* Actions */}
                    <button type="submit" className="btn bg-red-500 hover:bg-red-600 w-full">Register</button>
                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="btn bg-white text-gray-800 w-full flex items-center justify-center gap-2"
                    >
                        <FaGoogle /> Continue with Google
                    </button>
                    <p className="text-center text-gray-300 mt-4">
                        Already have an account?{" "}
                        <Link to="/auth/login" className="text-sky-400 hover:underline">
                            Login
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
