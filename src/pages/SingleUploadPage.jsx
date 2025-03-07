import { useState } from "react";
import { useSession } from "@/hooks/useSession";
import { CameraOutlined } from "@ant-design/icons";
export function SingleUploadPage() {
  const { session } = useSession();
  const applicationNo = session?.user?.applicationNo;

  console.log("applicationNo", applicationNo);
  // State for form fields
  const [equipmentName, setEquipmentName] = useState("");
  const [quantity, setQuanity] = useState("");
  const [description, setDescription] = useState("");
  const [taxonomy, setTaxonomy] = useState("");
  const [department, setDepartment] = useState("");
  const [image, setImage] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);

  // Handle image capture from camera
  const startCamera = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        const videoElement = document.getElementById("camera-video");
        videoElement.srcObject = stream;
        setCameraActive(true);
      })
      .catch((err) => {
        console.error("Error accessing the camera", err);
      });
  };

  const captureImage = () => {
    const videoElement = document.getElementById("camera-video");
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    setImage(canvas.toDataURL("image/png"));
    stopCamera();
  };

  const stopCamera = () => {
    const videoElement = document.getElementById("camera-video");
    const stream = videoElement.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach((track) => track.stop());
    setCameraActive(false);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Construct payload
    const payload = {
      name: equipmentName,
      quantity: quantity,
      description: description,
      department: department,
      taxonomy: taxonomy,
      image: image,
      availability: true, // Default value
      applicationNo: applicationNo, // Generate or fetch accordingly
    };

    // Send the payload to the backend
    try {
      const response = await fetch("http://localhost:8500/equipment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      // console.log("Equipment submitted successfully:", data);
    } catch (error) {
      console.error("Error submitting equipment:", error);
    }
  };

  // Handle delete image
  const deleteImage = () => {
    setImage(null);
    setCameraActive(false);
  };

  return (
    <>
      {/* Equipment Registration Form */}
      <form
        onSubmit={handleFormSubmit}
        className="w-full  bg-white p-6 rounded-lg shadow-md"
      >
        {/* Avatar Field (Camera Capture) */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">
            Equipment Image
          </label>
          <div className="mb-4">
            {!image ? (
              <>
                <div className="flex justify-center">
                  <video
                    id="camera-video"
                    className="mt-4"
                    style={{ display: cameraActive ? "block" : "none" }}
                    autoPlay
                    width="320"
                    height="240"
                  ></video>
                </div>
                <div className="flex justify-center mt-4">
                  {!cameraActive ? (
                    <button
                      type="button"
                      onClick={startCamera}
                      className="px-6 py-3 border-2 border-teal-600 text-teal-600 rounded-md hover:bg-gold hover:text-white transition-all flex items-center gap-2"
                    >
                      <CameraOutlined className="text-teal-600" />
                      Open Camera
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={captureImage}
                      className="px-6 py-3 bg-appGreen text-white rounded-md hover:bg-gold transition-all"
                    >
                      Snap Photo
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className="relative flex justify-center items-center">
                <img
                  src={image}
                  alt="Equipment image"
                  className="w-32 h-32 object-cover border-4 border-green-500 shadow-md"
                />
                <div className="absolute inset-0 flex justify-center items-center">
                  <button
                    type="button"
                    onClick={deleteImage}
                    className="text-red-500 hover:text-red-600 absolute top-2 right-2 bg-white rounded-md p-1 shadow-md"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Other Form Fields */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Equipment Name
            </label>
            <input
              type="text"
              placeholder="Microscope"
              value={equipmentName}
              onChange={(e) => setEquipmentName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Taxonomy
            </label>
            <input
              type="text"
              placeholder="Lab Tools"
              value={taxonomy}
              onChange={(e) => setTaxonomy(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Quantity
            </label>
            <input
              type="text"
              value={quantity}
              onChange={(e) => setQuanity(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Department
            </label>
            <input
              type="text"
              placeholder="Physics"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            value={description}
            placeholder="Used for magnifying small objects"
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-appGreen  hover:bg-[#ff6600] text-white px-4 py-2 rounded-md"
        >
          Submit
        </button>
      </form>
    </>
  );
}
