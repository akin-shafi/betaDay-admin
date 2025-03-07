import { useNavigate, useParams } from "react-router-dom";
import { useSession } from "../../hooks/useSession";
import SideNav from "./SideNav";
import { CircleSpinnerOverlay } from "react-spinner-overlay";
import { ApproveIcon } from "./components/Icon";
import { ArrowLeft } from "lucide-react";
import { Button } from "./components/ui/button";
import { GeneralInformation } from "./components/OnboardingContent/GeneralInformation";
import DashboardLayout from "./components/DashboardLayout";
import {
  useUserProfile,
  useContactDetails,
  usePersonalDetails,
} from "./hooks/useUserProfile";
import { useResendInvite } from "./hooks/useUserProfile";
import { toast } from "react-toastify";
import { useState } from "react";

// Confirmation Modal Component (confirming resending invite)
const ConfirmationModal = ({ isProcessing, onConfirm, onCancel }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
      <h3 className="text-lg font-semibold mb-4">
        Are you sure you want to resend the invite?
      </h3>
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <button
          type="button"
          className={`w-full h-[44px] mt-6 flex items-center justify-center gap-2 transition duration-500 text-white border border-[#667080] rounded-[100px] md:text-[16px] text-[13px] font-semibold px-[12px] disabled:bg-[#D0D5DD] disabled:text-white disabled:cursor-not-allowed disabled:border-none click_btn ${
            isProcessing ? "bg-gray-400" : "bg-appGreen hover:bg-teal-700"
          }`}
          onClick={onConfirm}
          disabled={isProcessing}
        >
          {isProcessing ? "Sending..." : " Yes, Resend"}
        </button>
      </div>
    </div>
  </div>
);

