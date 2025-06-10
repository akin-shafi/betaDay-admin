"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSession } from "../hooks/useSession";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import WhiteLogo from "../components/whiteLogo";
import { Spin } from "antd";

export function LoginPage() {
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("sakinropo@gmail.com");
  const [password, setPassword] = useState("Admin@123");
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { login } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    const storedMessage = localStorage.getItem("message");
    if (storedMessage) {
      setMessage(storedMessage);
      localStorage.removeItem("message");
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    const result = await login(email, password);
    console.log("result", result);

    setIsProcessing(false);

    if (result.success === true) {
      const { data } = result;
      const role = data.role;
      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } else {
      console.log("return", result.message);
      setMessage(result.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
          <div className="mb-8">
            <div className="w-24 h-24 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <WhiteLogo />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4 text-center">Welcome Back</h1>
          <p className="text-xl text-gray-300 text-center max-w-md">
            Access your admin dashboard and manage your platform efficiently
          </p>
          <div className="mt-12 grid grid-cols-3 gap-4 opacity-60">
            <div className="w-16 h-16 bg-white/10 rounded-lg"></div>
            <div className="w-16 h-16 bg-white/10 rounded-lg"></div>
            <div className="w-16 h-16 bg-white/10 rounded-lg"></div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-4 bg-gray-50 lg:bg-white">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-900 rounded-xl mb-4">
              <WhiteLogo />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">BetaDay</h1>
            <p className="text-gray-600 text-sm mt-1">Admin Portal</p>
          </div>

          <Spin spinning={isProcessing} size="large">
            <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 lg:shadow-none lg:bg-transparent">
              {/* Desktop Header */}
              <div className="hidden lg:block text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Sign In
                </h2>
                <p className="text-gray-600">
                  Welcome back! Please sign in to your account
                </p>
              </div>

              {/* Mobile Header */}
              <div className="lg:hidden text-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  Sign In
                </h2>
                <p className="text-gray-600 text-sm">
                  Enter your credentials to continue
                </p>
              </div>

              {/* Error Message */}
              {message && (
                <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm font-medium text-center">
                    {message}
                  </p>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-6">
                {/* Email Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder:text-gray-400"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="w-full h-12 px-4 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder:text-gray-400"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showPassword ? (
                        <EyeInvisibleOutlined className="text-lg" />
                      ) : (
                        <EyeOutlined className="text-lg" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Forgot Password Link */}
                <div className="text-right">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-orange-600 hover:text-orange-700 font-medium transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full h-12 bg-gray-900 hover:bg-orange-600 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Signing In...
                    </span>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>

              {/* Additional Links */}
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-600">
                  Need help?{" "}
                  <Link
                    to="/support"
                    className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
                  >
                    Contact Support
                  </Link>
                </p>
              </div>
            </div>
          </Spin>
        </div>
      </div>
    </div>
  );
}
