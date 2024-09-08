"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";



// Define the validation schema
const schema = yup.object().shape({
  name: yup.string().required("Full Name is required"),
  gender: yup.string().required("Gender is required"),
  nationality: yup.string().required("Nationality is required"),
  marital: yup.string().required("Marital Status is required"),
  countryOfBirth: yup.string().required("Country of birth is required"),
  PlaceOfBirth: yup.string().required("Place of birth is required"),
  birthdate: yup.date().required("Birthdate is required"),
  status: yup.string().required("Status is required"),
});

function Registration() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [registrations, setRegistrations] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFile2, setSelectedFile2] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewUrl2, setPreviewUrl2] = useState(null);

  useEffect(() => {
    async function fetchRegistrations() {
      try {
        const response = await axios.get("/api/registration");
        setRegistrations(response.data);
      } catch (error) {
        console.log("Error fetching registrations", error);
      }
    }
    fetchRegistrations();
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };
  const handleFileChange2 = (event) => {
    const file = event.target.files[0];
    setSelectedFile2(file);
    setPreviewUrl2(URL.createObjectURL(file));
  };

  const onSubmit = async (data) => {
    if (!selectedFile || !selectedFile2) {
      return alert("Please select a file");
    }

    try {
      const formData = new FormData();
      formData.append("fingerPrint", selectedFile);
      formData.append("image", selectedFile2);
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });

      const {data} = await axios.post("/api/registration", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(data)
  

      // Optionally, reset form or handle further actions
      // reset(); // If you want to reset the form
    } catch (error) {
      
      console.log("Error submitting form", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10">
    
      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="col-span-3">
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Full Name:
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter Full Name"
                  autoComplete="name"
                  {...register("name")}
                  className={`block px-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                    errors.name ? "border-red-500" : ""
                  }`}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
            </div>

            <div className="col-span-3">
              <label
                htmlFor="birthdate"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Birthdate
              </label>
              <div className="mt-2">
                <input
                  id="birthdate"
                  name="birthdate"
                  type="date"
                  {...register("birthdate")}
                  className={`block px-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                    errors.birthdate ? "border-red-500" : ""
                  }`}
                />
                {errors.birthdate && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.birthdate.message}
                  </p>
                )}
              </div>
            </div>

            <div className="col-span-3">
              <label
                htmlFor="gender"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Gender
              </label>
              <div className="mt-2">
                <select
                  id="gender"
                  name="gender"
                  {...register("gender")}
                  className={`block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6 ${
                    errors.gender ? "border-red-500" : ""
                  }`}
                >
                  <option value="">Choose Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                {errors.gender && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.gender.message}
                  </p>
                )}
              </div>
            </div>

            <div className="col-span-3">
              <label
                htmlFor="marital"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Marital
              </label>
              <div className="mt-2">
                <select
                  id="marital"
                  name="marital"
                  {...register("marital")}
                  className={`block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6 ${
                    errors.marital ? "border-red-500" : ""
                  }`}
                >
                  <option value="">Choose Marital</option>
                  <option value="Married">Married</option>
                  <option value="Single">Single</option>
                  <option value="Divorced">Divorced</option>
                </select>
                {errors.marital && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.marital.message}
                  </p>
                )}
              </div>
            </div>

            <div className="col-span-3">
              <label
                htmlFor="countryOfBirth"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Country Of Birth
              </label>
              <div className="mt-2">
                <input
                  id="countryOfBirth"
                  name="countryOfBirth"
                  placeholder="Enter Country Of Birth"
                  type="text"
                  {...register("countryOfBirth")}
                  className={`block px-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                    errors.countryOfBirth ? "border-red-500" : ""
                  }`}
                />
                {errors.countryOfBirth && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.countryOfBirth.message}
                  </p>
                )}
              </div>
            </div>

            <div className="col-span-3">
              <label
                htmlFor="PlaceOfBirth"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Place Of Birth
              </label>
              <div className="mt-2">
                <input
                  id="PlaceOfBirth"
                  name="PlaceOfBirth"
                  placeholder="Enter Place Of Birth"
                  type="text"
                  {...register("PlaceOfBirth")}
                  className={`block px-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                    errors.PlaceOfBirth ? "border-red-500" : ""
                  }`}
                />
                {errors.PlaceOfBirth && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.PlaceOfBirth.message}
                  </p>
                )}
              </div>
            </div>

            <div className="col-span-3">
              <label
                htmlFor="nationality"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Nationality
              </label>
              <div className="mt-2">
                <input
                  id="nationality"
                  name="nationality"
                  type="text"
                  placeholder="Enter Nationality"
                  autoComplete="nationality"
                  {...register("nationality")}
                  className={`block px-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                    errors.nationality ? "border-red-500" : ""
                  }`}
                />
                {errors.nationality && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.nationality.message}
                  </p>
                )}
              </div>
            </div>

            <div className="col-span-3">
              <label
                htmlFor="status"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Status
              </label>
              <div className="mt-2">
                <input
                  id="status"
                  name="status"
                  type="text"
                  placeholder="Enter Status"
                  {...register("status")}
                  className={`block px-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                    errors.status ? "border-red-500" : ""
                  }`}
                />
                {errors.status && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.status.message}
                  </p>
                )}
              </div>
            </div>

            <div className="col-span-3">
              <label
                htmlFor="fingerPrint"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Fingerprint:
              </label>
              <div className="mt-2">
                <input
                  type="file"
                  id="fingerPrint"
                  name="fingerPrint"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
                />
              </div>
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="mt-2 w-full h-auto max-w-xs rounded-lg shadow-md"
                />
              )}
            </div>

            <div className="col-span-3">
              <label
                htmlFor="image"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Image:
              </label>
              <div className="mt-2">
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleFileChange2}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
                />
              </div>
              {previewUrl2 && (
                <img
                  src={previewUrl2}
                  alt="Preview"
                  className="mt-2 w-full h-auto max-w-xs rounded-lg shadow-md"
                />
              )}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button
              type="button"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Registration;
