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
  const [Service, setService] = useState("");
  const [approval, setApproval] = useState(false);

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const response = await api.get(`/job_order/${id}`);
        const specificJob = response.data.copyJobs;
        console.log(specificJob);
        if (specificJob) {
          setJob(specificJob);
          setJobID(id);
          setService(specificJob.service);
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
        const response = await api.get(`/user/job_files_details/${jobID}`);
        if(!response.data){
          setDownloadStatus(false);
        }
        console.log("Response from GET:", response.data);
        setDownloadStatus(response.data.access_provided);
        setApproval(response.data.approval_given);
        const token = localStorage.getItem("token");
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
  

  console.log(job);

  if (!job) {
    return <div>No job found with the provided job number.</div>;
  }

  const onClickDownload = async (jobId) => {
    try {
      const response = await api.get(`/user/job_files/${jobId}`);
      console.log(response.data);
      
      const fileData = response.data.fileData;
      const fileName = response.data.fileName;
      const fileMIME = response.data.fileMIME;
      const zip = new JSZip();

      for(let totalFiles=0; totalFiles < fileData.length; totalFiles++) {
        const base64Data = fileData[totalFiles].split(",")[1];

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
        link.download = Service + "_" +  jobId + "_Completed.zip"; // Set the desired filename and extension
    
        // Trigger the download
        link.click();
    
        // Clean up the temporary link
        URL.revokeObjectURL(link.href);

    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const {
    job_no,
    start_date,
    job_title,
    service,
    customerName,
    partnerName,
    country,
    budget,
    status,
  } = job;

  // Format the start_date
  const formattedStartDate = new Date(start_date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

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
      <h1>Ongoing Patents</h1>
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
            <h1>{job_title}</h1>
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
                  Patent Type
                </td>
                <td className={styles.label} style={{ padding: "10px", fontWeight: "bold", textAlign: "center", fontSize: "16px", }}>
                  Customer Name
                </td>
                <td className={styles.label} style={{ padding: "10px", fontWeight: "bold", textAlign: "center", fontSize: "16px", }}>
                  Partner Name
                </td>
                <td className={styles.label} style={{ padding: "10px", fontWeight: "bold", textAlign: "center", fontSize: "16px", }}>
                  Location
                </td>
                <td className={styles.label} style={{ padding: "10px", fontWeight: "bold", textAlign: "center", fontSize: "16px", }}>
                  Budget
                </td>
                <td className={styles.label} style={{ padding: "10px", fontWeight: "bold", textAlign: "center", fontSize: "16px", }}>
                  Assigned
                </td>
                <td className={styles.label} style={{ padding: "10px", fontWeight: "bold", textAlign: "center", fontSize: "16px", }}>
                  Status
                </td>
                <td className={styles.label} style={{ padding: "10px", fontWeight: "bold", textAlign: "center", fontSize: "16px", }}>
                  Partner Work
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", textAlign:"center", fontWeight: "bold", fontSize: "13.5px",  }}>{service}</td>
                <td style={{ padding: "10px", textAlign:"center", fontSize: "13.5px",  }}>{customerName}</td>
                <td style={{ padding: "10px", textAlign:"center", fontSize: "13.5px",  }}>{partnerName == '' ? "To be Assigned" : partnerName }</td>
                <td style={{ padding: "10px", textAlign:"center", fontSize: "13.5px",  }}>{country}</td>
                <td style={{ padding: "10px", textAlign:"center", fontSize: "13.5px",  }}>{budget}</td>
                <td style={{ padding: "10px", textAlign:"center", fontSize: "13.5px",  }}>{formattedStartDate}</td>
                <td style={{ padding: "10px", textAlign:"center", fontSize: "13.5px",  }}><span style={getStatusColor(status)}>{status}</span></td>
                <td style={{ padding: "10px", textAlign:"center", fontSize: "13.5px", }}>
                <Button
                      sx={{
                        background: approval ?  "linear-gradient(90deg, rgba(0, 172, 246, 0.8) 0%, rgba(2, 225, 185, 0.79) 91.25%)" : "#D3D3D3"  , 
                        color: "white",
                        borderRadius: "100px",
                        width: "100%",
                        height: "88%",
                        textTransform: "none",
                        "&:hover": {
                          background: "#00002B",
                        },
                      }}
                      onClick={()=>onClickDownload(job.og_id)}
                      disabled={!approval}
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