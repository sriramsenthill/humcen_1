import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { Button } from "@mui/material";
import { useRouter } from "next/router";
import styles from "@/styles/Patents.module.css";
import style from "@/styles/PageTitle.module.css";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CrossAssign from "./CrossAssign";
import Features from "./Features";
import withAuth from "@/components/withAuth";
import JSZip from "jszip";

const  DynamicPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [job, setJob] = useState(null); // Initialize job state as null
  const [Service, setService] = useState("");
  const [jobID, setJobID] = useState("");
  const [access, setButtonAccess] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState(true);
  const [isComponentLoaded, setComponentLoaded] = useState(false);

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/admin/job_order");
        const data = await response.json();

        // Find the specific job object you want to return
        const specificJob = data.find((job) => job._id.job_no === Number(id));

        if (specificJob) {
          setJob(specificJob);
          setService(specificJob.service);
          setJobID(specificJob._id.job_no);
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

  }, [id]); // Add 'id' as a dependency

  console.log(job);

  // Visibility

  useEffect(() => {
    const fetchJobFileData = async (jobID) => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await axios.get(`http://localhost:3000/api/admin/job_files_details/${jobID}`);
          console.log("Response from GET:", response.data);
          setButtonAccess(response.data.decided);
        }
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
  

  if (!job) {
    return <div>No job found with the provided job number.</div>;
  }

  const onClickDownload = async (jobId) => {
    console.log(access);
    try {
      const response = await axios.get(`http://localhost:3000/api/admin/job_files/${jobId}`);
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
        link.download = Service + "_" +  jobId + "_Verification.zip"; // Set the desired filename and extension
    
        // Trigger the download
        link.click();
    
        // Clean up the temporary link
        URL.revokeObjectURL(link.href);

    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  // Function to enable the Access for User's Download Button
  const onUserAccess = async (jobId) => {
    try {
      const token = localStorage.getItem("token");
      if(token) {
        const response = await axios.put(
          `http://localhost:3000/api/admin/job_files_details/${jobId}`,
          {
            accessProvided: true,
            decision: true,
            verification: "Job Files sent to User for Verification.",
            reduction: true,
            userDeci: false,
          },
          {
            headers: {
              "Authorization": token,
              "Content-Type": "application/json",
            },
          }
        );
      }
      setButtonAccess(!access);
      setDownloadStatus(true);
      window.location.reload(true);
      console.log("Coming" + response.data);
    } catch(error) {
      console.error("Error in giving access for the User to download the File.", error);
    }

  }

  // Function to reject Partner's Work
  const onPartnerNotif = async (jobId) => {
    try {
      const token = localStorage.getItem("token");
      if(token) {
        const response = await axios.put(
          `http://localhost:3000/api/admin/job_files_details/${jobId}`,
          {
            accessProvided: false,
            decision: true,
            verification: "You need to re-evaluate your Work. For more details, contact Admin.",
            reduction: false,
            userDeci: true,
            file: {},
          },
          {
            headers: {
              "Authorization": token,
              "Content-Type": "application/json",
            },
          }
        );
      }
      setButtonAccess(!access);
      setDownloadStatus(false);
      window.location.reload();
      console.log(response.data);
    } catch(error) {
      console.error("Error in giving access for the User to download the File.", error);
    }
  }

  const {
    job_no,
    start_date,
    job_title,
    service,
    userName,
    partnerName,
    country,
    budget,
    status,
  } = job;

  const loadComponent = () => {
    import("./CrossAssign").then(() => {
      setComponentLoaded(true);
    });
  };

  // Format the start_date
  const formattedStartDate = new Date(start_date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      {/* Page title */}
      <div className={style.pageTitle}>
        <h1>Ongoing Patents</h1>
        <ul>
          <li>
            <Link href="/">Dashboard</Link>
          </li>
          <li>Ongoing Patents</li>
          <li>Delivery status</li>
        </ul>
      </div>
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
                <td className={styles.label} style={{ padding: "10px" }}>
                  Patent Type
                </td>
                <td className={styles.label} style={{ padding: "10px" }}>
                  Customer Name
                </td>
                <td className={styles.label} style={{ padding: "10px" }}>
                  Partner Name
                </td>
                <td className={styles.label} style={{ padding: "10px" }}>
                  Location
                </td>
                <td className={styles.label} style={{ padding: "10px" }}>
                  Budget
                </td>
                <td className={styles.label} style={{ padding: "10px" }}>
                  Assigned
                </td>
                <td className={styles.label} style={{ padding: "10px" }}>
                  Status
                </td>
                <td className={styles.label} style={{ padding: "10px" }}>
                  Partner Work
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px" }}>{service}</td>
                <td style={{ padding: "10px" }}>{userName}</td>
                <td style={{ padding: "10px" }}>{partnerName}</td>
                <td style={{ padding: "10px" }}>{country}</td>
                <td style={{ padding: "10px" }}>{budget}</td>
                <td style={{ padding: "10px" }}>{formattedStartDate}</td>
                <td style={{ padding: "10px" }}>{status}</td>
                <td>
                <Button
                      sx={{
                        background: downloadStatus ?  "#27AE60" : "#D3D3D3" , 
                        color: "white",
                        borderRadius: "100px",
                        width: "100%",
                        height: "88%",
                        textTransform: "none",
                        "&:hover": {
                          background: "linear-gradient(90deg, #5F9EA0 0%, #7FFFD4 100%)",
                        },
                      }}
                      onClick={()=>onClickDownload(job._id.job_no)}
                      disabled={!downloadStatus}
                    >
                      Download now
                    </Button>
                    </td>
              </tr>
              <tr>
                <td style={{ padding: "10px" }}></td>
                <td style={{ padding: "10px" }}>
                  <Link href="/">Mail</Link>
                </td>
                <td style={{ padding: "10px" }}>
                  <Link href="/">Mail</Link>
                </td>
                <td style={{ padding: "10px" }}></td>
                <td style={{ padding: "10px" }}></td>
                <td style={{ padding: "10px" }}></td>
                <td style={{ padding: "10px" }}>
                  <Link href="#" onClick={loadComponent}>
                    Cross-Assign
                  </Link>
                </td>

              </tr>
            </tbody>
          </table>

  { !access && (<Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={6}>
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            md={6}
            justifyContent="flex-start"
            textAlign="center"
          >
            <h2 style={{
              position: "relative",
              right: "50%",
            }} >Partner's Work Access Management</h2>
          </Grid>
          </Grid>)}
        { !access &&  (<Grid container spacing={2}>
          <Grid
            item
            xs={12}
            sm={6}
            md={6}
            justifyContent="flex-end"
            textAlign="right"
          >
                <Button
                      sx={{
                        background: "#1D5D9B", 
                        color: "white",
                        borderRadius: "100px",
                        width: "30%",
                        height: "88%",
                        textTransform: "none",
                        "&:hover": {
                          background: "linear-gradient(90deg, #5F9EA0 0%, #7FFFD4 100%)",
                        },
                      }} // onUserAccess(job._id.job_no)
                      onClick={()=> {  window.location.reload(true); onUserAccess(job._id.job_no)}}
                    >
                      Accept the Work
                    </Button>
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            md={6}
            justifyContent="flex-end"
            textAlign="left"
          >
                <Button
                      sx={{
                        background: "#B22222", 
                        color: "white",
                        borderRadius: "100px",
                        width: "30%",
                        height: "88%",
                        textTransform: "none",
                        "&:hover": {
                          background: "linear-gradient(90deg, #5F9EA0 0%, #7FFFD4 100%)",
                        },
                      }}
                      onClick={()=>{ window.location.reload(true) ;onPartnerNotif(job._id.job_no) }}
                    >
                      Reject the Work
                </Button>
          </Grid>
        </Grid>)}  
        </Grid>
      </Card>
      <div>{isComponentLoaded && <CrossAssign />}</div>
      {/* side stepper component */}
      <Features />
    </>
  );
}

export default withAuth(DynamicPage);