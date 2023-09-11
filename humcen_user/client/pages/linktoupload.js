import React from "react";
import Link from "next/link";
import {Button} from "@mui/material";
import axios from "axios";
import styles from "@/styles/PageTitle.module.css";
import ModernCard from "@/components/Educard.js";
import { Card, Grid, Typography } from "@mui/material";
import {useState, useEffect} from "react";
import withAuth from "@/components/withAuth.js";
import { textAlign } from "@mui/system";
import CustomDropZone from "../pages/bulk-orders/CustomDropBox";
import { file } from "jszip";

// Create an Axios instance
const api = axios.create({
  baseURL: "http://localhost:3000/api",
});


// Add an interceptor to include the token in the request headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = token;
  }
  return config;
});



const Projects = () => {
    const [detailsFile, setDetailsFile] = useState([]);
    const [totalTypes, setTypes] = useState([]);
    const [uploadAccess, setUploadAccess] = useState(false);

    useEffect(() => {
      const checkRequestBeforeUpload = async() => {
        try {
          const checkResponse = await api.get("bulk-order/check-request");
          if(checkResponse.status === 200) {
            console.log("Response received Successfully");
            setUploadAccess(checkResponse.data.user);
          }

        } catch(error) {
            console.error("Error in receiving Check Results : " + error);
        }        
      }
    
      checkRequestBeforeUpload();
    }, [])

    const handleDetailsFileChange = (files) => {
        const types = files.map((file) => file.type);
        setTypes(types);
        setDetailsFile(files);
      };
    
    const handleFileUpload = async(files) => {
      try {
        const data = {
          uploadFiles: files,
        }
        const sendBulkOrderFiles = await api.post("bulk-order/upload-files", data);
        if(sendBulkOrderFiles.status === 200) {
          console.log("Files sent Successfully");
        }
      } catch(error) {
        console.error("Error in sending User uploaded files to the Server : " + error);
      }
    }
    

  return (
    <>
      <div className={'card'}>
      {/* Page title */}
      <div className={styles.pageTitle}>
        <ul>
          <li>
            <Link href="/">Dashboard</Link>
          </li>
          <li>Link To Upload</li>
        </ul>
      </div>
      <h1 className={styles.heading}>Upload Your Bulk Files</h1>
      <p style={{color:"grey", fontSize:"20px", marginTop: 20, textAlign:"justify"}}>

      In our website, we've streamlined the process to make it easy for users to submit their inventions seamlessly. When you upload your invention details, we require two essential components to ensure efficient processing: an Excel sheet and a corresponding folder. <br/> <br/>
      The Excel sheet should include two key columns: ID and Invention Title. Users can populate these columns with the specific information related to their inventions, with each row representing a separate invention. This structured format ensures that we can accurately categorize and process your submissions.<br/> <br/>
      Simultaneously, we ask users to create a dedicated folder for each invention they submit. These should be placed inside a ZIP file. This folder should be named according to the respective ID from the Excel sheet. For instance, if you upload a folder named "bulk," within this folder, you should create subfolders labeled with IDs such as "1," "2," "3," "4," and "5." The necessary documents and files related to each invention should then be placed within their respective subfolders.<br/> <br/>
      By adhering to this dual-upload system, our platform can efficiently associate the correct documents with their corresponding invention details, ensuring a smooth and organized submission process. This approach helps us provide you with the best possible service and ensures that your inventions are handled with precision and care. <br/> <br/>

      </p>
      { uploadAccess && <Typography
                as="h4"
                sx={{
                  fontSize: 18,
                  fontWeight: 500,
                  textAlign: "center",
                  mt: "2rem",
                  mb: "1rem",
                }}
              >
                Please give a new <Link href="/bulk-orders/" style={{color: "#7DE5ED"}}>Bulk Order Request</Link> for Processing.
              </Typography>}
     { !uploadAccess && <Typography
                as="h3"
                sx={{
                  fontSize: 18,
                  fontWeight: 500,
                  mt: "2rem",
                  mb: "1rem",
                }}
              >
                Upload Here
              </Typography> }
              {/* <DottedCard> */}
           { !uploadAccess && <CustomDropZone files={detailsFile} onFileChange={handleDetailsFileChange} />    }  
      </div>
     { !uploadAccess && detailsFile.length === 2 && totalTypes.includes("application/x-zip-compressed") && totalTypes.includes("text/csv") && <div style={{
        marginTop: "1.5rem",
        textAlign: "center",
      }}>
        <Button variant="contained" onClick={() => { handleFileUpload(detailsFile); }} style={{ marginTop: '0.25rem', borderRadius: "100px" , boxShadow: "none",background: "linear-gradient(90deg, rgba(0, 172, 246, 0.8) 0%, rgba(2, 225, 185, 0.79) 91.25%)"}}>
                Submit Files
              </Button>
      </div> }
    </>
  );
};

export default withAuth(Projects);
