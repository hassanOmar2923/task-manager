"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { format } from "date-fns";
import { FaTable, FaThList, FaFilter, FaFilePdf } from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { FaSearch } from "react-icons/fa";
export default function UserTasks() {
  const router = useRouter();
  const { userId, name, phone } = router.query; // Extract user info from query params

  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    deadline: "",
    startsAt: "",
  });
  const [editTask, setEditTask] = useState(null); // State for editing a task
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewMode, setViewMode] = useState("card"); // Default to card view
  const [filterVisible, setFilterVisible] = useState(false);
  const [dateRange, setDateRange] = useState({
    from: "",
    to: "",
  });

  // Fetch tasks for the user with date range filter
  useEffect(() => {
    if (userId) {
      fetchTasks();
    }
  }, [userId, dateRange]);

  const fetchTasks = async () => {
    try {
      const query = new URLSearchParams();
      query.append("userId", userId);
      if (dateRange.from && dateRange.to) {
        query.append("from", dateRange.from);
        query.append("to", dateRange.to);
      }
      const response = await fetch(`/api/tasks?${query.toString()}`);
      const data = await response.json();
      setTasks(data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch tasks", error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const taskData = {
      ...newTask,
      deadline: new Date(newTask.deadline),
      startsAt: new Date(newTask.startsAt),
      userId,
    };

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      });

      if (response.ok) {
        setNewTask({ title: "", description: "", deadline: "", startsAt: "" });
        fetchTasks(); // Refresh tasks after adding
        alert("Task added successfully");
      } else {
        alert("Failed to add task");
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }

    setIsSubmitting(false);
  };

  const handleEditTask = (task) => {
    setEditTask(task); // Set task for editing
    setNewTask({
      title: task.title,
      description: task.description,
      deadline: format(new Date(task.deadline), "yyyy-MM-dd"),
      startsAt: format(new Date(task.startsAt), "yyyy-MM-dd"),
    });
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    
    const taskData = {
      ...newTask,
      deadline: new Date(newTask.deadline),
      startsAt: new Date(newTask.startsAt),
      // userId,
    };
    console.log(taskData)
    try {
      const response = await fetch(`/api/tasks?userId=${editTask.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      });

      if (response.ok) {
        setEditTask(null);
        setNewTask({ title: "", description: "", deadline: "", startsAt: "" });
        fetchTasks(); // Refresh tasks after updating
        alert("Task updated successfully");
      } else {
        alert("Failed to update task");
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }

    setIsSubmitting(false);
  };

  const handleDeleteTask = async (taskId) => {
    const confirmed = confirm("Are you sure you want to delete this task?");
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/tasks?id=${taskId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchTasks(); // Refresh tasks after deleting
        alert("Task deleted successfully");
      } else {
        alert("Failed to delete task");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const toggleViewMode = () => {
    setViewMode((prevMode) => (prevMode === "card" ? "table" : "card"));
  };

  const handleFilterToggle = () => {
    setFilterVisible(!filterVisible);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({ ...prev, [name]: value }));
  };

  const generatePDFReport = () => {
    const doc = new jsPDF();
    doc.text("User Tasks Report", 14, 22);

    const tableData = tasks.map((task) => [
      task.title,
      task.description,
      format(new Date(task.startsAt), "MM/dd/yyyy"),
      format(new Date(task.deadline), "MM/dd/yyyy"),
      task.status,
      `${Math.ceil(
        (new Date(task.deadline) - new Date()) / (1000 * 60 * 60 * 24)
      )} days left`,
    ]);

    doc.autoTable({
      head: [
        ["Title", "Description", "Starts At", "Deadline", "Status", "R.Time"],
      ],
      body: tableData,
    });

    doc.save("user-tasks-report.pdf");
  };

  return (
    <div className="max-w-4xl mx-auto mt-12 p-6 bg-gray-100 shadow-lg rounded-lg">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-2">User Details</h2>
        <div className="text-gray-700">
          <p>
            <strong>Name:</strong> {name}
          </p>
          <p>
            <strong>Phone:</strong> {phone}
          </p>
        </div>
      </div>

      <div className="mt-8 flex justify-between items-center">
        <h3 className="text-xl font-semibold">Tasks for {name}</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleFilterToggle}
            className="p-2 bg-gray-500 text-white rounded-md"
          >
            <FaFilter />
          </button>
          <button
            onClick={generatePDFReport}
            className="p-2 bg-red-500 text-white rounded-md"
          >
            <FaFilePdf />
          </button>
          <button
            onClick={toggleViewMode}
            className="p-2 bg-blue-500 text-white rounded-md"
          >
            {viewMode === "card" ? <FaTable /> : <FaThList />}
          </button>
        </div>
      </div>

      {filterVisible && (
        <div className="mt-4 bg-white p-4 rounded-lg shadow-md">
          <h4 className="text-lg font-semibold mb-2">Filter Tasks</h4>
          <div className="flex space-x-4">
            <div>
              <label className="block text-sm font-medium">From</label>
              <input
                type="date"
                name="from"
                value={dateRange.from}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">To</label>
              <input
                type="date"
                name="to"
                value={dateRange.to}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Filter</label>
              <button
                onClick={fetchTasks}
                className="p-2 bg-green-500 text-white rounded-md"
              >
                <FaSearch />
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <p>Loading tasks...</p>
      ) : viewMode === "card" ? (
        // Card View
        <div className="grid grid-cols-1 gap-4 mt-4">
          {tasks.length === 0 ? (
            <p>No tasks found</p>
          ) : (
            tasks.map((task) => (
              <div key={task.id} className="bg-white p-4 rounded-lg shadow-md">
                <h4 className="text-lg font-semibold">{task.title}</h4>
                <p className="mt-2">{task.description}</p>
                <p className="mt-2 text-sm text-gray-600">
                  Starts At: {format(new Date(task.startsAt), "MM/dd/yyyy")}
                </p>
                <p className="mt-2 text-sm text-gray-600">
                  Deadline: {format(new Date(task.deadline), "MM/dd/yyyy")}
                </p>
                <p
                  className={`mt-2 text-sm ${
                    task.status === "pending"
                      ? "text-yellow-500"
                      : "text-green-500"
                  }`}
                >
                  Status: {task.status}
                </p>
                {task.status != "submitted" && (
                  <p className="mt-2 text-sm text-gray-600">
                    R.Time:{" "}
                    {`${Math.ceil(
                      (new Date(task.deadline) - new Date()) /
                        (1000 * 60 * 60 * 24)
                    )} days left`}
                  </p>
                )}
                <button
                  onClick={() => handleEditTask(task)}
                  className="mt-2 p-2 bg-yellow-500 text-white rounded-md"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="mt-2 p-2 mx-1 bg-red-500 text-white rounded-md"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      ) : (
        // Table View
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2 border-b">Title</th>
                <th className="p-2 border-b">Description</th>
                <th className="p-2 border-b">Starts At</th>
                <th className="p-2 border-b">Deadline</th>
                <th className="p-2 border-b">Status</th>
                <th className="p-2 border-b">R.Time</th>
                <th className="p-2 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-4 text-center">
                    No tasks found
                  </td>
                </tr>
              ) : (
                tasks.map((task) => (
                  <tr key={task.id}>
                    <td className="p-2 border-b">{task.title}</td>
                    <td className="p-2 border-b">{task.description}</td>
                    <td className="p-2 border-b">
                      {format(new Date(task.startsAt), "MM/dd/yyyy HH:mm:ss")}
                    </td>
                    <td className="p-2 border-b">
                      {format(new Date(task.deadline), "MM/dd/yyyy HH:mm:ss")}
                    </td>
                    <td className="p-2 border-b">{task.status}</td>
                    <td className="p-2 border-b">{`${Math.ceil(
                      (new Date(task.deadline) - new Date()) /
                        (1000 * 60 * 60 * 24)
                    )} days left`}</td>
                    <td className="p-2 border-b">
                      <button
                        onClick={() => handleEditTask(task)}
                        className="p-1 bg-yellow-500 text-white rounded-md mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-1 bg-red-500 text-white rounded-md"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">
          {editTask ? "Edit Task" : "Add New Task"}
        </h3>
        <form
          onSubmit={editTask ? handleUpdateTask : handleAddTask}
          className="bg-white p-4 rounded-lg shadow-md"
        >
          <div className="mb-4">
            <label className="block text-sm font-medium">Title</label>
            <input
              type="text"
              name="title"
              value={newTask.title}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={newTask.description}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Deadline</label>
            <input
              type="date"
              name="deadline"
              value={newTask.deadline}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Starts At</label>
            <input
              type="date"
              name="startsAt"
              value={newTask.startsAt}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="p-2 bg-blue-500 text-white rounded-md"
          >
            {editTask ? "Update Task" : "Add Task"}
          </button>
          {editTask && (
            <button
              type="button"
              onClick={() => setEditTask(null)}
              className="ml-2 p-2 bg-gray-500 text-white rounded-md"
            >
              Cancel
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
