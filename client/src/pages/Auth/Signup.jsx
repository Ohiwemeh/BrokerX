import React, { useState } from "react";
import { FaGoogle, FaApple, FaEye, FaEyeSlash } from "react-icons/fa";
import Dashboard from "../Dashboard";
import { useNavigate } from "react-router";
import { Link } from "react-router";
import { authService } from "../../api/services";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    country: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleCountryChange = (e) => {
    setFormData({ ...formData, country: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!formData.country) {
      setError("Please select a country");
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...signupData } = formData;
      await authService.signup(signupData);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Name field */}
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-semibold mb-1"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
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
                value={formData.email}
                onChange={handleChange}
                placeholder="Your email address"
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-semibold mb-1"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Your phone number"
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="country"
                className="block text-sm font-semibold mb-1"
              >
                Country
              </label> 
              <select 
                name="country" 
                id="country" 
                value={formData.country}
                onChange={handleCountryChange}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Country</option>
                <option value="United States">United States</option>
                <option value="Canada">Canada</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Australia">Australia</option>
                <option value="Germany">Germany</option>
                <option value="France">France</option>
                <option value="India">India</option>
                <option value="Japan">Japan</option>
                <option value="China">China</option>
                <option value="Brazil">Brazil</option>
                <option value="South Africa">South Africa</option>
                <option value="Mexico">Mexico</option>
                <option value="Italy">Italy</option>
                <option value="Spain">Spain</option>
                <option value="Russia">Russia</option>
                <option value="Netherlands">Netherlands</option>
                <option value="Switzerland">Switzerland</option>
              </select>
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-semibold mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Your password"
                  className="w-full border rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <div className="mb-4">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold mb-1"
              >
                Confirm password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="w-full border rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Continue button */}
            <button
              type="submit"
              disabled={loading}
              className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg py-2 text-center transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Continue"}
            </button>
          </form>


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
