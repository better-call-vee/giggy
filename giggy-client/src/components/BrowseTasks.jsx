import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loading from "./Loading";

const BrowseTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("https://giggy-server.vercel.app/tasks")
            .then((res) => res.json())
            .then((data) => {
                setTasks(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) return <Loading />;

    return (
        <div className="min-h-screen bg-[color:var(--color-bbgc)] py-10 px-4">
            <h2 className="text-3xl font-semibold text-[color:var(--color-txt)] text-center mb-10">
                Browse Tasks
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                {tasks.map((task) => (
                    <div
                        key={task._id.$oid}
                        className="bg-[color:var(--color-bgc)] border border-slate-300 dark:border-slate-700 rounded-2xl shadow-md hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 p-6 flex flex-col justify-between"
                    >
                        <div>
                            <h3 className="text-xl font-bold text-[color:var(--color-txt)] mb-2">
                                {task.title}
                            </h3>
                            <p className="text-lg font-medium text-[color:var(--color-sry)]">
                                Budget: ${task.budget}
                            </p>
                        </div>

                        <Link
                            to={`/browse/${task._id}`}
                            className="mt-6 inline-block text-center bg-[color:var(--color-accent)] text-white font-semibold py-2 px-4 rounded-lg hover:bg-emerald-600 transition-colors duration-300"
                        >
                            View Details
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BrowseTasks;
