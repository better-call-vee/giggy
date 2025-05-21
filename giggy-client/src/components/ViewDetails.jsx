import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import AuthContext from "../provider/AuthContext";
import Loading from "./Loading";

const ViewDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { user } = useContext(AuthContext); // ✅ Correctly use AuthContext

    useEffect(() => {
        fetch(`https://giggy-server.vercel.app/tasks/${id}`)
            .then((res) => {
                if (!res.ok) throw new Error("Task not found");
                return res.json();
            })
            .then((data) => {
                setTask(data);
                setError("");
            })
            .catch((err) => {
                setError(err.message);
                setTask(null);
            })
            .finally(() => setLoading(false));
    }, [id]);

    const handleBid = () => {
        if (!user?.email) {
            return Swal.fire("Unauthorized", "Please log in to bid.", "warning");
        }

        // ✅ Frontend check for duplicate bid
        if (task?.bids?.includes(user.email)) {
            return Swal.fire("Already Bid", "You have already placed a bid on this task.", "info");
        }

        Swal.fire({
            title: "Confirm Bid",
            text: "Do you want to bid on this task?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#10B981",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, bid it!"
        }).then((result) => {
            if (result.isConfirmed) {
                fetch("https://giggy-server.vercel.app/bids", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ taskId: id, email: user.email })
                })
                    .then((res) => res.json())
                    .then((data) => {
                        if (data.success) {
                            Swal.fire("Success!", data.message, "success");
                            // ✅ Update local state to reflect the new bid
                            setTask((prev) => ({
                                ...prev,
                                bids: [...(prev?.bids || []), user.email]
                            }));
                        } else {
                            Swal.fire("Oops!", data.message, "warning");
                        }
                    })
                    .catch(() => {
                        Swal.fire("Error", "Failed to bid. Try again.", "error");
                    });
            }
        });
    };

    if (loading) {
        return <Loading />
    }

    if (error || !task) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[color:var(--color-bgc)] text-[color:var(--color-error)]">
                <p className="text-2xl font-semibold">Task Not Found</p>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-4 bg-[color:var(--color-primary)] text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[color:var(--color-bbgc)] py-12 px-4">
            <div className="max-w-3xl mx-auto bg-[color:var(--color-bgc)] border border-slate-300 dark:border-slate-700 rounded-2xl shadow-xl p-8 transition-all duration-300">
                <h2 className="text-3xl font-bold text-[color:var(--color-primary)] mb-4">{task.title}</h2>
                <p className="text-lg text-[color:var(--color-txt)] mb-2">
                    <span className="font-semibold">Category:</span> {task.category}
                </p>
                <p className="text-lg text-[color:var(--color-txt)] mb-2">
                    <span className="font-semibold">Budget:</span> ${task.budget}
                </p>
                <p className="text-lg text-[color:var(--color-txt)] mb-2">
                    <span className="font-semibold">Deadline:</span>{" "}
                    {new Date(task.deadline).toLocaleDateString()}
                </p>
                <p className="mt-6 text-[color:var(--color-txt)]">
                    <span className="font-semibold block mb-1">Description:</span>
                    {task.description}
                </p>

                <div className="mt-10 flex justify-between flex-wrap gap-4">
                    <button
                        onClick={handleBid}
                        className="bg-[color:var(--color-accent)] text-white font-semibold px-5 py-2 rounded-lg hover:bg-emerald-600 transition-colors duration-300"
                    >
                        Bid
                    </button>
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-[color:var(--color-accent)] text-white font-semibold px-5 py-2 rounded-lg hover:bg-emerald-600 transition-colors duration-300"
                    >
                        Back to Tasks
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewDetails;
