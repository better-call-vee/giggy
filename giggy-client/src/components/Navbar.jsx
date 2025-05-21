import React, { useState, useEffect, useContext } from "react";
import { FaHome, FaSearch } from "react-icons/fa";
import {
  MdDarkMode,
  MdLightMode,
  MdLibraryAdd,
  MdTask,
  MdMenu,
  MdClose
} from "react-icons/md";
import { BiLogIn, BiLogOut } from "react-icons/bi";
import { NavLink, Link, useNavigate } from "react-router-dom";
import AuthContext from '../provider/AuthContext';
import Swal from 'sweetalert2';

const tabs = [
  { icon: <FaHome />, title: "Home", to: "/" },
  { icon: <FaSearch />, title: "Browse", to: "/browse" },
  { icon: <MdLibraryAdd />, title: "Add Task", to: "/add" },
  { icon: <MdTask />, title: "My Tasks", to: "/mytasks" },
];

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Initialize theme
  useEffect(() => {
    const saved = localStorage.getItem("darkMode") === "true";
    setDarkMode(saved);
    document.documentElement.setAttribute(
      "data-theme",
      saved ? "dark" : "light"
    );
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
    setIsDrawerOpen((prev) => !prev);
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
      <nav className="h-16 shadow-md bg-bgc text-txt transition-colors relative z-20">
        <div className="h-full w-[92%] max-w-7xl mx-auto flex justify-between items-center">
          {/* Mobile Logo + Menu */}
          <div className="md:hidden flex items-center gap-2">
            <img
              src={darkMode ? "/LogoD.png" : "/LogoL.png"}
              alt="GIGGY Logo"
              className="h-8 w-8"
            />
            <span className="text-xl font-bold">GIGGY</span>
          </div>

          <button
            onClick={toggleDrawer}
            className="text-2xl md:hidden"
            aria-label="Toggle Menu"
          >
            {isDrawerOpen ? <MdClose /> : <MdMenu />}
          </button>

          {/* Desktop Logo + Tabs */}
          <div className="hidden md:flex items-center gap-2 text-xl font-bold">
            <img
              src={darkMode ? "/LogoD.png" : "/LogoL.png"}
              alt="GIGGY Logo"
              className="h-8 w-8"
            />
            <span>GIGGY</span>
          </div>

          <div className="hidden md:flex items-center h-full">
            <div className="flex items-center divide-x divide-[var(--divider-color)] h-full">
              {tabs.map(({ icon, to, title }, idx) => (
                <NavLink
                  key={idx}
                  to={to}
                  title={title}
                  className="h-full px-4 flex items-center justify-center hover:bg-[var(--icon-hover-bg)] transition-colors duration-200"
                >
                  <span className="text-xl">{icon}</span>
                </NavLink>
              ))}
              <button
                onClick={toggleDarkMode}
                title="Toggle Theme"
                className="h-full px-4 flex items-center justify-center hover:bg-[var(--icon-hover-bg)] transition-colors duration-200"
              >
                {darkMode ? <MdDarkMode /> : <MdLightMode />}
              </button>
            </div>
          </div>

          {/* Auth Actions */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <img
                  src={user.photoURL || '/default-avatar.png'}
                  alt="Profile"
                  title={user.displayName || 'User'}
                  className="h-10 w-10 rounded-full object-cover border-2 border-transparent hover:border-sky-400 transition"
                />
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                  <BiLogOut /> Logout
                </button>
              </>
            ) : (
              <NavLink
                to="/auth/login"
                className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                <BiLogIn />
                <span>Login</span>
              </NavLink>
            )}
          </div>
        </div>
      </nav>

      {/* Overlay for drawer */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={toggleDrawer}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 left-0 w-3/4 h-full bg-bgc shadow-lg z-20 p-4 flex flex-col gap-4 transform transition-transform duration-300 ${
          isDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {tabs.map(({ icon, title, to }, idx) => (
          <NavLink
            key={idx}
            to={to}
            onClick={toggleDrawer}
            className="flex items-center gap-2 p-2 hover:bg-[var(--icon-hover-bg)] rounded transition"
          >
            <span className="text-xl">{icon}</span>
            <span>{title}</span>
          </NavLink>
        ))}

        <button
          onClick={() => { toggleDarkMode(); toggleDrawer(); }}
          className="flex items-center gap-2 p-2 hover:bg-[var(--icon-hover-bg)] rounded transition"
        >
          {darkMode ? <MdDarkMode /> : <MdLightMode />}
          <span>Toggle Theme</span>
        </button>

        {user ? (
          <>
            <Link
              to=""
              onClick={toggleDrawer}
              className="flex items-center gap-2 p-2 hover:bg-[var(--icon-hover-bg)] rounded transition"
            >
              <img
                src={user.photoURL || '/default-avatar.png'}
                alt="Profile"
                className="w-6 h-6 rounded-full"
              />
            </Link>
            <button
              onClick={async () => { toggleDrawer(); await handleLogout(); }}
              className="flex items-center gap-2 p-2 text-red-500 hover:bg-[var(--icon-hover-bg)] rounded transition"
            >
              <BiLogOut />
              <span>Logout</span>
            </button>
          </>
        ) : (
          <NavLink
            to="/auth/login"
            onClick={toggleDrawer}
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
