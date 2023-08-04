import React, { useState } from 'react';

const Upload = ({ onFilesUpload }) => {
  const [fileDataList, setFileDataList] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e) => {
    const files = e.target.files;
    const newFileDataList = [];

    const totalFiles = files.length;
    let filesProcessed = 0;

    const handleFileLoad = (file, base64Data) => {
      const data = {
        name: file.name,
        type: file.type,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        base64Data: `data:${file.type};base64,${base64Data}`,
      };

      newFileDataList.push(data);
      filesProcessed++;

      if (filesProcessed === totalFiles) {
        setFileDataList(newFileDataList);
        setUploadProgress(0); // Reset progress after successful upload
        onFilesUpload(newFileDataList); // Pass the file data list back to the parent component
      }
    };

    for (const file of files) {
      const reader = new FileReader();

      reader.onprogress = (progressEvent) => {
        const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
        setUploadProgress(progress);
      };

      reader.onload = () => {
        const base64Data = reader.result.split(',')[1]; // Extract the base64 data part
        handleFileLoad(file, base64Data);
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} multiple />
      {uploadProgress > 0 && <progress value={uploadProgress} max="100" />}
    </div>
  );
};

export default Upload;
