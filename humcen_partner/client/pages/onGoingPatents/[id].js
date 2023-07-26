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
import axios from "axios";
import JSZip from "jszip";
import Button from "@mui/material/Button";
import JobDetails from "./jobDetails";

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


const DynamicPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [job, setJob] = useState(null); // Initialize job state as null
  const [jobno,setjobno]=useState(null);
  const [Service,setService]=useState(null);
  
  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const response = await api.get(`partner/jobs/${id}`);
        const specificJob = response.data;
        setService(specificJob.service);
        const {job_no}=specificJob._id;
        setjobno(job_no);
        if (specificJob) {
          setJob(specificJob);

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

  console.log(job);

  if (!job) {
    return <div>No job found with the provided job number.</div>;
  }

  const onClickDownload = async (jobId) => {
    try {
      const response = await api.get(`/partner/job_order/${Service}/${jobId}`);
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
        link.download = Service + "_" +  jobId + "_User_Files.zip"; // Set the desired filename and extension
    
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
    userName,
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
              </tr>
              <tr>
                <td style={{ padding: "10px" }}>{service}</td>
                <td style={{ padding: "10px" }}>{userName}</td>
                <td style={{ padding: "10px" }}>{partnerName}</td>
                <td style={{ padding: "10px" }}>{country}</td>
                <td style={{ padding: "10px" }}>{budget}</td>
                <td style={{ padding: "10px" }}>{formattedStartDate}</td>
                <td style={{ padding: "10px" }}>{status}</td>
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
                <td>
                <Button
                      sx={{
                        background: "#27AE60", 
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
                    >
                      Download now
                    </Button>
                    </td>

              </tr>
            </tbody>
          </table>
        </Grid>
      </Card>

      <Card
        sx={{
          boxShadow: "none",
          borderRadius: "10px",
          p: "25px",
          mb: "15px",
        }}
      >
        <JobDetails services={Service} jobNo={jobno}/>       
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
