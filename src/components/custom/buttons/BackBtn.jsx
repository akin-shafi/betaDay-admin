import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

export default function BackBtn() {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(-1)}
      className="flex items-center gap-2 md:text-[14px] text-[12px] text-[#667185] cursor-pointer"
    >
      <div className="w-[21px] h-[21px] rounded-[4px] border border-[#E4E7EC] text-black grid place-content-center">
        <FaArrowLeftLong size={11} />
      </div>
      <span className="mt-1">Go Back</span>
    </div>
  );
}
