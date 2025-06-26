import React, {
    useEffect, useState,
    useContext
} from "react";
import { Link } from 'react-router-dom';
import AuthContext from '../provider/AuthContext';
import Loading from './Loading';
import { FaSort, FaSortUp, FaSortDown, FaCalendarAlt, FaDollarSign } from 'react-icons/fa';

const BrowseTasks = () => {
    const { user } = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bidCount, setBidCount] = useState(null);
    // State to manage sorting: 'asc' (ascending), 'desc' (descending), or 'none'
    const [sortOrder, setSortOrder] = useState('none');

    useEffect(() => {
        // Fetch tasks
        fetch("https://giggy-server.vercel.app/tasks")
            .then((res) => res.json())
            .then((data) => {
                // Process data to add a numeric budget for sorting
                const processedTasks = data.map(task => ({
                    ...task,
                    numericBudget: parseFloat(task.budget)
                }));
                setTasks(processedTasks);
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
                    setBidCount(data?.count !== undefined ? data.count : 0);
                })
                .catch((err) => {
                    console.error("Failed to fetch bid count", err);
                    setBidCount(0);
                });
        }
    }, [user?.email]);

    // Function to handle sorting logic
    const handleSort = () => {
        const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
        setSortOrder(newSortOrder);

        // Use the Array.prototype.sort() method. It's highly optimized (often Timsort in V8/SpiderMonkey)
        // and perfect for this use case. We sort a copy of the array to avoid mutating state directly.
        const sortedTasks = [...tasks].sort((a, b) => {
            if (newSortOrder === 'asc') {
                return a.numericBudget - b.numericBudget; // Ascending
            } else {
                return b.numericBudget - a.numericBudget; // Descending
            }
        });

        setTasks(sortedTasks);
    };

    // Helper function to determine if a task is expired
    const isExpired = (deadline) => {
        // We compare against the start of today. 
        // Any deadline before today is considered expired.
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize to the beginning of the day
        const deadlineDate = new Date(deadline);
        return deadlineDate < today;
    };


    if (loading) return <Loading />;

    // Helper to select the correct sort icon
    const SortIcon = () => {
        if (sortOrder === 'asc') return <FaSortUp className="ml-2" />;
        if (sortOrder === 'desc') return <FaSortDown className="ml-2" />;
        return <FaSort className="ml-2" />;
    };

    return (
        <div className="min-h-screen bg-[color:var(--color-bg-base)]">
            <div className="relative h-64 md:h-80 w-full border-b-4 border-[color:var(--color-txt)]">
                <img
                    src="/tasks.jpg"
                    alt="Browse creative tasks"
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/1200x320/1a202c/ffffff?text=Explore+Tasks'; }}
                />
                <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-white p-4">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">Find Your Next Gig</h1>
                    <p className="text-lg md:text-xl mt-2 font-light">Explore thousands of opportunities tailored for you.</p>
                </div>
            </div>

            <div className="w-[92%] max-w-7xl mx-auto py-12 px-4">
                {/* Header and Sort Button */}
                <div className="flex justify-between items-center mb-10 flex-wrap gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-[color:var(--color-txt)]">
                            All Open Tasks
                        </h2>
                        {user?.email && bidCount !== null && (
                            <p className="text-lg font-medium text-[color:var(--color-sry)] mt-1">
                                Your Bid Opportunities: {bidCount}
                            </p>
                        )}
                    </div>

                    {/* 2. Beautiful Sort Button */}
                    <button
                        onClick={handleSort}
                        className="flex items-center justify-center px-5 py-2 bg-[color:var(--color-accent)] text-white font-semibold rounded-full shadow-lg hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50 transition-all duration-300 transform hover:scale-105"
                    >
                        Sort by Budget
                        <SortIcon />
                    </button>
                </div>

                {/* 3. Redesigned Task Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {tasks.map((task) => {
                        const expired = isExpired(task.deadline);
                        return (
                            <div
                                key={task._id}
                                className={`
                                    bg-[color:var(--color-bgc)] rounded-2xl shadow-lg overflow-hidden flex flex-col group
                                    transition-all duration-300 hover:shadow-2xl hover:-translate-y-2
                                    ${expired ? 'filter grayscale opacity-70' : ''}
                                `}
                            >
                                <div className="p-6 flex-grow flex flex-col">
                                    <div className="flex-grow">
                                        <p className="text-sm font-semibold text-emerald-500 mb-2">{task.category}</p>
                                        <h3 className="text-xl font-bold text-[color:var(--color-txt)] mb-4 h-14">
                                            {task.title}
                                        </h3>

                                        <div className="flex items-center text-[color:var(--color-sry)] mb-2">
                                            <FaDollarSign className="mr-2 text-emerald-500" />
                                            <span className="font-bold text-lg">${task.budget}</span>
                                        </div>

                                        <div className="flex items-center text-[color:var(--color-sry)] mb-4">
                                            <FaCalendarAlt className="mr-2 text-red-500" />
                                            <span>Deadline: {new Date(task.deadline).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    <div className="mt-auto pt-4">
                                        {expired ? (
                                            <div className="w-full text-center bg-red-500 text-white font-bold py-3 rounded-lg">
                                                Expired
                                            </div>
                                        ) : (
                                            <Link
                                                to={`/browse/${task._id}`}
                                                className="block w-full text-center bg-[color:var(--color-accent)] text-white font-semibold py-3 px-4 rounded-lg
                                                         group-hover:bg-emerald-600 transition-colors duration-300"
                                            >
                                                View & Bid
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default BrowseTasks;
