import React, { useState } from 'react';

const Upload = ({ onFileUpload }) => {
  const [fileData, setFileData] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onprogress = (progressEvent) => {
      const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
      setUploadProgress(progress);
    };

    reader.onload = () => {
      const base64Data = reader.result.split(',')[1]; // Extract the base64 data part
      const data = {
        name: file.name,
        type: file.type,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        base64Data: `data:${file.type};base64,${base64Data}`,
      };
      setFileData(data);
      setUploadProgress(0); // Reset progress after successful upload
      onFileUpload(data); // Pass the file data back to the parent component
    };

    reader.readAsDataURL(file);
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      {uploadProgress > 0 && <progress value={uploadProgress} max="100" />}
    </div>
  );
};

export default Upload;
