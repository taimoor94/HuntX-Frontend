import React, { useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Cropper from "react-easy-crop";
import getCroppedImg from "./getCroppedImg";
import FancyButton from "./FancyButton";
import API_BASE_URL from "../config";
import { Upload } from "lucide-react";

const ProfilePictureUploader = ({ onUpload }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropping, setIsCropping] = useState(false);

  const onFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => setImageSrc(reader.result));
      reader.readAsDataURL(e.target.files[0]);
      setIsCropping(true);
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCrop = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      setImageSrc(null);
      setIsCropping(false);

      // Upload the cropped image to the backend
      const token = localStorage.getItem("token");
      const formData = new FormData();
      const blob = await fetch(croppedImage).then((res) => res.blob());
      formData.append("profilePicture", blob, "profile-picture.jpg");

      const response = await axios.post(
        `${API_BASE_URL}/api/users/upload-profile-picture`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      onUpload(response.data.profilePicture);
      toast.success("Profile picture updated successfully!");
    } catch (error) {
      toast.error("Failed to upload profile picture.");
      console.error("Error uploading profile picture:", error);
    }
  }, [imageSrc, croppedAreaPixels, onUpload]);

  return (
    <div className="relative">
      {isCropping ? (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gray-800 dark:bg-gray-200 p-6 rounded-2xl shadow-2xl w-full max-w-lg">
            <h3 className="text-xl font-semibold mb-4 text-indigo-400 dark:text-indigo-600">
              Crop Your Profile Picture
            </h3>
            <div className="relative w-full h-64 mb-4">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-200 dark:text-gray-700 mb-2">
                Zoom
              </label>
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex space-x-4">
              <FancyButton onClick={handleCrop} className="flex-1">
                Crop & Upload
              </FancyButton>
              <button
                onClick={() => {
                  setIsCropping(false);
                  setImageSrc(null);
                }}
                className="flex-1 px-4 py-2 bg-red-600 dark:bg-red-500 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center space-x-4">
          <label className="cursor-pointer flex items-center space-x-2 px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-300">
            <Upload className="w-5 h-5" />
            <span>Upload Profile Picture</span>
            <input
              type="file"
              accept="image/*"
              onChange={onFileChange}
              className="hidden"
            />
          </label>
        </div>
      )}
    </div>
  );
};

export default ProfilePictureUploader;