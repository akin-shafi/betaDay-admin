/* eslint-disable react/prop-types */
import StatAvatar from "@/assets/stat-avatar.svg";

export default function StatisticsCard({
  detail,
  title,
  color = "#F2FAFF",
  onClick,
}) {
  return (
    <div
      style={{ backgroundColor: color }}
      className="w-full md:h-[110px] cursor-pointer h-[100px] rounded-[8px] border border-[#F9FAFB] hover:bg-appBlue p-2 flex flex-col justify-between"
      onClick={onClick} // Attach the onClick handler here
    >
      <img
        src={StatAvatar}
        alt="statistics icon"
        className="w-[32px] h-[32px] rounded-full"
      />
      <p className="text-[12px] text-[#667085]">{title}</p>
      <h4>{detail}</h4>
    </div>
  );
}
