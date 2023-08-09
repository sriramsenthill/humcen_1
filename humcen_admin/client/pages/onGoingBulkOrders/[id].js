import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "@/styles/Patents.module.css";
import style from "@/styles/PageTitle.module.css";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import withAuth from "@/components/withAuth";
import Features from "./Features";
import BasicTabs from "./Tabs";
import { Button } from "@mui/material";
import axios from "axios";
import JSZip from "jszip";




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

function getStatusColor(status) {
  if (status === "In Progress") {
    return ( {
      background: "rgba(255, 255, 0, 0.1)", /* Yellow background with reduced opacity */
      borderRadius: "4px",
      fontWeight: "bold",
      color: "#ffbc2b", /* You can define your yellow color variable */
      padding: "5px 13px",
      display: "inline-block",
    });
     // Set the color to yellow for "in progress" status
  } else if (status === "Completed") {
    return ({
      background: "rgba(0, 182, 155, 0.1)",
      borderRadius: "4px",
      color: "#00b69b",
      fontWeight: "bold",
      padding: "5px 13px",
      display: "inline-block",
  })  // Set the color to green for "completed" status
  } else if (status === "Pending") {
    return ({
      background: "rgba(238,54,140,.1)",
      borderRadius: "4px",
      color: "#ee368c",
      padding: "5px 13px",
      display: "inline-block",
  })

  } 

  return ""; // Default color if the status value is not matched
}


const DynamicPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [job, setJob] = useState(null); // Initialize job state as null
  const [downloadStatus, setDownloadStatus] = useState(false); // Initally, User is denied from downloading
  const [jobID, setJobID] = useState("");
  const [color, setColor] = useState(false);
  const [Service, setService] = useState("");
  const [Files, setFiles] = useState([]);
  const [Title, setTitle] = useState("");
  const [approval, setApproval] = useState(false);

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const response = await api.get(`/bulk-order/${id}`);
        const specificJob = response.data;
        console.log(response.data);
        if (specificJob) {
          setJob(specificJob);
          setJobID(id);
          setTitle(specificJob.bulk_order_title);
          setService(specificJob.bulk_order_service);
        } else {
          console.log("No job found with the provided job number:", id);
          setJob(null);
        }
      } catch (error) {
        console.error("Error fetching job order data:", error);
        setJob(null);
      }
    };

    fetchJobData();

    // Clean up the effect by resetting the job state when the component is unmounted
    return () => {
      setJob(null);
    };
  }, [id]); // Add 'id' as a dependency

  useEffect(() => {
    const fetchJobFileData = async (jobID) => {
      try {
        const response = await api.get(`bulk-order-file/${jobID}`);
        const stringResponse = JSON.stringify(response.data);
        const objResponse = JSON.parse(stringResponse);
        setFiles(objResponse.bulk_order_files);
        setColor(true);

      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.error("Unauthorized: You do not have access to this resource.", error);
        } else {
          console.error("Error in giving access for the User to download the File.", error);
        }
      }
    };

    if (jobID) {
      fetchJobFileData(jobID);
    }

  }, [jobID]);

  console.log(Files);
  
  if (!job) {
    return <div>No job found with the provided job number.</div>;
  }

  const onClickDownload = async (uploadedFiles, bulkID) => {
    try {
      const downloadableFiles = uploadedFiles;

      let fileData = [];
      let fileName = [];
      let fileMIME = [];
      
      downloadableFiles.forEach((file) => {
        fileData.push(file.base64);
        fileName.push(file.name);
        fileMIME.push(file.type);
      })

      console.log(fileData, fileName, fileMIME);
      const zip = new JSZip();

      for(let totalFiles=0; totalFiles < fileData.length; totalFiles++) {
        const base64Data = fileData[totalFiles];

        // Convert base64 data to binary
        const binaryString = window.atob(base64Data);
    
        // Create Uint8Array from binary data
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
    
        // Create Blob object from binary data
        const blob = new Blob([bytes], { type: fileMIME[totalFiles] }); // Replace "application/pdf" with the appropriate MIME type for your file
        zip.file(fileName[totalFiles] || `file_${totalFiles}.txt`, blob);
      }
      const content = await zip.generateAsync({ type: "blob" });
        const dataURL = URL.createObjectURL(content);
        // Create temporary download link
        const link = document.createElement("a");
        link.href = dataURL;
        link.download =  "Bulk_Order_"+ bulkID +".zip"; // Set the desired filename and extension
    
        // Trigger the download
        link.click();
    
        // Clean up the temporary link
        URL.revokeObjectURL(link.href);

    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };



  // Format the start_date


  return (
    <>
      <div className={'card'}>
      {/* Page title */}
      <div className={style.pageTitle}>
        <ul>
          <li>
            <Link href="/">Dashboard</Link>
          </li>
          <li>Ongoing Patents</li>
          <li>Delivery status</li>
        </ul>
      </div>
      <h1>Bulk Orders</h1>
      <Card
        sx={{
          boxShadow: "none",
          borderRadius: "10px",
          p: "25px",
          mb: "15px",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={6}>
            <h1>{Title}</h1>
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            md={6}
            justifyContent="flex-end"
            textAlign="right"
          >
            <h2>
              <span className={styles.label1}>Job no : </span>
              {job._id.job_no}
            </h2>
          </Grid>
        </Grid>
        <Grid>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              padding: "10px",
            }}
          >
            <tbody>
              <tr>
                <td className={styles.label} style={{ padding: "10px", fontWeight: "bold", textAlign: "center", fontSize: "16px", }}>
                  Service
                </td>
                <td className={styles.label} style={{ padding: "10px", fontWeight: "bold", textAlign: "center", fontSize: "16px", }}>
                  Job Title
                </td>
                <td className={styles.label} style={{ padding: "10px", fontWeight: "bold", textAlign: "center", fontSize: "16px", }}>
                  Bulk Files
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", textAlign:"center", fontWeight: "bold", fontSize: "13.5px",  }}>{Service}</td>
                <td style={{ padding: "10px", textAlign:"center", fontSize: "13.5px",  }}>{Title}</td>
                <td style={{ padding: "10px", textAlign:"center", fontSize: "13.5px", }}>
                <Button
                      sx={{
                        background: color ? "#27AE60" : "#D3D3D3"    , // approval ? "#27AE60" : "#D3D3D3"  
                        color: "white",
                        borderRadius: "100px",
                        width: "30%",
                        height: "88%",
                        textTransform: "none",
                        "&:hover": {
                          background: "linear-gradient(90deg, #5F9EA0 0%, #7FFFD4 100%)",
                        },
                      }}
                      disabled={Files.length === 0}
                      onClick={() => onClickDownload(Files, jobID)}
                    >
                      Download now
                    </Button>
                    </td>
              </tr>
              <tr>
                <td style={{ padding: "10px" }}></td>
                <td style={{ padding: "10px" }}></td>
                <td style={{ padding: "10px" }}></td>
                <td style={{ padding: "10px" }}></td>
              </tr>
            </tbody>
          </table>
        </Grid>
      </Card>
      <Features />
      <Card
        sx={{
          boxShadow: "none",
          borderRadius: "10px",
          p: "25px",
          mb: "15px",
        }}
      >
        <Grid container spacing={2}>
          <BasicTabs />
        </Grid>
      </Card>
      </div>
    </>
  );
};

export default withAuth(DynamicPage);