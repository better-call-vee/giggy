import React, { useState, useEffect, useRef, useContext } from "react";
import { FaHome, FaSearch } from "react-icons/fa";
import {
    MdDarkMode,
    MdLightMode,
    MdLibraryAdd,
    MdTask,
    MdMenu,
    MdClose
} from "react-icons/md";
import { BiLogIn } from "react-icons/bi";
import { NavLink, Link, useNavigate } from "react-router-dom";
import AuthContext from '../provider/AuthContext';
import Swal from 'sweetalert2';

const tabs = [
    { icon: <FaHome />, title: "Home", to: "/" },
    { icon: <FaSearch />, title: "Browse", to: "/browse" },
    { icon: <MdLibraryAdd />, title: "Add Task", to: "/add" },
    { icon: <MdTask />, title: "My Tasks", to: "/tasks" },
];

const Navbar = () => {
    const { user, logOut } = useContext(AuthContext);
    const navigate = useNavigate();
    const [darkMode, setDarkMode] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Initialize theme
    useEffect(() => {
        const saved = localStorage.getItem("darkMode") === "true";
        setDarkMode(saved);
        document.documentElement.setAttribute(
            "data-theme",
            saved ? "dark" : "light"
        );
    }, []);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleDarkMode = () => {
        const next = !darkMode;
        setDarkMode(next);
        localStorage.setItem("darkMode", next);
        document.documentElement.setAttribute(
            "data-theme",
            next ? "dark" : "light"
        );
    };

    const toggleDrawer = () => {
        setIsDrawerOpen(prev => !prev);
    };

    const handleLogout = async () => {
        const result = await Swal.fire({
            title: 'Are you sure you want to logout?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, logout',
            cancelButtonText: 'Cancel',
            reverseButtons: true,
            background: document.documentElement.getAttribute('data-theme') === 'dark' ? '#1f2937' : '#ffffff',
            color: document.documentElement.getAttribute('data-theme') === 'dark' ? '#f9fafb' : '#1f2937'
        });
        if (result.isConfirmed) {
            try {
                await logOut();
                Swal.fire({
                    icon: 'success',
                    title: 'Logged out!',
                    showConfirmButton: false,
                    timer: 1200,
                    background: document.documentElement.getAttribute('data-theme') === 'dark' ? '#1f2937' : '#ffffff',
                    color: document.documentElement.getAttribute('data-theme') === 'dark' ? '#f9fafb' : '#1f2937'
                });
                navigate('/auth/login');
            } catch (err) {
                Swal.fire({
                    icon: 'error',
                    title: 'Logout failed',
                    text: err.message,
                });
            }
        }
    };

    return (
        <>
            <nav className="h-16 shadow-md transition-colors bg-bgc text-txt relative z-20">
                <div className="h-full w-[92%] max-w-7xl mx-auto flex justify-between items-center relative">
                    <div className="md:hidden flex items-center">
                        <img
                            src={darkMode ? "/LogoD.png" : "/LogoL.png"}
                            alt="GIGGY Logo"
                            className="h-8 w-8"
                        />
                    </div>

                    <div className="absolute left-1/2 transform -translate-x-1/2 md:hidden text-xl font-bold">
                        GIGGY
                    </div>

                    <button
                        className="text-2xl md:hidden"
                        onClick={toggleDrawer}
                        aria-label="Toggle Menu"
                    >
                        {isDrawerOpen ? <MdClose /> : <MdMenu />}
                    </button>

                    <div className="hidden md:flex items-center gap-2 text-xl font-bold">
                        <img
                            src={darkMode ? "/LogoD.png" : "/LogoL.png"}
                            alt="GIGGY Logo"
                            className="h-8 w-8"
                        />
                        <span>GIGGY</span>
                    </div>

                    <div className="hidden md:flex items-center h-full">
                        <div className="self-stretch w-px border-l border-[var(--divider-color)]" />
                        <div className="flex items-center divide-x divide-[var(--divider-color)] h-full">
                            {tabs.map(({ icon, title }, idx) => (
                                <NavLink
                                    key={idx}
                                    to={tabs[idx].to}
                                    title={title}
                                    className="h-full px-4 flex items-center justify-center transition-colors duration-200 hover:bg-[var(--icon-hover-bg)] cursor-pointer"
                                >
                                    <span className="text-xl">{icon}</span>
                                </NavLink>
                            ))}
                            <button
                                onClick={toggleDarkMode}
                                title="Toggle Theme"
                                className="h-full px-4 flex items-center justify-center transition-colors duration-200 hover:bg-[var(--icon-hover-bg)] cursor-pointer"
                            >
                                <span className="text-xl">
                                    {darkMode ? <MdDarkMode /> : <MdLightMode />}
                                </span>
                            </button>
                        </div>
                        <div className="self-stretch w-px border-r border-[var(--divider-color)]" />
                    </div>

                    <div className="hidden md:flex items-center">
                        {user ? (
                            <div className="relative ml-4" ref={dropdownRef}>
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="w-10 h-10 rounded-full overflow-hidden border-2 border-transparent hover:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
                                >
                                    <img
                                        src={user.photoURL || '/default-avatar.png'}
                                        alt="Profile"
                                        className="object-cover w-full h-full"
                                    />
                                </button>
                                {dropdownOpen && (
                                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 z-50">
                                        <div className="py-1">
                                            <Link
                                                to="/profile"
                                                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                                                onClick={() => setDropdownOpen(false)}
                                            >
                                                My Profile
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <NavLink
                                to="/auth/login"
                                className="hidden md:flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200"
                            >
                                <BiLogIn />
                                <span className="hidden sm:inline">Login</span>
                            </NavLink>
                        )}
                    </div>
                </div>
            </nav>

            {isDrawerOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-10"
                    onClick={toggleDrawer}
                />
            )}

            <div
                className={`fixed top-0 left-0 w-3/4 h-full bg-bgc shadow-lg z-20 p-4 flex flex-col gap-4 transform transition-transform duration-300 ${isDrawerOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                {tabs.map(({ icon, title, to }, idx) => (
                    <NavLink
                        key={idx}
                        to={to}
                        title={title}
                        onClick={() => setIsDrawerOpen(false)}
                        className="flex items-center gap-2 p-2 hover:bg-[var(--icon-hover-bg)] rounded transition"
                    >
                        <span className="text-xl">{icon}</span>
                        <span>{title}</span>
                    </NavLink>
                ))}

                <button
                    onClick={toggleDarkMode}
                    className="flex items-center gap-2 p-2 hover:bg-[var(--icon-hover-bg)] rounded transition"
                >
                    <span className="text-xl">
                        {darkMode ? <MdDarkMode /> : <MdLightMode />}
                    </span>
                    <span>Toggle Theme</span>
                </button>

                {user ? (
                    <>
                        <button
                            onClick={() => { navigate('/profile'); setIsDrawerOpen(false); }}
                            className="flex items-center gap-2 p-2 hover:bg-[var(--icon-hover-bg)] rounded transition"
                        >
                            <img src={user.photoURL || '/default-avatar.png'} alt="Profile" className="w-6 h-6 rounded-full" />
                            <span>My Profile</span>
                        </button>
                        <button
                            onClick={async () => { setIsDrawerOpen(false); await handleLogout(); }}
                            className="flex items-center gap-2 p-2 hover:bg-[var(--icon-hover-bg)] rounded transition text-red-500"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <NavLink
                        to="/auth/login"
                        onClick={() => setIsDrawerOpen(false)}
                        className="flex items-center gap-2 p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                        <BiLogIn />
                        <span>Login</span>
                    </NavLink>
                )}
            </div>
        </>
    );
};

export default Navbar;
