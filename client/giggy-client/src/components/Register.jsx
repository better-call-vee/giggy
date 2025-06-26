import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../provider/AuthContext";
import Swal from "sweetalert2";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";
import Loading from "./Loading";

const BACKEND_URL = "https://giggy-server.vercel.app/users";

export default function Register() {
    const [nameError, setNameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

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
        const localTime = new Date(user.metadata.lastSignInTime).toLocaleString();
        const payload = {
            name: user.displayName || "",
            email: user.email,
            photoURL: user.photoURL || "",
            creationTime: user.metadata?.creationTime,
            lastSignInTime: localTime,
        };

        const res = await fetch(BACKEND_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const txt = await res.text();
            throw new Error(`Backend returned ${res.status}: ${txt}`);
        }

        const data = await res.json();
        if (!data.success) throw new Error("Unknown backend error");
        return data.user;
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        const { name, email, photoURL, password } = e.target.elements;

        if (name.value.trim().length < 5) {
            setNameError("Name must be at least 5 characters");
            return;
        }
        setNameError("");

        const pwdErrs = validatePassword(password.value);
        if (pwdErrs.length) {
            setPasswordError(`Password must contain ${pwdErrs.join(", ")}`);
            return;
        }
        setPasswordError("");

        try {
            setIsLoading(true);
            const result = await createUser(email.value, password.value);

            await updateUser({
                displayName: name.value.trim(),
                photoURL: photoURL.value.trim(),
            });

            await saveToBackend(result.user);

            Swal.fire({
                position: "center",
                icon: "success",
                title: "Account created!",
                showConfirmButton: false,
                timer: 1500,
            });

            // Temporarily navigate to safe route
            navigate("/");

        } catch (err) {
            const msg =
                err.code === "auth/operation-not-allowed"
                    ? "Please enable Email/Password in Firebase console."
                    : err.message;
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Registration error",
                text: msg,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            setIsLoading(true);
            const result = await signInWithGoogle();
            await saveToBackend(result.user);

            Swal.fire({
                position: "center",
                icon: "success",
                title: "Signed in with Google",
                showConfirmButton: false,
                timer: 1200,
            });

            navigate("/");
        } catch (err) {
            const msg = err.message || "Google login failed";
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Google Login error",
                text: msg,
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <Loading />;

    return (
        <div
            className="flex justify-center items-center min-h-screen bg-[--color-bgc]"
        >
            <div
                className="w-full max-w-sm p-6 rounded-2xl shadow-md"
                style={{
                    background: "var(--color-bgc)",
                    color: "var(--color-txt)",
                }}
            >
                <h2
                    className="text-3xl font-bold text-center mb-6"
                    style={{ color: "var(--color-primary)" }}
                >
                    Register
                </h2>
                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label className="block mb-1">Name</label>
                        <input
                            name="name"
                            required
                            className="w-full px-4 py-2 rounded border"
                            style={{
                                background: "var(--color-bgc)",
                                borderColor: "var(--color-divider)",
                                color: "var(--color-txt)",
                            }}
                        />
                        {nameError && (
                            <p className="text-sm" style={{ color: "var(--color-error)" }}>
                                {nameError}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block mb-1">Email</label>
                        <input
                            name="email"
                            type="email"
                            required
                            className="w-full px-4 py-2 rounded border"
                            style={{
                                background: "var(--color-bgc)",
                                borderColor: "var(--color-divider)",
                                color: "var(--color-txt)",
                            }}
                        />
                    </div>
                    <div>
                        <label className="block mb-1">Photo URL</label>
                        <input
                            name="photoURL"
                            required
                            className="w-full px-4 py-2 rounded border"
                            style={{
                                background: "var(--color-bgc)",
                                borderColor: "var(--color-divider)",
                                color: "var(--color-txt)",
                            }}
                        />
                    </div>
                    <div className="relative">
                        <label className="block mb-1">Password</label>
                        <input
                            name="password"
                            type={showPassword ? "text" : "password"}
                            required
                            className="w-full px-4 py-2 rounded border pr-10"
                            style={{
                                background: "var(--color-bgc)",
                                borderColor: "var(--color-divider)",
                                color: "var(--color-txt)",
                            }}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute top-9 right-2 p-1 rounded"
                            style={{ background: "var(--icon-hover-bg)" }}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                        {passwordError && (
                            <p className="text-sm" style={{ color: "var(--color-error)" }}>
                                {passwordError}
                            </p>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 rounded"
                        style={{
                            background: "var(--color-accent)",
                            color: "#fff",
                        }}
                    >
                        Register
                    </button>
                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center gap-2 py-2 rounded border mt-2
             bg-[color:var(--color-bgc)] border-[color:var(--color-divider)] text-[color:var(--color-txt)]
             hover:bg-green-500 hover:text-white transition"
                    >
                        <FaGoogle /> Continue with Google
                    </button>

                    <p className="text-center mt-4 text-sm">
                        Already have an account?{" "}
                        <Link
                            to="/auth/login"
                            className="underline"
                            style={{ color: "var(--color-primary)" }}
                        >
                            Login
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
