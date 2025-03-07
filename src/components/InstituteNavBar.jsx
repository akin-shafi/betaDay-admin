// import React from "react";
import Logo from "@/assets/Coat_of_arms_of_Nigeria.png";
import { useNavigate } from "react-router-dom";
import { useSession } from "../hooks/useSession";

export default function InstituteNavBar() {
  const { logout } = useSession();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <>
      <nav className="shadow-md z-50 fixed w-full bg-green-500 p-4 flex justify-between items-center">
        <div className=" flex justify-center items-center">
          <img src={Logo} alt="logo" width={40} height={40} />
          <h1 className="text-1xl text-white font-bold">
            Research Equipment Database
          </h1>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
        >
          Logout
        </button>
      </nav>
    </>
  );
}
