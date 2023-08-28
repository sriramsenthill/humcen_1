import React from 'react';
import FileUpload from 'react-material-file-upload';

const FileUploadWrapper = ({ files, onFileChange }) => {
  const formatSize = (bytes) => {
    const kilobytes = bytes / 1024;
    return `${kilobytes.toFixed(2)} kB`;
  };

  const createBase64DataUrl = (file) => {
    if (!(file instanceof Blob)) {
      console.error('Invalid file type. Expected Blob or File object.');
      return;
    }
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      console.log(file);
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleRemoveFile = (removedFile) => {
    const updatedFiles = files.filter((file) => file !== removedFile);
    onFileChange(updatedFiles);
  };  
  

  const handleFileChange = async (newFiles) => {
    const updatedFiles = await Promise.all(
      newFiles.map(async (file) => {
        const base64 = await createBase64DataUrl(file);
        return {
          name: file.name,
          type: file.type,
          size: formatSize(file.size),
          base64: base64,
        };
      })
    );
    onFileChange(updatedFiles);
  };

  return (
    <FileUpload value={files} onChange={handleFileChange}  />
  );
};

export default FileUploadWrapper;
