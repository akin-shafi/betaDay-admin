import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { resetPassword } from "@/hooks/useAuth"; // Adjust path as necessary
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { Input, Button } from "antd";
import WhiteLogo from "../../components/whiteLogo";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(null);
  //   const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (token) {
      setIsTokenValid(true);
    } else {
      setError("No token found.");
      setIsTokenValid(false);
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!isTokenValid) {
      setError("Invalid or missing token");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await resetPassword(token, password);
      if (response.statusCode === 200) {
        setSuccessMessage(
          "Password has been reset successfully. Redirecting to login page..."
        );
        setTimeout(() => {
          window.location.href = "/auth/login";
        }, 5000);
      } else {
        setError("Failed to reset password. Please try again.");
      }
    } catch (err) {
      setError(`${err} An error occurred while resetting the password.`);
    } finally {
      setLoading(false);
    }
  };

  //   const togglePasswordVisibility = () => {
  //     setShowPassword((prev) => !prev);
  //   };

  return (
    <div className="flex items-center justify-center min-h-screen bg-whitesmoke text-white p-4">
      <div className="bg-white text-black rounded-lg shadow-lg p-8 max-w-md w-full">
        <h4 className="text-xl font-bold mb-4 text-center uppercase">
          <div className="text-center mb-6">
            <WhiteLogo />
          </div>
        </h4>
        <div className="mb-4 text-2xl font-bold text-gray-600 text-center">
          Reset Password
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          {successMessage && (
            <p className="text-green-500 text-center mb-4">{successMessage}</p>
          )}
          <div className="mb-4">
            <Input.Password
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              visibilityToggle
              iconRender={(visible) =>
                visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
              }
            />
          </div>
          <div className="mb-4">
            <Input.Password
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              visibilityToggle
              iconRender={(visible) =>
                visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
              }
            />
          </div>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#ff6600] hover:bg-[#ff8533] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff6600] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            loading={loading}
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
        <div className="mt-4 text-center">
          <p>
            Remembered your password?{" "}
            <Link to="/auth/login" className="text-grap-900 hover:text-teal-600">
              Login
            </Link>
          </p>
          Back to{" "}
          <span>
            <Link
              to="/auth/forgot-password"
              className="text-[#ff6600] hover:text-teal-600"
            >
              Forgot Password
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
