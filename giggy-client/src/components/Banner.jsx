import React, { useEffect, useState } from 'react';
import { Typewriter } from 'react-simple-typewriter';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/autoplay';

export default function Banner() {
    const [isDark, setIsDark] = useState(false);
    const [currentBanner, setCurrentBanner] = useState(0);

    useEffect(() => {
        const theme = document.documentElement.getAttribute('data-theme');
        setIsDark(theme === 'dark');
        const observer = new MutationObserver(() => {
            const newTheme = document.documentElement.getAttribute('data-theme');
            setIsDark(newTheme === 'dark');
        });
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme'],
        });
        return () => observer.disconnect();
    }, []);

    const lightGradient = 'bg-[linear-gradient(135deg,_#81c2df,_#b8d4e0,_#7ddfdd,_#e2e5e3,_#b7e6e2)]';
    const darkGradient = 'bg-[linear-gradient(135deg,_#0f172a,_#1e293b,_#334155,_#475569)]';
    const backgroundClass = isDark ? darkGradient : lightGradient;

    const banners = [
        {
            id: 1,
            img: '/ban-1.png',
            header: (
                <>
                    Welcome to <span className="text-red-600 drop-shadow-[1px_1px_1px_black]">GIGGY</span>
                </>
            ),
            punchlines: [
                'Discover Top Freelancers Today!',
                'Grow Your Business Seamlessly!',
                'Connect with Talent Globally!',
                'Freelance Freedom at Your Fingertips!',
            ],
        },
        {
            id: 2,
            img: '/ban-2.png',
            header: (
                <>
                    Power your <span className="text-red-600 drop-shadow-[1px_1px_1px_black]">GIGGY</span> Experience
                </>
            ),
            punchlines: [
                'Hire Experts Instantly!',
                'Post Gigs with One Click!',
                'Empowering Freelancers Worldwide!',
                'Your Journey Starts Here!',
            ],
        },
        {
            id: 3,
            img: '/ban-3.png',
            header: (
                <>
                    Elevate with <span className="text-red-600 drop-shadow-[1px_1px_1px_black]">GIGGY</span>
                </>
            ),
            punchlines: [
                'Unlock Your Potential Today!',
                'Turn Passion into Profession!',
                'Join the Future of Work!',
                'Scale Your Projects Effortlessly!',
            ],
        },
    ];

    return (
        <section className="w-full min-h-[80vh] overflow-hidden">
            <Swiper
                modules={[Autoplay]}
                autoplay={{ delay: 6000, disableOnInteraction: false }}
                loop={true}
                onSlideChange={({ realIndex }) => setCurrentBanner(realIndex)}
                className="w-full"
            >
                {banners.map(({ id, img, header, punchlines }) => (
                    <SwiperSlide key={id}>
                        <div
                            className={`w-full min-h-[80vh] flex flex-col lg:flex-row items-center justify-between px-8 lg:px-20 py-12 ${backgroundClass}`}
                        >
                            {/* Left */}
                            <div className="w-full lg:w-1/2 flex flex-col justify-center space-y-6 z-10">
                                <h1 className="text-4xl lg:text-6xl font-bold text-[color:var(--color-txt)]">
                                    {header}
                                </h1>

                                <h2 className="text-2xl lg:text-3xl font-medium text-[color:var(--color-txt)]">
                                    <Typewriter
                                        words={punchlines}
                                        loop={0}
                                        cursor
                                        cursorStyle="_"
                                        typeSpeed={60}
                                        deleteSpeed={40}
                                        delaySpeed={1500}
                                    />
                                </h2>

                                <Link
                                    to="/auth/register"
                                    className="max-w-max mt-4 inline-block px-6 py-3 rounded-2xl font-semibold text-white transition bg-red-600 hover:bg-red-700"
                                >
                                    Let's Start
                                </Link>
                            </div>

                            {/* Right */}
                            <div className="w-full lg:w-1/2 mt-8 lg:mt-0 mb-0 flex justify-center lg:justify-end relative">
                                <img
                                    src={img}
                                    alt={`Banner ${id} Illustration`}
                                    className={`object-contain max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg absolute ${id === 3
                                            ? 'top-[-15rem] lg:top-[-18rem]'
                                            : 'top-[-11.7rem] lg:top-[-14rem]'
                                        } right-0 transform translate-x-1/4 -translate-y-1/4 lg:translate-x-0 mb-0 lg:translate-y-0`}
                                />
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
}
