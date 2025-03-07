import { FiLogOut } from "react-icons/fi";
import { useSession } from "@/hooks/useSession";

export default function UserAvatar() {
  const { session, logout } = useSession();
  // console.log("session", session.user.fullName);
  // Check if session or session.user is null or undefined
  if (!session || !session.user) {
    return null; // Or you can return a fallback UI, like a loading spinner or message
  }

  const { email, fullName } = session.user;

  const nameParts = fullName.split(" ");
  const firstName = nameParts[0];
  const lastName = nameParts[nameParts.length - 1];
  const initials = `${firstName?.charAt(0)}${lastName?.charAt(0)}`;

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="w-full h-[40px] grid md:grid-cols-[40px_1fr_30px] grid-cols-[30px_1fr_20px] items-center gap-3">
      <div className="w-[30px] md:w-[40px] h-[30px] md:h-[40px] rounded-full bg-[#FFECE5] grid place-content-center text-[14px] md:text-[16px] text-primary relative uppercase">
        {initials}
        <span className="absolute bottom-0 right-0 w-[13px] h-[13px] bg-[#04802E] border border-white rounded-full" />
      </div>
      <div>
        <div className="text-[12px] md:text-[14px] text-white">{fullName}</div>
        <div className="text-[12px] md:text-[14px] text-white">{email}</div>
      </div>
      <FiLogOut
        onClick={handleLogout}
        className="cursor-pointer text-[17px] md:text-[20px] text-white flex item-center justify-self-end"
      />
    </div>
  );
}
