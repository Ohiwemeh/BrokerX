import React from "react";

const Login = () => {
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

        {/* Sign up link */}
        <a
          href="/signup"
          className="text-blue-600 font-medium text-sm hover:underline"
        >
          Sign up
        </a>
      </header>

      {/* Main form container */}
      <main className="flex flex-col items-center justify-center flex-grow px-4">
        <div className="w-full max-w-md bg-white shadow-sm border rounded-2xl p-8">
          <h1 className="text-2xl font-semibold mb-2">Login to your account</h1>
          <p className="text-gray-600 text-sm mb-6">
            Access all that BrokerX has to offer with a single account.
          </p>

          {/* Email field */}
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

          {/* Password field */}
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-semibold mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Your password"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Sign In button */}
          <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg py-2 transition">
            Sign In
          </button>

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

export default Login;
