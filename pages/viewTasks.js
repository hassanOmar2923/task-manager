'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { format } from 'date-fns';
import { FaTable, FaThList, FaFilter, FaFilePdf, FaSearch } from 'react-icons/fa';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function UserTasks() {
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState(''); // State for phone input
  const [userData, setUserData] = useState(null); // Store user data after search
  const [viewMode, setViewMode] = useState('card'); // Default to card view
  const [filterVisible, setFilterVisible] = useState(false);
  const [dateRange, setDateRange] = useState({
    from: '',
    to: '',
  });

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/viewTasks?phone=${phone}`);
      const data = await response.json();
      if (data) {
        setUserData(data.user);
        setTasks(data.task || []); // Assuming the user data includes tasks
      } else {
        alert('No user found with this phone number.');
      }
    } catch (error) {
      console.error('Failed to fetch user data', error);
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    setPhone(e.target.value);
  };

  const updateTaskStatus = async (taskId, currentStatus) => {
    const newStatus = currentStatus === 'pending' ? 'submitted' : 'pending';

    try {
      const response = await fetch(`/api/viewTasks?userId=${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus,submittedAt:new Date() }),
      });

      if (response.ok) {
        const updatedTasks = tasks.map(task =>
          task.id === taskId ? { ...task, status: newStatus } : task
        );
        setTasks(updatedTasks);
      } else {
        alert('Failed to update task status.');
      }
    } catch (error) {
      console.error('Error updating task status', error);
    }
  };

  const generatePDFReport = () => {
    const doc = new jsPDF();
    doc.text('User Tasks Report', 14, 22);

    const tableData = tasks.map(task => [
      task.title,
      task.description,
      format(new Date(task.startsAt), 'MM/dd/yyyy'),
      format(new Date(task.deadline), 'MM/dd/yyyy'),
      task.status,
      `${Math.ceil((new Date(task.deadline) - new Date()) / (1000 * 60 * 60 * 24))} days left`,
    ]);

    doc.autoTable({
      head: [['Title', 'Description', 'Starts At', 'Deadline', 'Status', 'R.Time']],
      body: tableData,
    });

    doc.save('user-tasks-report.pdf');
  };

  return (
    <div className="max-w-4xl mx-auto mt-12 p-6 bg-gray-100 shadow-lg rounded-lg">
      {/* Phone input and search button */}
      {!userData && (
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-2">Search User by Phone</h2>
          <div className="flex space-x-4">
            <input
              type="text"
              value={phone}
              onChange={handleInputChange}
              placeholder="Enter phone number"
              className="p-2 border border-gray-300 rounded-md"
            />
            <button
              onClick={handleSearch}
              className="p-2 bg-blue-500 text-white rounded-md"
              disabled={loading}
            >
              <FaSearch /> {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>
      )}

      {/* Show the rest of the components if user data is fetched */}
      {userData && (
        <>
          <div className="bg-white p-4 rounded-lg shadow-md mt-6">
            <h2 className="text-xl font-bold mb-2">User Details</h2>
            <div className="text-gray-700">
              <p><strong>Name:</strong> {userData.name}</p>
              <p><strong>Phone:</strong> {userData.phone}</p>
            </div>
          </div>

          {/* Task List & View Mode Toggle */}
          <div className="mt-8 flex justify-between items-center">
            <h3 className="text-xl font-semibold">Tasks for {userData.name}</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setFilterVisible(!filterVisible)}
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
                onClick={() => setViewMode(viewMode === 'card' ? 'table' : 'card')}
                className="p-2 bg-blue-500 text-white rounded-md"
              >
                {viewMode === 'card' ? <FaTable /> : <FaThList />}
              </button>
            </div>
          </div>

          {/* Filter tasks by date range */}
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
                    onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">To</label>
                  <input
                    type="date"
                    name="to"
                    value={dateRange.to}
                    onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="p-2 bg-green-500 text-white rounded-md"
                >
                  <FaSearch /> Filter
                </button>
              </div>
            </div>
          )}

          {/* Display tasks */}
          {tasks.length === 0 ? (
            <p>No tasks found</p>
          ) : viewMode === 'card' ? (
            <div className="grid grid-cols-1 gap-4 mt-4">
              {tasks.map((task) => (
                <div key={task.id} className="bg-white p-4 rounded-lg shadow-md">
                  <h4 className="text-lg font-semibold">{task.title}</h4>
                  <p className="mt-2">{task.description}</p>
                  <p className="mt-2 text-sm text-gray-600">Starts At: {format(new Date(task.startsAt), 'MM/dd/yyyy')}</p>
                  <p className="mt-2 text-sm text-gray-600">Deadline: {format(new Date(task.deadline), 'MM/dd/yyyy')}</p>
                  <p className="mt-2 text-sm text-gray-600">Status: {task.status}</p>
                  <button
                    className={`p-2 rounded-md mt-2 ${
                      task.status === 'pending' ? 'bg-yellow-500' : 'bg-green-500'
                    } text-white`}
                    onClick={() => updateTaskStatus(task.id, task.status)}
                  >
                    {task.status === 'pending' ? 'Mark as Submitted' : 'Mark as Pending'}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full bg-white border border-gray-300 rounded-lg">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="p-2 border-b">Title</th>
                    <th className="p-2 border-b">Description</th>
                    <th className="p-2 border-b">Starts At</th>
                    <th className="p-2 border-b">Deadline</th>
                    <th className="p-2 border-b">Status</th>
                    <th className="p-2 border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => (
                    <tr key={task.id}>
                      <td className="p-2 border-b">{task.title}</td>
                      <td className="p-2 border-b">{task.description}</td>
                      <td className="p-2 border-b">{format(new Date(task.startsAt), 'MM/dd/yyyy')}</td>
                      <td className="p-2 border-b">{format(new Date(task.deadline), 'MM/dd/yyyy')}</td>
                      <td className="p-2 border-b">{task.status}</td>
                      <td className="p-2 border-b">
                        <button
                          className={`p-2 rounded-md ${
                            task.status === 'pending' ? 'bg-yellow-500' : 'bg-green-500'
                          } text-white`}
                          onClick={() => updateTaskStatus(task.id, task.status)}
                        >
                          {task.status === 'pending' ? 'Mark as Submitted' : 'Mark as Pending'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
