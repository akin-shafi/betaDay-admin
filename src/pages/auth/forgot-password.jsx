import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { sendResetPasswordEmail } from "@/hooks/useAuth"; // Adjust path as necessary
import WhiteLogo from "../../components/whiteLogo";

const ForgotPassword = () => {
  const { email: emailFromRoute } = useParams(); // Directly destructuring email from params

  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (emailFromRoute) {
      setEmail(emailFromRoute);
    }
  }, [emailFromRoute]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await sendResetPasswordEmail(email);
      if (response.statusCode === 200) {
        setMessage(
          "If an account with that email exists, a password reset link will be sent to it."
        );
        setEmail(""); // Clear the email input after successful submission
      } else {
        setError("Failed to send password reset email. Please try again.");
      }
    } catch (err) {
      setError(
        `${err} An error occurred while sending the password reset email. Please try again later.`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#032541] text-white p-4">
      <div className="bg-white text-black rounded-lg shadow-lg p-8 max-w-md w-full">
        <h4 className="text-xl font-bold mb-4 text-center">
          <div className="text-center mb-6">
            <WhiteLogo />
            <h1 className="text-1xl font-bold text-appGreen">Baseline Study</h1>
          </div>
        </h4>

        <div className="mt-3">
          <h5 className="md:text-[18px] text-[16px] text-primary font-bold text-center">
            Forgot Password
          </h5>
          <p className="md:text-[14px] text-[12px] text-[#475467] text-center">
            Kindly enter your email to proceed.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          {message && (
            <p className="text-green-500 text-center mb-4">{message}</p>
          )}
          <div className="flex flex-col">
            <label htmlFor="email" className="mb-2 text-lg">
              Email:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="p-2 border border-gray-300 rounded"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full p-2 rounded bg-teal-700 text-white hover:bg-secondary transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Sending..." : "Send Password Reset Email"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p>
            Back to{" "}
            <Link to="/login" className="text-teal-700">
              Login
            </Link>
            <span className="px-2">or</span>
            <Link to="/sign-up" className="text-secondary">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
