import { useState } from "react";
import { sendResetPasswordEmail } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { FiMail } from "react-icons/fi";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle password reset logic here
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
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <AuthLayout
        title="Check your email"
        subtitle="We've sent a password reset link to your email address"
      >
        <div className="text-center">
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              {`Didn't receive the email? Check your spam folder or`}{" "}
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="font-medium text-[#ff6600] hover:text-[#ff8533] transition-colors duration-200"
              >
                try again
              </button>
            </p>
          </div>
          <div className="mt-6">
            <Link
              to="/auth/login"
              className="text-sm font-medium text-[#ff6600] hover:text-[#ff8533] transition-colors duration-200"
            >
              Return to sign in
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter your email address and we'll send you a link to reset your password"
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email address
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiMail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-[#ff6600] focus:border-[#ff6600] sm:text-sm transition-colors duration-200"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#ff6600] hover:bg-[#ff8533] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff6600] disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Sending...
              </span>
            ) : (
              "Send reset link"
            )}
          </button>
        </div>

        {error && (
          <div className="text-sm text-red-600 text-center">{error}</div>
        )}
        {message && (
          <div className="text-sm text-green-600 text-center">{message}</div>
        )}

        <div className="text-center">
          <Link
            to="/auth/login"
            className="text-sm font-medium text-[#ff6600] hover:text-[#ff8533] transition-colors duration-200"
          >
            Return to sign in
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
