import React, { useState } from "react";
import Cropper from "react-easy-crop";
import FancyButton from "./FancyButton";
import getCroppedImg from "./getCroppedImg";

const CropModal = ({ image, onCropComplete, onCancel }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropChange = (crop) => setCrop(crop);
  const onZoomChange = (zoom) => setZoom(zoom);
  const onCropCompleteHandler = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCrop = async () => {
    try {
      const croppedImage = await getCroppedImg(image, croppedAreaPixels);
      onCropComplete(croppedImage);
    } catch (error) {
      console.error("Error cropping image:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-900/90 backdrop-blur-lg p-8 rounded-xl shadow-2xl w-full max-w-lg border border-gray-700">
        <h3 className="text-2xl font-semibold text-indigo-400 mb-6">Crop Your Profile Picture</h3>
        <div className="relative w-full h-64">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={onCropCompleteHandler}
            cropShape="round"
          />
        </div>
        <div className="flex justify-between mt-6">
          <FancyButton onClick={handleCrop}>Crop & Save</FancyButton>
          <FancyButton onClick={onCancel} className="bg-gray-600 hover:bg-gray-700">
            Cancel
          </FancyButton>
        </div>
      </div>
    </div>
  );
};

export default CropModal;