/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { FaPlusCircle, FaAsterisk } from "react-icons/fa";
import PhoneInput from "react-phone-input-2";
import { useSession } from "@/hooks/useSession";
import { CircleSpinnerOverlay } from "react-spinner-overlay";
import PrimaryInput from "@/components/Custom/Inputs/PrimaryInput";
import { RiDeleteBin5Line } from "react-icons/ri";

const TeamDetails = ({ onChange }) => {
  const { session } = useSession();
  const token = session?.token;
  const applicationNo = session?.user?.applicationNo;
  const [isMounted, setIsMounted] = useState(false);
  // const [localFormData, setLocalFormData] = useState({});
  const [hasFetchedData, setHasFetchedData] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [referenceRecords, setTeamRecords] = useState([]);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Use Vite environment variable

  useEffect(() => {
    setIsMounted(true);
    const fetchTeamData = async () => {
      if (hasFetchedData) return;

      try {
        const response = await fetch(`${API_BASE_URL}/teams/${applicationNo}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Failed to fetch team data."
          );
        }

        const data = await response.json();

        // If the fetched data is empty, start with one empty record
        const initialData = data.length
          ? data
          : [
              {
                employerName: "",
                contactName: "",
                phone: "",
                email: "",
                address: "",
                jobTitle: "",
                startDate: "",
                endDate: "",
                responsibilities: "",
              },
            ];

        setTeamRecords(initialData);
        onChange(initialData);
        setHasFetchedData(true);
      } catch (error) {
        console.error("Error fetching team data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeamData();
  }, [API_BASE_URL, applicationNo, hasFetchedData, onChange, token]);

  const handleTeamChange = (index, field, value) => {
    const updatedRecords = referenceRecords.map((record, i) =>
      i === index ? { ...record, [field]: value } : record
    );
    setTeamRecords(updatedRecords);
    onChange(updatedRecords);
  };

  const addTeamRecord = () => {
    setTeamRecords([
      ...referenceRecords,
      {
        employerName: "",
        contactName: "",
        phone: "",
        email: "",
        address: "",
      },
    ]);
  };

  const removeTeamRecord = async (index) => {
    const recordToDelete = referenceRecords[index];
    const confirmed = window.confirm(
      `Are you sure you want to delete the team for ${recordToDelete.contactName}?`
    );

    if (confirmed) {
      if (recordToDelete.id) {
        try {
          const response = await fetch(
            `${API_BASE_URL}/team/${applicationNo}/${recordToDelete.id}`,
            {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
              errorData.message || "Failed to delete team record."
            );
          }

          const updatedRecords = referenceRecords.filter((_, i) => i !== index);
          setTeamRecords(updatedRecords);
          onChange(updatedRecords);
        } catch (error) {
          console.error("Error deleting team record:", error);
          // Optionally, you can display an error message to the user
        }
      }

      // Update the local state to remove the record regardless of whether it was saved or not
      const updatedRecords = referenceRecords.filter((_, i) => i !== index);
      setTeamRecords(updatedRecords);
      onChange(updatedRecords);
    }
  };

  // if (isLoading) return <p>Loading...</p>;

  return (
    <>
      {isMounted && (
        <CircleSpinnerOverlay
          loading={isLoading}
          overlayColor="rgba(0,153,255,0.2)"
        />
      )}
      {referenceRecords.map((record, index) => (
        <div
          key={index}
          className=" p-4 mb-4 rounded w-full grid md:grid-cols-2 grid-cols-1 gap-3 mb-8 pb-6"
        >
          {/* Remove Button */}
          {referenceRecords.length > 1 && (
            <div className="flex justify-end md:col-span-2 col-span-1">
              <RiDeleteBin5Line
                className="mr-2 cursor-pointer text-appMuted transition-all duration-300 hover:text-red-500"
                onClick={() => removeTeamRecord(index)}
              />
            </div>
          )}
          <div className="w-full flex flex-col md:col-span-2 col-span-1 gap-1">
            <PrimaryInput
              id={`employer`}
              label="Employer"
              type="text"
              isRequired
              placeholder="Enter employer's name (e.g., ABC Company Limited) or 'NA' if not applicable"
              name={`employerName`}
              value={record.employerName}
              onChange={(e) =>
                handleTeamChange(index, "employerName", e.target.value)
              }
            />
          </div>

          <div className="w-full flex flex-col md:col-span-1 col-span-2 gap-1">
            <PrimaryInput
              id={`jobTitle`}
              label={`Job Title`}
              type="text"
              isRequired
              placeholder="Enter Job title or 'NA' if not applicable"
              name={`jobTitle`}
              value={record.jobTitle}
              onChange={(e) =>
                handleTeamChange(index, "jobTitle", e.target.value)
              }
            />
          </div>

          <div className="w-full flex flex-col md:col-span-1 col-span-2 gap-1">
            <PrimaryInput
              id={`contactName`}
              label="Contact Name"
              type="text"
              isRequired
              placeholder="Enter Contact Name (e.g., John Doe)"
              name={`contactName`}
              value={record.contactName}
              onChange={(e) =>
                handleTeamChange(index, "contactName", e.target.value)
              }
            />
          </div>

          <div className="w-full flex flex-col md:col-span-1 col-span-2 gap-1">
            <label className="md:text-[14px] text-[12px] text-[#344054] font-medium flex items-center gap-1">
              Phone Number{" "}
              <span className="text-red-600">
                <FaAsterisk size={6} />
              </span>
            </label>

            <PhoneInput
              country={"gb"}
              value={record.phone}
              onChange={(value) => handleTeamChange(index, "phone", value)}
              preferredCountries={["uk"]}
              buttonClass="h-full w-fit"
              enableSearch
              dropdownClass=""
              inputStyle={{
                width: "100%",
                height: "38px",
                borderRadius: "8px",
                color: "#667085",
                border: "1px solid #D0D5DD",
                fontWeight: "500",
              }}
              buttonStyle={{
                borderTopLeftRadius: "8px",
                borderBottomLeftRadius: "8px",
                border: "1px solid #D0D5DD",
              }}
              containerStyle={{
                borderRadius: "8px",
              }}
            />
          </div>

          <div className="w-full flex flex-col md:col-span-1 col-span-2 gap-1">
            <PrimaryInput
              id={`email`}
              label={`Email`}
              isRequired
              type="text"
              placeholder="Enter email (e.g., example@mail.com)"
              name={`email`}
              value={record.email}
              onChange={(e) =>
                handleTeamChange(index, "email", e.target.value)
              }
            />
          </div>

          <div className="w-full flex flex-col md:col-span-1 col-span-2 gap-1">
            <PrimaryInput
              id={`startDate`}
              label={`Start Date`}
              type="date"
              placeholder="DD/MM/YYYY"
              name={`startDate`}
              value={record.startDate}
              onChange={(e) =>
                handleTeamChange(index, "startDate", e.target.value)
              }
            />
          </div>

          <div className="w-full flex flex-col md:col-span-1 col-span-2 gap-1">
            <PrimaryInput
              id={`endDate`}
              label={`End Date`}
              type="date"
              placeholder="DD/MM/YYYY"
              name={`endDate`}
              value={record.endDate}
              onChange={(e) =>
                handleTeamChange(index, "endDate", e.target.value)
              }
            />
          </div>

          <div className="w-full flex flex-col md:col-span-2 col-span-1 gap-1">
            <PrimaryInput
              id={`address`}
              label="Address"
              type="text"
              placeholder="Enter address"
              name={`address`}
              value={record.address}
              onChange={(e) =>
                handleTeamChange(index, "address", e.target.value)
              }
            />
          </div>

          <div className="w-full flex flex-col md:col-span-2 col-span-1 gap-1">
            <PrimaryInput
              id={`responsibilities`}
              label="Responsibilities"
              type="text"
              placeholder="Enter responsibilities"
              name={`responsibilities`}
              value={record.responsibilities}
              onChange={(e) =>
                handleTeamChange(index, "responsibilities", e.target.value)
              }
            />
          </div>
        </div>
      ))}

      <div
        className="w-full flex items-center justify-end gap-2 text-appGreen cursor-pointer text-[14px]"
        onClick={addTeamRecord}
      >
        <FaPlusCircle />
        <span className="mt-1">Add Another team</span>
      </div>
    </>
  );
};

export default TeamDetails;
