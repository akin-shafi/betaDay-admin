/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";
import { useSession } from "@/hooks/useSession";
import UploadBtn from "@/components/custom/buttons/UploadBtn";
import AvatarImage from "@/assets/images/default_user.png";
import VerifiedTick from "@/assets/images/verified_tick.svg";

import { Spin } from "antd";
const PersonalDetails = ({ onChange }) => {
  const { session } = useSession();
  const token = session?.token;
  const userId = session?.user?.userId;

  const [isLoading, setIsLoading] = useState(true);
  const [localFormData, setLocalFormData] = useState({});
  const [hasFetchedData, setHasFetchedData] = useState(false);
  const [profilePic, setProfilePic] = useState("");
  const fileRef = useRef(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Use Vite environment variable

  useEffect(() => {
    const fetchApplicantData = async () => {
      if (!token || !userId || hasFetchedData) return;

      try {
        const response = await fetch(`${API_BASE_URL}/auth/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Failed to fetch applicant data."
          );
        }

        const data = await response.json();
        setLocalFormData(data);
        setProfilePic(data.profilePhoto || "");
        setHasFetchedData(true);
        onChange(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching applicant data:", error);
        setIsLoading(false);
      }
    };

    fetchApplicantData();
  }, [token, userId, hasFetchedData, onChange, API_BASE_URL]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePic(URL.createObjectURL(file));
      setLocalFormData((prevState) => ({ ...prevState, profilePhoto: file }));
      onChange(localFormData);
    }
  };

  return (
    <>
      <Spin spinning={isLoading}>
        <content className="text-[14px]">
          <div className="w-full flex items-center gap-3">
            <input
              type="file"
              hidden
              ref={fileRef}
              onChange={handleFileChange}
              accept="image/*"
            />
            <div className="relative w-[60px] h-[60px] rounded-full">
              <img
                src={profilePic || AvatarImage}
                alt="user"
                className="rounded-full object-cover"
              />
              <img
                src={VerifiedTick}
                alt="verified tick"
                width={19}
                height={19}
                className="absolute bottom-0 right-0"
              />
            </div>
            <div>
              <UploadBtn
                text="Upload"
                onClick={() => fileRef.current.click()}
              />
              <p className=" font-azoSansRegular">
                Current Photo: A recent, passport-style headshot or
                professional-quality selfie.
              </p>
            </div>
          </div>
        </content>
      </Spin>
    </>
  );
};

export default PersonalDetails;
