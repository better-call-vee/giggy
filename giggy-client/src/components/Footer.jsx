import React, { useEffect, useState } from 'react';
import { FaInstagramSquare, FaFacebook, FaYoutube } from "react-icons/fa";

export default function Footer() {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        setDarkMode(isDark);
    }, []);

    return (
        <footer className="w-screen bg-bgc text-txt border-t border-[color:var(--color-divider)] mt-auto">
            <div className="w-[85%] mx-auto py-10 px-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                    {/* Logo and Brand */}
                    <div className="flex items-center space-x-2">
                        <img
                            src={darkMode ? "/LogoD.png" : "/LogoL.png"}
                            alt="GIGGY Logo"
                            className="h-12 w-auto"
                        />
                        <span className="text-2xl font-extralight">GIGGY</span>
                    </div>

                    {/* Social Media Icons */}
                    <div className="flex space-x-4">
                        <a
                            href="https://www.facebook.com/better.call.vee"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-blue-400 transition-colors duration-200"
                            aria-label="Facebook"
                        >
                            <FaFacebook size={28} />
                        </a>
                        <a
                            href="https://www.instagram.com/neelbilai/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-pink-400 transition-colors duration-200"
                            aria-label="Instagram"
                        >
                            <FaInstagramSquare size={28} />
                        </a>
                        <a
                            href="https://www.youtube.com/@JeffNippard"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-red-400 transition-colors duration-200"
                            aria-label="YouTube"
                        >
                            <FaYoutube size={28} />
                        </a>
                    </div>

                    {/* Legal Links */}
                    <div className="flex flex-col md:flex-row md:space-x-6 space-y-2 md:space-y-0">
                        <a
                            href="https://gatsport.com/blogs/gat-train/bodybuilding-glossary-a-z-terminology?srsltid=AfmBOopsiiH89jaoZEgL3jUcznWKNh-FXhBoLq_6HF7RG2lHataVcjDU"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-blue-300 transition-colors duration-200 text-sm md:text-base"
                        >
                            Terms & Conditions
                        </a>
                        <div className="hidden md:block w-px h-4 bg-[color:var(--color-divider)] self-center"></div>
                        <a
                            href="https://www.facebook.com/messages/t/better.call.vee"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-blue-300 transition-colors duration-200 text-sm md:text-base"
                        >
                            Privacy Policy
                        </a>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-8 pt-4 border-t border-[color:var(--color-divider)] text-center">
                    <p className="text-sm opacity-70">
                        © {new Date().getFullYear()} GIGGY. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
