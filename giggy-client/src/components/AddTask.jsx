import React, { useState } from 'react';
import Swal from 'sweetalert2';

const AddTask = ({ user }) => {
    const [formData, setFormData] = useState({
        title: '',
        category: 'Web Development',
        description: '',
        deadline: '',
        budget: '',
        email: user?.email || '',
        userName: user?.name || '',
    });

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch('https://giggy-server.vercel.app/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const result = await res.json();

            if (result.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Task Added',
                    text: 'Your task has been added successfully!',
                    confirmButtonColor: '#10b981',
                });
                setFormData({
                    title: '',
                    category: 'Web Development',
                    description: '',
                    deadline: '',
                    budget: '',
                    email: user?.email || '',
                    userName: user?.name || '',
                });
            } else {
                throw new Error(result.error || 'Failed to add task');
            }
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.message,
                confirmButtonColor: '#ef4444',
            });
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-xl my-10 mx-auto p-8 rounded-2xl shadow-lg bg-white dark:bg-[color:var(--color-bgc)] transition-all space-y-6"
        >
            <h2 className="text-2xl font-bold text-center text-[color:var(--color-primary)] dark:text-[color:var(--color-info)]">
                🚀 Add New Task
            </h2>

            <div className="flex flex-col space-y-4">
                <input
                    name="title"
                    type="text"
                    required
                    placeholder="e.g. Build a React Portfolio Website"
                    value={formData.title}
                    onChange={handleChange}
                    className="input-style"
                />

                <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="input-style"
                >
                    <option>Web Development</option>
                    <option>Design</option>
                    <option>Writing</option>
                    <option>Marketing</option>
                    <option>Other</option>
                </select>

                <textarea
                    name="description"
                    required
                    placeholder="e.g. Create a responsive React site with animations and contact form"
                    value={formData.description}
                    onChange={handleChange}
                    className="input-style h-24 resize-none"
                />
                <input
                    name="deadline"
                    type="date"
                    required
                    value={formData.deadline}
                    onChange={handleChange}
                    className="input-style text-black dark:text-white bg-white dark:bg-gray-900 
               [&::-webkit-calendar-picker-indicator]:filter-white 
               [&::-webkit-calendar-picker-indicator]:invert 
               [&::-webkit-calendar-picker-indicator]:brightness-0"
                />




                <input
                    name="budget"
                    type="number"
                    required
                    placeholder="e.g. 500"
                    value={formData.budget}
                    onChange={handleChange}
                    className="input-style"
                />

                <input
                    name="email"
                    type="email"
                    required
                    placeholder="e.g. john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="input-style"
                />

                <input
                    name="userName"
                    type="text"
                    required
                    placeholder="e.g. John Cena"
                    value={formData.userName}
                    onChange={handleChange}
                    className="input-style"
                />
            </div>

            <button
                type="submit"
                className="w-full bg-white hover:bg-gray-100 text-[color:var(--color-primary)] border border-[color:var(--color-primary)] font-bold py-2 rounded-xl transition"
            >
                ➕ Add Task
            </button>
        </form>
    );
};

export default AddTask;
