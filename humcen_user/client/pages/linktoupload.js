import React from "react";
import Link from "next/link";
import styles from "@/styles/PageTitle.module.css";
import ModernCard from "@/components/Educard.js";
import { Card, Grid, Typography } from "@mui/material";

import withAuth from "@/components/withAuth.js";
import { textAlign } from "@mui/system";
import CustomDropZone from "@/components/CustomDropBox";
import { useState } from "react";
const Projects = () => {
    const [detailsFile, setDetailsFile] = useState(null);
    const handleDetailsFileChange = (files) => {
        setDetailsFile(files);
      };
    

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
      The Excel sheet should include three key columns: ID, Service Type, and Invention Title. Users can populate these columns with the specific information related to their inventions, with each row representing a separate invention. This structured format ensures that we can accurately categorize and process your submissions.<br/> <br/>
      Simultaneously, we ask users to create a dedicated folder for each invention they submit. This folder should be named according to the respective ID from the Excel sheet. For instance, if you upload a folder named "bulk," within this folder, you should create subfolders labeled with IDs such as "1," "2," "3," "4," and "5." The necessary documents and files related to each invention should then be placed within their respective subfolders.<br/> <br/>
      By adhering to this dual-upload system, our platform can efficiently associate the correct documents with their corresponding invention details, ensuring a smooth and organized submission process. This approach helps us provide you with the best possible service and ensures that your inventions are handled with precision and care. <br/> <br/>

      </p>

      <Typography
                as="h3"
                sx={{
                  fontSize: 18,
                  fontWeight: 500,
                  mt: "2rem",
                  mb: "1rem",
                }}
              >
                Upload Here
              </Typography>
              {/* <DottedCard> */}
              <CustomDropZone files={detailsFile} onFileChange={handleDetailsFileChange}/>
     

      
      </div>
    </>
  );
};

export default withAuth(Projects);