// Modal Component for Displaying Image
const ImageModal = ({ isOpen, imageUrl, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-sm w-full">
        <h3 className="text-lg font-semibold mb-4 text-center">
          Profile Picture
        </h3>
        <div className="flex justify-center items-center mb-4">
          <img
            src={imageUrl}
            alt="Profile"
            className="max-h-60 w-auto object-contain rounded-lg"
          />
        </div>
        <div className="flex justify-end gap-4">
          <button
            type="button"
            className="w-full h-[44px] flex items-center justify-center gap-2 transition duration-500 text-white border border-[#667080] rounded-[100px] md:text-[16px] text-[13px] font-semibold px-[12px] bg-gray-400 hover:bg-gray-600"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default function UserDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams(); // Using React Router's useParams for dynamic routing
  const { session } = useSession();
  const token = session?.token;
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    userData,
    loading: profileLoading,
    error: profileError,
  } = useUserProfile(id, token);
  const {
    contactData,
    loading: contactLoading,
    error: contactError,
  } = useContactDetails(userData?.applicationNo, token);
  const {
    personalData,
    loading: personalLoading,
    error: personalError,
  } = usePersonalDetails(userData?.applicationNo, token);

  const isLoading = profileLoading || contactLoading || personalLoading;
  const isError = profileError || contactError || personalError;

  // Open and close handlers for image modal
  const openImageModal = () => setIsImageModalOpen(true);
  const closeImageModal = () => setIsImageModalOpen(false);

  // Handle resend invite
  const handleResendInvite = async () => {
    setIsProcessing(true); // Start processing
    try {
      await useResendInvite({ applicationNo: userData.applicationNo });
      toast.success("Invitation resent successfully.");
      setIsConfirmationModalOpen(false); // Close modal on success
    } catch (error) {
      toast.error("Failed to resend invite.");
    } finally {
      setIsProcessing(false); // End processing, regardless of success or failure
    }
  };

  // Open confirmation modal for resend invite
  const openConfirmationModal = () => setIsConfirmationModalOpen(true);

  // Close confirmation modal
  const closeConfirmationModal = () => setIsConfirmationModalOpen(false);

  return (
    <DashboardLayout>
      <CircleSpinnerOverlay
        loading={isLoading}
        overlayColor="rgba(0,153,255,0.2)"
      />

      {isError && (
        <p className="text-red-500 font-medium text-center">
          Error loading data:{" "}
          {profileError?.message ||
            contactError?.message ||
            personalError?.message}
        </p>
      )}

      {!isLoading && !isError && (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
          <div className="mb-6 flex items-center gap-2 text-sm text-gray-600">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
            <span>/</span>
            <span className="text-gray-400">New Candidates</span>
            <span>/</span>
            <span>{`${userData.firstName} ${userData.lastName}`}</span>
          </div>

          <div className="w-full h-[10%] flex md:flex-row flex-col mb-3 gap-3 md:items-center items-start justify-between md:mt-2 mt-1">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 overflow-hidden rounded-full bg-gray-100">
                <img
                  src={
                    personalData?.passportPhoto || "/assets/default_user.png"
                  }
                  alt="Profile"
                  className="h-full w-full object-cover cursor-pointer"
                  onClick={openImageModal} // Open the modal on click
                />
              </div>
              <div>
                <h1 className="text-xl font-bold">{`${userData.firstName} ${userData.lastName}`}</h1>
                <p className="text-sm text-gray-500">{userData.email}</p>
              </div>
            </div>

            <div className="md:w-fit w-full flex items-center md:justify-start justify-between md:gap-3 gap-2">
              {["Invitation Sent", "Onboarding not Completed"].includes(
                userData.onboardingStatus
              ) ? (
                <button
                  type="button"
                  className="flex items-center gap-2 py-2 md:px-8 px-4 rounded-full bg-[#247A84] text-white"
                  onClick={openConfirmationModal} // Trigger the confirmation modal
                >
                  Resend Invite
                </button>
              ) : (
                <button
                  type="button"
                  className="flex items-center gap-2 py-2 md:px-8 px-4 rounded-full bg-[#247A84] text-white"
                  onClick={() => {}} // Placeholder for any future action
                >
                  <ApproveIcon />
                  Approve
                </button>
              )}
              <select className="flex items-center gap-2 py-[8px] px-[10px] rounded-[100px] border border-[#CBD5E1] outline-0 bg-white md:text-[14px] text-[10px] text-primary group">
                <option value="">-- Choose how to export --</option>
                <option value="Export CSV">Export CSV</option>
                <option value="Export PDF">Export PDF</option>
              </select>
              <select className="flex items-center gap-2 py-[8px] px-[10px] rounded-[100px] border border-[#CBD5E1] outline-0 bg-white md:text-[14px] text-[10px] text-primary group">
                <option value="General Information">General Information</option>
                <option value="Contact Details">Contact Details</option>
                <option value="Work Experience">Work Experience</option>
                <option value="Next of Kin">Emergency Details</option>
                <option value="Health and Disability">
                  Health and Disability
                </option>
                <option value="Reference">Reference</option>
                <option value="Food Safety">Food Safety</option>
                <option value="Bank Details">Bank Details</option>
              </select>
            </div>
          </div>

          <div className="flex md:flex-row flex-col gap-4 w-full md:h-[70vh] h-[65vh]">
            <SideNav
              userData={userData}
              contactData={contactData}
              personalData={personalData}
            />
            <div className="applicant_side h-full md:overflow-y-scroll scroller-none">
              <GeneralInformation />
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      <ImageModal
        isOpen={isImageModalOpen}
        imageUrl={personalData?.passportPhoto || "/assets/default_user.png"}
        onClose={closeImageModal}
      />

      {/* Confirmation Modal for Resend Invite */}
      {isConfirmationModalOpen && (
        <ConfirmationModal
          isProcessing={isProcessing}
          onConfirm={handleResendInvite}
          onCancel={closeConfirmationModal}
        />
      )}
    </DashboardLayout>
  );
}



