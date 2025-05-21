import { useEffect, useState, useContext, useCallback } from "react";
import Swal from "sweetalert2";
import Modal from "react-modal";
import AuthContext from "../provider/AuthProvider";
import Loading from "../components/Loading";
import 'sweetalert2/src/sweetalert2.scss';

Modal.setAppElement('#root');

const MyTasks = () => {
    const { user, loading } = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        category: "",
        budget: "",
        deadline: "",
    });

    const fetchTasks = useCallback(async () => {
        if (!user?.email) return;
        try {
            const res = await fetch(`https://giggy-server.vercel.app/tasks?email=${user.email}`);
            const data = await res.json();
            setTasks(data);
        } catch (err) {
            console.error("Failed to load tasks", err);
        }
    }, [user?.email]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    if (loading) return <Loading />;

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This task will be deleted permanently!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        });

        if (result.isConfirmed) {
            try {
                const res = await fetch(`https://giggy-server.vercel.app/tasks/${id}`, {
                    method: "DELETE",
                });

                if (res.ok) {
                    Swal.fire("Deleted!", "Your task has been deleted.", "success");
                    fetchTasks();
                } else {
                    Swal.fire("Error", "Failed to delete task.", "error");
                }
            } catch (err) {
                Swal.fire("Error", "Failed to delete task.", "error");
            }
        }
    };

    const handleUpdateClick = (task) => {
        setSelectedTask(task);
        setFormData({
            title: task.title,
            category: task.category,
            budget: task.budget,
            deadline: task.deadline,
        });
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedTask(null);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(`https://giggy-server.vercel.app/tasks/${selectedTask._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                Swal.fire("Updated!", "Task updated successfully.", "success");
                fetchTasks();
                handleModalClose();
            } else {
                Swal.fire("Error", "Failed to update task.", "error");
            }
        } catch (err) {
            Swal.fire("Error", "Something went wrong.", "error");
        }
    };

    const handleViewBids = (bids) => {
        const emails = bids?.length
            ? bids.join("<br/>")
            : "No one has bid on this task yet.";

        Swal.fire({
            title: "Bids",
            html: emails,
            icon: "info",
        });
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-700">
                My Posted Tasks
            </h2>

            {tasks.length === 0 ? (
                <p className="text-center text-gray-500">No tasks posted yet.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="table w-full border border-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-3 px-4 text-left text-gray-700">Title</th>
                                <th className="py-3 px-4 text-left text-gray-700">Category</th>
                                <th className="py-3 px-4 text-left text-gray-700">Budget ($)</th>
                                <th className="py-3 px-4 text-left text-gray-700">Deadline</th>
                                <th className="py-3 px-4 text-center text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.map((task) => (
                                <tr key={task._id} className="border-t border-gray-200">
                                    <td className="py-3 px-4">{task.title}</td>
                                    <td className="py-3 px-4">{task.category}</td>
                                    <td className="py-3 px-4">{task.budget}</td>
                                    <td className="py-3 px-4">{task.deadline}</td>
                                    <td className="py-3 px-4 text-center space-x-2">
                                        <button
                                            onClick={() => handleUpdateClick(task)}
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                                        >
                                            Update
                                        </button>
                                        <button
                                            onClick={() => handleDelete(task._id)}
                                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                                        >
                                            Delete
                                        </button>
                                        <button
                                            onClick={() => handleViewBids(task.bids)}
                                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                                        >
                                            Bids
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onRequestClose={handleModalClose}
                contentLabel="Update Task"
                className="bg-white p-6 max-w-lg mx-auto mt-20 rounded-lg shadow-xl"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            >
                <h2 className="text-xl font-semibold mb-4">Update Task</h2>
                <form onSubmit={handleUpdateSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="title"
                        placeholder="Title"
                        value={formData.title}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 border rounded"
                        required
                    />
                    <input
                        type="text"
                        name="category"
                        placeholder="Category"
                        value={formData.category}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 border rounded"
                        required
                    />
                    <input
                        type="number"
                        name="budget"
                        placeholder="Budget"
                        value={formData.budget}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 border rounded"
                        required
                    />
                    <input
                        type="date"
                        name="deadline"
                        value={formData.deadline}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 border rounded"
                        required
                    />
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={handleModalClose}
                            className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default MyTasks;
