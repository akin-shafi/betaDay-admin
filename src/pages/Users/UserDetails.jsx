// UserDetails.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSession } from "../../hooks/useSession";

export default function UserDetails() {
  const { session } = useSession();
  const token = session?.token;
  const { id } = useParams(); // Get the user ID from the URL
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Use Vite environment variable

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (id) {
        try {
          const response = await fetch(
            `${API_BASE_URL}/auth/users/${id}`, // Update the API URL as necessary
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.ok) {
            const userData = await response.json();
            setFirstName(userData.firstName);
            setLastName(userData.lastName);
            setEmail(userData.email);
            setRole(userData.role);
          } else {
            throw new Error("Failed to fetch user details");
          }
        } catch (error) {
          setError(error.message || "An error occurred");
        } finally {
          setLoading(false);
        }
      }
    };

    if (token && id) {
      fetchUserDetails();
    }
  }, [id, token]);

  return (
    <div className="min-h-screen flex justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">User Details</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="mb-1 font-semibold">First Name:</p>
                <p className="p-2 border border-gray-300 rounded bg-gray-100">
                  {firstName || "N/A"}
                </p>
              </div>
              <div>
                <p className="mb-1 font-semibold">Last Name:</p>
                <p className="p-2 border border-gray-300 rounded bg-gray-100">
                  {lastName || "N/A"}
                </p>
              </div>
              <div>
                <p className="mb-1 font-semibold">Email:</p>
                <p className="p-2 border border-gray-300 rounded bg-gray-100">
                  {email || "N/A"}
                </p>
              </div>
              <div>
                <p className="mb-1 font-semibold">Role:</p>
                <p className="p-2 border border-gray-300 rounded bg-gray-100">
                  {role || "N/A"}
                </p>
              </div>
            </div>
            <div className="mt-6 text-center">
              <button
                onClick={() => navigate("/all-users")} // Navigate back to user list
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
              >
                Back to Users List
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
