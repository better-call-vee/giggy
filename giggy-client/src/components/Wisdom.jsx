import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Zoom, Fade } from "react-awesome-reveal";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

const videos = [
    {
        id: 1,
        title: "Best Freelancing Skills",
        url: "https://youtu.be/kGvXPulXoB4?si=LD4_89ua8xDDFK9O",
        thumb: "https://img.youtube.com/vi/kGvXPulXoB4/hqdefault.jpg",
    },
    {
        id: 2,
        title: "Earn $500/Month from Home",
        url: "https://youtu.be/w1DTbOQSKnw?si=ZV5KI18tDdEoctZ7",
        thumb: "https://img.youtube.com/vi/w1DTbOQSKnw/hqdefault.jpg",
    },
    {
        id: 3,
        title: "Secrets to Freelance Success",
        url: "https://youtu.be/SI_WuWOlHKY?si=hCDuatG6W1fB5jyk",
        thumb: "https://img.youtube.com/vi/SI_WuWOlHKY/hqdefault.jpg",
    },
];

const Wisdom = () => {
    return (
        <section className="bg-[color:var(--color-bbgc)] py-16 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                <Fade cascade damping={0.1}>
                    <h2 className="text-4xl font-bold text-center mb-8 text-[color:var(--color-txt)]">
                        Explore Freelancing Mastery
                    </h2>
                </Fade>

                <div className="flex flex-col lg:flex-row items-center gap-8">
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
                        {videos.map((video) => (
                            <Zoom key={video.id} triggerOnce duration={600}>
                                <div
                                    data-tooltip-id="video-tooltip"
                                    data-tooltip-content={video.title}
                                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105"
                                >
                                    <a href={video.url} target="_blank" rel="noopener noreferrer">
                                        <img
                                            src={video.thumb}
                                            alt={video.title}
                                            className="w-full h-40 object-cover"
                                        />
                                        <div className="p-4">
                                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                                                {video.title}
                                            </h3>
                                        </div>
                                    </a>
                                </div>
                            </Zoom>
                        ))}
                    </div>

                    <div className="flex justify-center">
                        <DotLottieReact
                            src="https://lottie.host/5be81ca6-4f16-49b2-8e47-96140c3f39a7/y0SAtw4OJO.lottie"
                            className="w-60 h-60 md:w-80 md:h-80"
                            loop
                            autoplay
                        />
                    </div>
                </div>
            </div>

            {/* Tooltip shown on hover */}
            <Tooltip id="video-tooltip" place="top" />
        </section>
    );
};

export default Wisdom;
