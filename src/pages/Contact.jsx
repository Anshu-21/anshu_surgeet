import React from 'react';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

function Contact() {
  return (
    <div className="relative flex items-top justify-center min-h-screen sm:items-center sm:pt-0 bg-gradient-to-br from-gray-800 via-gray-900 to-black">
      <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 mr-2 bg-gray-700 rounded-lg shadow-lg">
            <h1 className="text-3xl sm:text-4xl text-gray-950 font-extrabold tracking-tight">
              Get in touch:
            </h1>
            <p className="text-lg sm:text-xl font-medium text-gray-950 mt-2">
              Fill in the form to start a conversation
            </p>

            <div className="mt-8">
              <div className="flex items-center mt-4 text-gray-950">
                <FaMapMarkerAlt className="text-xl text-orange-600" />
                <div className="ml-4 text-md font-semibold">
                  Acme Inc, Street, State, Postal Code
                </div>
              </div>

              <div className="flex items-center mt-4 text-gray-950">
                <FaPhoneAlt className="text-xl text-orange-600" />
                <div className="ml-4 text-md font-semibold">+44 1234567890</div>
              </div>

              <div className="flex items-center mt-4 text-gray-950">
                <FaEnvelope className="text-xl text-orange-600" />
                <div className="ml-4 text-md font-semibold">info@acme.org</div>
              </div>
            </div>
          </div>

          <div className="p-6 flex flex-col justify-center bg-gray-800 rounded-lg shadow-lg">
            <div className="flex flex-col rounded-lg bg-gray-600">
              <label htmlFor="name" className="hidden">
                Full Name
              </label>
              <input
                type="name"
                name="name"
                id="name"
                placeholder="Full Name"
                className=" py-3 px-3 rounded-lg bg-transparent bg-gray-950 text-black font-semibold"
              />
            </div>

            <div className="flex flex-col mt-2 rounded-lg bg-gray-600">
              <label htmlFor="email" className="hidden">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Email"
                className=" py-3 px-3 rounded-lg bg-transparent bg-gray-950 text-black font-semibold"
              />
            </div>

            <div className="flex flex-col mt-2 rounded-lg bg-gray-600">
              <label htmlFor="tel" className="hidden">
                Number
              </label>
              <input
                type="tel"
                name="tel"
                id="tel"
                placeholder="Telephone Number"
                className=" py-3 px-3 rounded-lg bg-transparent bg-gray-950 text-black font-semibold"
              />
            </div>

            <button
              type="submit"
              className="md:w-32 bg-orange-700 hover:bg-blue-dark text-white font-bold py-3 px-6 rounded-lg mt-3 hover:bg-orange-600 transition ease-in-out duration-300"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
