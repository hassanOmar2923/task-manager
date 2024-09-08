'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { MdPendingActions } from "react-icons/md"
import { FaTrash } from "react-icons/fa6";
import { FaPenClip } from "react-icons/fa6";
export default function AddUser() {
  const [passNumber, setPassNumber] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(null); // To track user for update
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [open, setOpen] = useState(true);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAuthentication = () => {
    if (passNumber === 'admin123') {
      setIsAuthenticated(true);
      setOpen(false);
    } else {
      alert('Incorrect pass number');
    }
  };

  const fetchUsers = async () => {
    setLoading(true); // Start loading
    try {
      const response = await fetch('/api/adduser');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleAddUser = async () => {
    setLoading(true);
    const method = selectedUserId ? 'PUT' : 'POST';
    const endpoint = selectedUserId ? `/api/adduser?id=${selectedUserId}` : '/api/adduser';

    try {
      const response = await fetch(endpoint, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone }),
      });

      if (response.ok) {
        alert(selectedUserId ? 'User updated successfully' : 'User added successfully');
        setSelectedUserId(null); // Reset after update
        setName('');
        setPhone('');
        fetchUsers(); // Reload users after adding/updating
      } else {
        alert('Error with user operation');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    const confirmed = confirm('Are you sure you want to delete this user?');
    if (confirmed) {
      setLoading(true);
      try {
        const response = await fetch(`/api/adduser?id=${id}`, { method: 'DELETE' });
        if (response.ok) {
          alert('User deleted successfully');
          fetchUsers();
        } else {
          alert('Error deleting user');
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleUpdateClick = (user) => {
    setSelectedUserId(user.id); // Set the user ID for updating
    setName(user.name);
    setPhone(user.phone);
  };

  return (
    <div className="container mx-auto mt-36 p-4">
      <Dialog open={open} onClose={() => setOpen(false)} className="relative z-10">
        <DialogBackdrop className="fixed inset-0 bg-gray-500 bg-opacity-75" />

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-full p-4 text-center sm:items-center sm:p-0">
            <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
              <div>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                  <CheckIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <DialogTitle as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    Enter Admin Password
                  </DialogTitle>
                  <div className="mt-2">
                    <input
                      type="password"
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Admin Password"
                      value={passNumber}
                      onChange={(e) => setPassNumber(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6">
                <button
                  onClick={handleAuthentication}
                  className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                >
                  Authenticate
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>

      {isAuthenticated && (
        <div>
          <h2 className="text-2xl font-bold mb-6">{selectedUserId ? 'Update User' : 'Add New User'}</h2>

          <div className="mb-4">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full p-3 mb-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="block w-full p-3 mb-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleAddUser}
              className="w-full py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-500"
            >
              {loading ? 'Processing...' : selectedUserId ? 'Update User' : 'Add User'}
            </button>
          </div>

          <h2 className="text-2xl font-bold mb-4">Users</h2>

          {loading ? (
            <div className="flex justify-center">
              <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-indigo-500" />
            </div>
          ) : (
            <table className="min-w-full bg-white border rounded-lg shadow-sm">
              <thead>
                <tr>
                  <th className="py-3 px-4 border-b-2 border-gray-200">Name</th>
                  <th className="py-3 px-4 border-b-2 border-gray-200">Phone</th>
                  <th className="py-3 px-4 border-b-2 border-gray-200">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="py-3 px-4 border-b">{user.name}</td>
                    <td className="py-3 px-4 border-b">{user.phone}</td>
                    <td className="py-3 px-4 border-b">
                      <button
                        onClick={() => handleUpdateClick(user)}
                        className="text-blue-500 text-xl px-3 py-1 rounded-lg  mr-2"
                      >
                        <FaPenClip />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-500 text-xl px-3 py-1 mx-1 rounded-lg "
                      >
                        <FaTrash />
                      </button>
                      <Link href={`/assign/?userId=${user.id}&name=${user.name}&phone=${user.phone}`}>
                      <button
                        // onClick={() => handleDeleteUser(user.id)}
                        className="text-blue-500 text-xl  px-3 py-1 rounded-lg "
                        >
                        <MdPendingActions  />
                      </button>
                        </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
