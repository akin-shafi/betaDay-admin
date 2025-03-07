/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from "react";
import { useSession } from "@/hooks/useSession";
import { UserModal } from "@/components/modals/UserModal"; // Import the modal component

export function AdminPage() {
  const { session } = useSession();
  const fullname = session?.user?.fullname;
  // const role = session?.user?.role;
  // const onboardingStep = session?.user?.onboardingStep;

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Open the modal
  const openModal = () => setIsModalOpen(true);

  // Close the modal
  const closeModal = () => setIsModalOpen(false);

  // Handle the form submission from the modal
  const handleInviteSubmit = (values) => {
    console.log("Inviting member with values: ", values);
    // Perform the invite member logic here (e.g., API call)
  };

  const stats = [
    { title: "Institutions", path: "/all-institutions", detail: "0" },
    { title: "Equipment Registered", path: "/all-equipments", detail: "0" },
    { title: "Site Photos", path: "/assets", detail: "0" },
  ];

  // Check conditions to open the modal (if role is assessor and onboardingStep < 3)
  // useEffect(() => {
  //   if (role === "assessor" && onboardingStep < 3) {
  //     openModal();
  //   }
  // }, [role, onboardingStep]); // Dependencies to check role and onboardingStep changes

  return (
    <div className="">
      <div className="w-full h-[8%] flex justify-between md:gap-0 gap-4 mt-1">
        <div>
          <h5 className="md:text-[20px] text-[16px] font-medium text-black">
            Dashboard
          </h5>
          <p className="text-[#667085] md:text-[14px] text-[12px] font-normal">
            Welcome {fullname}
          </p>
        </div>
      </div>

      <div className="w-full h-[170px] rounded-[12px] bg-olive flex items-center justify-between p-4">
        <div className="md:basis-[50%] basis-full text-secondary h-full flex flex-col justify-center gap-2">
          <h6 className="text-[10px] font-bold">OVERVIEW</h6>
          <h2 className="md:text-[20px] text-[16px] font-bold">
            Welcome to your Dashboard!
          </h2>
          <p className="md:text-[14px] text-[12px] font-light">
            Click on any metrics below to get started or update your profile
          </p>
        </div>
        <div className="md:basis-[30%] basis-0 md:flex w-full h-full items-center justify-center">
          <button
            onClick={openModal}
            className="py-[10px] px-[20px] bg-appGreen rounded-[100px] text-white"
          >
            Invite Member
          </button>
        </div>
      </div>

      <div>
        <h5 className="md:text-[24px] text-[18px] text-black font-medium">
          Statistics
        </h5>

        <div className="w-full grid md:grid-cols-4 grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <StatisticsCard
              key={index}
              onClick={() => handleNavigate(stat.path)} // Dynamic path based on stats array
              detail={stat.detail}
              title={stat.title}
            />
          ))}
        </div>

        {/* Invite Member Button */}
        {/* <button
            onClick={openModal}
            className="mt-4 py-2 px-4 bg-blue-500 text-white rounded-md"
          >
            Invite Member
          </button> */}
      </div>

      {/* Invite Member Modal */}
      <UserModal
        visible={isModalOpen}
        onClose={closeModal}
        onSubmit={handleInviteSubmit}
        showCloseIcon={false} // Disable the close icon
      />
    </div>
  );
}
