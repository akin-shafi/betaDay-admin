import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSession } from "../hooks/useSession";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons"; // Import Ant Design icons
// import Logo from "@/assets/images/logo-dark.png";
import WhiteLogo from "../components/whiteLogo";
import { Spin } from "antd"; // Import Spin for loading spinner

export function LoginPage() {
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("sakinropo@gmail.com");
  const [password, setPassword] = useState("Admin@123");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [isProcessing, setIsProcessing] = useState(false); // State to track processing status
  const { login } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve the message from localStorage
    const storedMessage = localStorage.getItem("message");
    if (storedMessage) {
      setMessage(storedMessage);
      localStorage.removeItem("message"); // Clear the message after showing it
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsProcessing(true); // Set processing to true when login starts

    const result = await login(email, password);
    console.log("result", result);

    setIsProcessing(false); // Set processing to false when login is done

    if (result.success === true) {
      const { data } = result; // Assuming `login` returns an object with the role
      const role = data.role;
      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard"); // Default fallback in case no specific role is found
      }
    } else {
      console.log("return", result.message);
      setMessage(result.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Spin spinning={isProcessing} size="small" className="mr-2">
        <form
          onSubmit={handleLogin}
          className="p-8 bg-white shadow-lg rounded-md w-full sm:w-96"
        >
          {/* Logo Section */}
          <div className="text-center mb-6">
            <WhiteLogo />
            <h1 className="text-1xl font-bold text-appGreen">Login</h1>
          </div>
          {message && (
            <div className="mb-4 text-red-500 text-sm font-medium text-center">
              {message}
            </div>
          )}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-appGreen border py-2 px-4 bg-white border-gray-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              required
            />
          </div>

          <div className="mb-4 relative">
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="w-full flex items-center justify-between rounded-lg border py-2 px-4 bg-white border-gray-300 md:h-10 h-9">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="outline-none border-none w-full h-full placeholder:text-gray-400 text-sm text-gray-900 focus:ring-cyan-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="text-gray-500 focus:outline-none"
              >
                {showPassword ? (
                  <EyeInvisibleOutlined className="h-5 w-5 text-gray-500" />
                ) : (
                  <EyeOutlined className="h-5 w-5 text-gray-500" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-appGreen text-white py-2 rounded-md hover:bg-appGreenLight mt-4"
            disabled={isProcessing} // Disable button during processing
          >
            {isProcessing ? "Processing" : "Login"}
          </button>
        </form>
        <div className="text-center mt-4">
          <Link
            to="/forgot-password"
            className="  cursor-pointer transition-all duration-500 text-teal-600 hover:text-secondary text-[12px] md:text-[14px]"
          >
            Forgot Password ?
          </Link>
        </div>
      </Spin>
    </div>
  );
}
