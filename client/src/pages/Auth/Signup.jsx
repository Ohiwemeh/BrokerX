import React from "react";
import { FaGoogle, FaApple } from "react-icons/fa";
import Dashboard from "../Dashboard";
import { useNavigation } from "react-router";
import { Link } from "react-router";

const Signup = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-white">
      {/* Top bar */}
      <header className="flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-white"></div>
          </div>
        </div>

        {/* Sign in link */}
        <a
          href="/login"
          className="text-blue-600 font-medium text-sm hover:underline"
        >
          Sign in
        </a>
      </header>

      {/* Main form container */}
      <main className="flex flex-col items-center justify-center flex-grow px-4">
        <div className="w-full max-w-md bg-white shadow-sm border rounded-2xl p-8">
          <h1 className="text-2xl font-semibold mb-2">
            Create your account
          </h1>
          <p className="text-gray-600 text-sm mb-6">
            Access all that BrokerX has to offer with a single account.
          </p>

          {/* Email field */}
          <div className="mb-4">
            <label
              htmlFor="Name"
              className="block text-sm font-semibold mb-1"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="Your email address"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-semibold mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Your email address"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-semibold mb-1"
            >
              phone Number
            </label>
            <input
              type="number"
              id="phone number"
              placeholder="Your email address"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="Password"
              className="block text-sm font-semibold mb-1"
            >
              Password
            </label>
            <input
              type="email"
              id="email"
              placeholder="Your email address"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="Comfirm Password"
              className="block text-sm font-semibold mb-1"
            >
              Comfirm password
            </label>
            <input
              type="Password"
              id="comfirm password"
              placeholder="Your email address"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Continue button */}
        <Link
    to="/dashboard"
    className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg py-2 text-center transition"
  >
    Continue
  </Link>


          {/* Divider */}
          {/* <div className="flex items-center my-4">
            <hr className="flex-grow border-gray-300" />
            <span className="px-2 text-gray-500 text-sm">OR</span>
            <hr className="flex-grow border-gray-300" />
          </div> */}

          {/* Google signup */}
          {/* <button className="w-full border rounded-lg py-2 flex items-center justify-center space-x-2 hover:bg-gray-50 transition">
            <FaGoogle className="text-lg" />
            <span className="font-medium text-sm">Sign up with Google</span>
          </button> */}

          {/* Apple signup */}
          {/* <button className="w-full border rounded-lg py-2 flex items-center justify-center space-x-2 hover:bg-gray-50 mt-3 transition">
            <FaApple className="text-lg" />
            <span className="font-medium text-sm">Sign up with Apple</span>
          </button> */}

          {/* Footer note */}
          <p className="text-xs text-gray-500 mt-4 text-center">
            By creating an account you certify that you are over the age of 18
            and agree to the{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Financial Privacy Notice
            </a>
            .
          </p>
        </div>
      </main>
    </div>
  );
};

export default Signup;
