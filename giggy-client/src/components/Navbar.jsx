import { useState, useEffect } from "react";
import { FaHome, FaSearch } from "react-icons/fa";
import {
    MdDarkMode,
    MdLightMode,
    MdLibraryAdd,
    MdTask,
} from "react-icons/md";
import { BiLogIn } from "react-icons/bi";

const tabs = [
    { icon: <FaHome />, title: "Home" },
    { icon: <FaSearch />, title: "Browse" },
    { icon: <MdLibraryAdd />, title: "Add Task" },
    { icon: <MdTask />, title: "My Tasks" },
];

const Navbar = () => {
    const [darkMode, setDarkMode] = useState(false);

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

    return (
        <nav className="h-16 shadow-md transition-colors bg-bgc text-txt">
            <div className="h-full w-[85%] mx-auto flex justify-between items-center">
                <div className="flex items-center gap-2 text-xl font-bold cursor-pointer">
                    <img
                        src={darkMode ? "/LogoD.png" : "/LogoL.png"}
                        alt="GIGGY Logo"
                        className="h-8 w-8"
                    />
                    <span className="hidden sm:inline">GIGGY</span>
                </div>

                <div className="flex items-center h-full">
                    <div className="self-stretch w-px border-l border-[divider-color]" />

                    <div className="flex items-center divide-x divide-[divider-color] h-full">
                        {tabs.map(({ icon, title }, idx) => (
                            <button 
                                key={idx}
                                title={title}
                                className="
                  h-full px-4
                  flex items-center justify-center
                  transition-colors duration-200
                  hover:bg-[var(--icon-hover-bg)]
                  cursor-pointer
                "
                            >
                                <span className="text-xl">{icon}</span>
                            </button>
                        ))}

                        <button
                            onClick={toggleDarkMode}
                            title="Toggle Theme"
                            className="
                h-full px-4
                flex items-center justify-center
                transition-colors duration-200
                hover:bg-[var(--icon-hover-bg)]
                cursor-pointer
              "
                        >
                            <span className="text-xl">
                                {darkMode ? <MdDarkMode /> : <MdLightMode />}
                            </span>
                        </button>
                    </div>

                    <div className="self-stretch w-px border-r border-[divider-color]" />
                </div>

                <button className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200 cursor-pointer">
                    <BiLogIn />
                    <span className="hidden sm:inline">Login</span>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
