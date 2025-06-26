import { useEffect, useState } from "react";
import { Typewriter } from "react-simple-typewriter";
import { Link } from "react-router-dom";

const FeaturedTasks = () => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        fetch("https://giggy-server.vercel.app/tasks")
            .then((res) => res.json())
            .then((data) => {
                const sorted = data
                    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
                    .slice(0, 6);
                setTasks(sorted);
            });
    }, []);

    return (
        <section className="max-w-[85%] mx-auto my-12">
            {/* Banner Section */}
            <div className="rounded-t-2xl overflow-hidden border border-[color:var(--color-divider)] bg-[color:var(--color-bbgc)] p-6 flex flex-col md:flex-row items-center gap-6">
                <div className="w-full md:w-1/2 float-animation border border-[color:var(--color-divider)] rounded-lg overflow-hidden">
                    <img
                        src="/featured.gif"
                        alt="Featured"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="w-full md:w-1/2 text-center md:text-left">
                    <h2 className="text-3xl md:text-4xl font-bold text-[color:var(--color-txt)]">
                        <Typewriter
                            words={["Discover Tasks With Imminent Deadlines"]}
                            loop={0}
                            cursor
                            cursorStyle="_"
                            typeSpeed={80}
                            deleteSpeed={50}
                            delaySpeed={2000}
                        />
                    </h2>
                </div>
            </div>

            {/* Task List */}
            <div className="bg-[color:var(--color-bgc)] border-x border-b border-[color:var(--color-divider)] rounded-b-2xl">
                {tasks.map((task) => (
                    <div
                        key={task._id}
                        className="flex justify-between items-center px-6 py-4 border-b last:border-b-0 border-[color:var(--color-divider)] hover:bg-[color:var(--icon-hover-bg)] transition"
                    >
                        <div>
                            <h3 className="text-lg font-semibold text-[color:var(--color-txt)]">
                                {task.title}
                            </h3>
                            <p className="text-sm text-[color:var(--color-txt)]">
                                Deadline: {new Date(task.deadline).toLocaleDateString()}
                            </p>
                        </div>
                        <Link
                            to={`/browse/${task._id}`}
                            className="bg-[color:var(--color-primary)] text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                        >
                            View Details
                        </Link>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FeaturedTasks;
