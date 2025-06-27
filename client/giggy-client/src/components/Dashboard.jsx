import React, { useContext, useEffect, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import AuthContext from '../provider/AuthContext';
import Loading from './Loading';
import {
    FaBriefcase,
    FaGavel,
    FaCheckCircle,
    FaUserClock,
    FaPlus,
    FaTasks,
    FaSearch
} from 'react-icons/fa';

const API_BASE_URL = "https://giggy-server.vercel.app";

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({
        tasksCreated: 0,
        bidsPlaced: 0,
        tasksCompleted: 0,
    });
    const [recentBids, setRecentBids] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.email) {
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                const [tasksRes, allTasksRes, bidsCountRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/tasks?email=${user.email}`),
                    fetch(`${API_BASE_URL}/tasks`),
                    fetch(`${API_BASE_URL}/cbids/${user.email}`)
                ]);

                if (!tasksRes.ok || !allTasksRes.ok || !bidsCountRes.ok) {
                    throw new Error('Failed to fetch dashboard data');
                }

                const userTasks = await tasksRes.json();
                const allTasks = await allTasksRes.json();
                const bidsCountData = await bidsCountRes.json();

                setStats({
                    tasksCreated: userTasks.length,
                    bidsPlaced: bidsCountData.count || 0,
                    tasksCompleted: 0,
                });

                const userBiddedTasks = allTasks.filter(task =>
                    task.bids && task.bids.includes(user.email)
                ).sort((a, b) => new Date(b.date) - new Date(a.date)); // Assuming a date field for sorting

                setRecentBids(userBiddedTasks.slice(0, 5));

            } catch (error) {
                console.error("Dashboard fetch error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    if (loading) {
        return <Loading />;
    }

    const sidebarLinks = [
        { to: '/browse', icon: <FaSearch />, text: 'Browse Tasks' },
        { to: '/mytasks', icon: <FaTasks />, text: 'My Tasks' },
        { to: '/add', icon: <FaPlus />, text: 'Add Task' },
    ];

    const StatCard = ({ icon, title, value, color }) => (
        <div className="bg-[color:var(--color-bgc)] p-6 rounded-2xl shadow-lg flex items-center space-x-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className={`p-4 rounded-full ${color}`}>
                {icon}
            </div>
            <div>
                <p className="text-sm font-medium text-[color:var(--color-sry)]">{title}</p>
                <p className="text-2xl font-bold text-[color:var(--color-txt)]">{value}</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[color:var(--color-bg-base)] flex">
            {/* Sidebar Navigation */}
            <aside className="w-64 bg-[color:var(--color-bgc)] p-6 hidden lg:flex flex-col shadow-lg">
                <h2 className="text-2xl font-bold text-[color:var(--color-txt)] mb-8">Dashboard</h2>
                <nav className="flex flex-col space-y-2">
                    {sidebarLinks.map((link, index) => (
                        <NavLink
                            key={index}
                            to={link.to}
                            className={({ isActive }) =>
                                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 text-lg ${isActive
                                    ? 'bg-[color:var(--color-accent)] text-white shadow-md'
                                    : 'text-[color:var(--color-txt)] hover:bg-[var(--icon-hover-bg)]'
                                }`
                            }
                        >
                            {link.icon}
                            <span>{link.text}</span>
                        </NavLink>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-10 overflow-auto">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-10">
                        <h1 className="text-4xl font-bold text-[color:var(--color-txt)]">
                            Welcome back, <span className="text-[color:var(--color-accent)]">{user?.displayName || user?.email}</span>!
                        </h1>
                        <p className="text-lg text-[color:var(--color-sry)] mt-1">Here's a summary of your activity.</p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
                        <StatCard icon={<FaBriefcase size={24} className="text-white" />} title="Tasks Created" value={stats.tasksCreated} color="bg-blue-500" />
                        <StatCard icon={<FaGavel size={24} className="text-white" />} title="Bids Placed" value={stats.bidsPlaced} color="bg-green-500" />
                        <StatCard icon={<FaCheckCircle size={24} className="text-white" />} title="Tasks Completed" value={stats.tasksCompleted} color="bg-purple-500" />
                        <StatCard icon={<FaUserClock size={24} className="text-white" />} title="Member Since" value={new Date(user?.metadata?.creationTime).toLocaleDateString()} color="bg-orange-500" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        <div className="lg:col-span-2">
                            <h2 className="text-2xl font-bold text-[color:var(--color-txt)] mb-4">Your Recent Bids</h2>
                            {recentBids.length > 0 ? (
                                <div className="bg-[color:var(--color-bgc)] rounded-2xl shadow-lg overflow-hidden">
                                    <ul className="divide-y divide-[color:var(--divider-color)]">
                                        {recentBids.map(task => (
                                            <li key={task._id} className="p-4 hover:bg-[var(--icon-hover-bg)] transition-colors duration-200">
                                                <Link to={`/browse/${task._id}`} className="flex justify-between items-center">
                                                    <div>
                                                        <p className="font-semibold text-[color:var(--color-txt)]">{task.title}</p>
                                                        <p className="text-sm text-[color:var(--color-sry)]">Category: {task.category}</p>
                                                    </div>
                                                    <span className="font-bold text-lg text-[color:var(--color-accent)]">${task.budget}</span>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ) : (
                                <div className="bg-[color:var(--color-bgc)] p-8 rounded-2xl shadow-lg text-center">
                                    <p className="text-[color:var(--color-sry)]">You haven't placed any bids yet. <Link to="/browse" className="text-[color:var(--color-accent)] font-semibold">Start browsing tasks!</Link></p>
                                </div>
                            )}
                        </div>

                        <div className="lg:col-span-1">
                            <h2 className="text-2xl font-bold text-[color:var(--color-txt)] mb-4">Focus & Conquer</h2>
                            <div className="bg-[color:var(--color-bgc)] rounded-2xl shadow-lg overflow-hidden p-2">
                                <video
                                    src="/money.mp4"
                                    loop
                                    autoPlay
                                    muted
                                    playsInline
                                    className="w-full h-full object-cover rounded-xl"
                                >
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
