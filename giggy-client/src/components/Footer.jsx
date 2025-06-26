import React, { useEffect, useState } from 'react';
import { FaInstagramSquare, FaFacebook, FaYoutube } from "react-icons/fa";

export default function Footer() {
    const [theme, setTheme] = useState(document.documentElement.getAttribute('data-theme') || 'light');


    useEffect(() => {
        const handleThemeChange = () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            setTheme(currentTheme || 'light');
        };

        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
                    handleThemeChange();
                }
            }
        });

        observer.observe(document.documentElement, { attributes: true });

        handleThemeChange();

        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <footer className="w-full bg-bgc text-txt border-t border-[color:var(--divider-color)] mt-auto">
            <div className="w-[92%] max-w-7xl mx-auto py-8 px-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">

                    <div className="flex items-center space-x-3">
                        <img
                            src={theme === 'dark' ? "/LogoD.png" : "/LogoL.png"}
                            alt="GIGGY Logo"
                            className="h-10 w-auto"
                            onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/40x40/${theme === 'dark' ? 'FFFFFF/000000' : '000000/FFFFFF'}?text=G`; }}
                        />
                        <span className="text-2xl font-bold">GIGGY</span>
                    </div>


                    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 text-sm">
                        <a
                            href="#"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-sky-400 transition-colors"
                        >
                            Terms & Conditions
                        </a>
                        <a
                            href="#"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-sky-400 transition-colors"
                        >
                            Privacy Policy
                        </a>
                    </div>

                    <div className="flex space-x-4">
                        <a href="https://www.facebook.com/better.call.vee" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors" aria-label="Facebook">
                            <FaFacebook size={24} />
                        </a>
                        <a href="https://www.instagram.com/neelbilai/" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 transition-colors" aria-label="Instagram">
                            <FaInstagramSquare size={24} />
                        </a>
                        <a href="https://www.youtube.com/@JeffNippard" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 transition-colors" aria-label="YouTube">
                            <FaYoutube size={24} />
                        </a>
                    </div>

                </div>

                {/* Copyright */}
                <div className="mt-8 pt-6 border-t border-[color:var(--divider-color)] text-center">
                    <p className="text-sm opacity-60">
                        © {new Date().getFullYear()} GIGGY. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}