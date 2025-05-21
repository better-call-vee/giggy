import React, { useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthContext from "../provider/AuthContext";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from "sweetalert2";

const BACKEND_URL = "https://giggy-server.vercel.app/users";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    const { signIn, signInWithGoogle } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();
    const from = location.state?.from?.pathname || "/";

    const updateLastSignIn = async (user) => {
        try {
            const localTime = new Date(user.metadata.lastSignInTime).toLocaleString();
            const res = await fetch(BACKEND_URL, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: user.email, lastSignInTime: localTime }),
            });
            const data = await res.json();
            if (!data.success) console.warn("PATCH /users failed:", data.error);
            return data.user;
        } catch (err) {
            console.error("Failed to update lastSignInTime:", err);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const result = await signIn(email, password);
            await updateLastSignIn(result.user);

            // show alert immediately, then navigate when it closes
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Logged in successfully",
                showConfirmButton: false,
                timer: 1200,
                timerProgressBar: true,
                willClose: () => navigate(from, { replace: true })
            });
        } catch (err) {
            console.error(err);
            const msg = err.message || err.code || "Login failed";
            setError(msg);
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Login error",
                text: msg,
            });
        }
    };

    const handleGoogleSignIn = async () => {
        setError("");

        try {
            const result = await signInWithGoogle();
            await updateLastSignIn(result.user);

            Swal.fire({
                position: "center",
                icon: "success",
                title: "Logged in with Google",
                showConfirmButton: false,
                timer: 1200,
                timerProgressBar: true,
                willClose: () => navigate(from, { replace: true })
            });
        } catch (err) {
            console.error(err);
            const msg = err.message || "Google sign-in failed";
            setError(msg);
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Google sign-in error",
                text: msg,
            });
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="card bg-gray-800 text-white w-full max-w-sm shadow-2xl py-5">
                <h2 className="text-2xl text-center font-semibold mb-4 text-sky-400">
                    Login
                </h2>

                <form onSubmit={handleLogin} className="card-body space-y-4">
                    {/* Email */}
                    <div>
                        <label className="label text-white">Email</label>
                        <input
                            name="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input bg-gray-900 border border-sky-400 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div className="relative">
                        <label className="label text-white">Password</label>
                        <input
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input bg-gray-900 border border-sky-400 text-white placeholder-gray-400 pr-10 focus:outline-none focus:ring-2 focus:ring-sky-400"
                            placeholder="••••••••"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-6 top-4 flex items-center text-gray-400 hover:text-white"
                        >
                            {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                        </button>
                    </div>

                    {/* Error */}
                    {error && <p className="text-red-500 text-xs">{error}</p>}

                    {/* Submit */}
                    <button
                        type="submit"
                        className="btn w-full bg-red-500 hover:bg-red-600 text-white font-semibold transition"
                    >
                        Login
                    </button>
                </form>

                <p className="text-center text-gray-300 mt-2">
                    <Link
                        to="/auth/forgot"
                        state={{ email }}
                        className="text-sky-400 hover:underline"
                    >
                        Forgot Password?
                    </Link>
                </p>

                <div className="divider border-gray-700">OR</div>

                <button
                    onClick={handleGoogleSignIn}
                    className="btn btn-outline w-full flex items-center justify-center gap-2 mb-4 hover:bg-green-300 hover:text-black transition"
                >
                    <FcGoogle size={24} /> Continue with Google
                </button>

                <p className="text-center text-gray-300">
                    Don’t have an account?{" "}
                    <Link to="/auth/register" className="text-sky-400 hover:underline">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}
