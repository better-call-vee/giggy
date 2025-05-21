import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../provider/AuthContext";
import Loading from "./Loading";

const BrowseTasks = () => {
    const { user } = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bidCount, setBidCount] = useState(null);

    useEffect(() => {
        // Fetch tasks
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

        // Fetch bid count if logged in
        if (user?.email) {
            fetch(`https://giggy-server.vercel.app/cbids/${user.email}`)
                .then((res) => res.json())
                .then((data) => {
                    if (data?.count !== undefined) {
                        setBidCount(data.count);
                    } else {
                        setBidCount(0); // fallback
                    }
                })
                .catch((err) => {
                    console.error("Failed to fetch bid count", err);
                    setBidCount(0);
                });
        }
    }, [user?.email]);

    if (loading) return <Loading />;

    return (
        <div className="min-h-screen bg-[color:var(--color-bbgc)] py-10 px-4">
            <h2 className="text-3xl font-semibold text-[color:var(--color-txt)] text-center mb-2">
                Browse Tasks
            </h2>

            {user?.email && bidCount !== null && (
                <p className="text-center text-lg font-medium text-[color:var(--color-sry)] mb-8">
                    YOUR BID OPPORTUNITIES: {bidCount}
                </p>
            )}

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
