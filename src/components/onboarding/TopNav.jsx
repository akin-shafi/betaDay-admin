/* eslint-disable react/prop-types */
import { useSession } from "../../hooks/useSession"; // Access AuthContext
import { useNavigate } from "react-router-dom";
import { OpenSideNav } from "../Icon";
import AvatarImage from "@/assets/images/default_user.png";

export default function OnboardingTopNav({ onMenuClick }) {
  const { session, logout } = useSession();
  const navigate = useNavigate();

  const profilePicture = session?.user?.profilePicture; // Uncommented this line

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav
      className={`bg-white shadow-md shadow text-black p-4 flex justify-between items-center h-[8vh] fixed top-0 right-0 z-50 md:w-3/4 w-screen px-4`}
    >
      <button onClick={onMenuClick} className="md:hidden p-2">
        <OpenSideNav />
      </button>
      <div className="w-1/2 h-[40px]  rounded-[10px] flex items-center gap-2 px-[12px]"></div>

      <div className="flex items-center gap-4">
        <div className="w-[25px] h-[25px] relative"></div>

        <div className="w-[40px] h-[40px] rounded-full">
          <img
            src={
              profilePicture && profilePicture !== "null"
                ? profilePicture
                : AvatarImage
            }
            alt="User avatar"
            className="w-full h-full rounded-full"
          />
        </div>
        <button
          onClick={handleLogout}
          className="bg-orange-600 hover:bg-red-600 text-white py-1 px-4 rounded focus:outline-none focus:ring-2 focus:ring-red-400 transition-all duration-300"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
