import {React, use, useEffect, useState} from "react";
import Link from "next/link";
import styles from "@/styles/Patents.module.css";
import style from "@/styles/PageTitle.module.css";
import axios from "axios";
import Grid from "@mui/material/Grid";
import { useRouter } from "next/router";
import JSZip from "jszip";
import Card from "@mui/material/Card";
import { Box } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { jobData } from "../../../components/patentData";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { styled } from "@mui/system";
import { OpenInBrowserOutlined } from "@mui/icons-material";

const ColorButton = styled(Button)(({ theme }) => ({
  color: "white",
  width: "120%",
  height: "60px",
  borderRadius: "100px",
  marginBottom: "30px",
  background: "linear-gradient(270deg, #02E1B9 0%, #00ACF6 100%)",
  "&:hover": {
    background: "linear-gradient(270deg, #02E1B9 0%, #00ACF6 100%)",
  },
  textTransform: "none",
  fontSize: "14px",
  fontWeight: "400",
}));

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


const Verifications = ({ jobNumber }) => {
  const job = jobData.find((job) => job.jobNumber === "DEF456");
  const router = useRouter();
  const { id } = router.query;

  const [downloadStatus, setDownloadStatus] = useState(false); // Initally, User is denied from downloading
  const [jobID, setJobID] = useState("");
  const [Service, setService] = useState("");
  const [approval, setApprovalStatus] = useState(false); // Initially User won't approve the Work
  const [reasons, setReasons] = useState("") // Initially User won't give any reason
  const [decisions, setDecisions] = useState(false);

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const response = await api.get(`/job_order/${id}`);
        const specificJob = response.data;

        if (specificJob) {
          setJobID(id);
          setService(specificJob.service);
        } else {
          console.log("No job found with the provided job number:", id);
        }
      } catch (error) {
        console.error("Error fetching job order data:", error);
      }
    };

    fetchJobData();

    
  }, [id]); // Add 'id' as a dependency

  useEffect(() => {
    const fetchJobFileData = async (jobID) => {
      try {
        const response = await api.get(`/user/job_files_details/${jobID}`);
        console.log("Response from GET:", response.data);
        setDownloadStatus(response.data.decided);
        setApprovalStatus(response.data.approval_given);
        setDecisions(response.data.user_decided);
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

  if (!job) {
    return <div>No job found with the provided job number.</div>;
  }

  const {
    jobName,
    patentType,
    customerName,
    partnerName,
    location,
    budget,
    assigned,
    status,
  } = job;

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    console.log('Reasons:', reasons);
    setOpen(false);
  };

  const handleReasonsChange = (event) => {
    setReasons(event.target.value);
  };


  const handleApprove = async(id) => {
    try {
      const token = localStorage.getItem("token");
    
      if(token) {
        const response = await api.put(`user/job_order/approve/${jobID}`, {
          status: "Completed",
          steps: 4,
          verif: "Job Completed Successfully",
        },
      {
        headers: {
          "Authorization": token,
          "Content-Type": "application/json",
        },
      });
        console.log("Successfully sent the Approval Request" + response.data);
      }
    } catch (error) {
      console.error("Error fetching job order data:", error);
    }

  }

  const handleReject = async(id, rejectionInfo) => {
    try {
      const token = localStorage.getItem("token");
    
      if(token) {
        const response = await api.put(`user/job_order/reject/${jobID}`, {
          status: "In Progress",
          steps: 3,
          verif: rejectionInfo,
        },
      {
        headers: {
          "Authorization": token,
          "Content-Type": "application/json",
        },
      });
        console.log("Successfully sent the Rejection Request" + response.data);
      }
      window.location.reload(true);
    } catch (error) {
      console.error("Error fetching job order data:", error);
    }
  }

  // For Users to Download and Verify Partner's Work
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
        link.download = Service + "_" +  jobId + ".zip"; // Set the desired filename and extension
    
        // Trigger the download
        link.click();
    
        // Clean up the temporary link
        URL.revokeObjectURL(link.href);

    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };


  return (
    <>
      <Card
        sx={{
          boxShadow: "none",
          borderRadius: "10px",
          border: "1px solid black",
          p: "0.5% 0.5%",
          mb: "15px",
          width: "100%",
        }}
      >
        <Grid>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <tbody>
              <tr>
                <td className={styles.label} style={{ padding: "5px" }}>
                  Patent Type
                </td>
                <td className={styles.label} style={{ padding: "5px" }}>
                  Customer Name
                </td>
                <td className={styles.label} style={{ padding: "5px" }}>
                  Partner Name
                </td>
                <td className={styles.label} style={{ padding: "5px" }}>
                  Location
                </td>
                <td className={styles.label} style={{ padding: "5px" }}>
                  Budget
                </td>
                <td className={styles.label} style={{ padding: "5px" }}>
                  Assigned
                </td>
                <td className={styles.label} style={{ padding: "5px" }}>
                  Status
                </td>
                <td className={styles.label} style={{ paddingRight: "10px" }}>
                  Approval
                </td>
                <td
                  className={styles.label}
                  style={{ padding: "5px" }}
                  rowSpan={2}
                > <Button
                    sx={{
                      background: !decisions ?  "#00ACF6" : "#D3D3D3"   , 
                      color: "white",
                      borderRadius: "100px",
                      width: "100%",
                      height: "80%",
                      textTransform: "none",
                    }}
                    onClick={()=>onClickDownload(jobID)}
                    disabled={decisions}
                  >
                  
                    Download Drafts
                  </Button>
                </td>
              </tr>
              <tr>
                <td style={{ padding: "5px" }}>{patentType}</td>
                <td style={{ padding: "5px" }}>{customerName}</td>
                <td style={{ padding: "5px" }}>{partnerName}</td>
                <td style={{ padding: "5px" }}>{location}</td>
                <td style={{ padding: "5px" }}>{budget}</td>
                <td style={{ padding: "5px" }}>{assigned}</td>
                <td style={{ padding: "5px" }}>{status}</td>
                {decisions ? (
                <td style={{ padding: "5px" }}>Given</td>
              ) : (
                <td style={{ padding: "5px" }}>
                  <Button
                    style={{
                      maxWidth: "15px",
                      maxHeight: "15px",
                      minWidth: "15px",
                      minHeight: "15px",
                      paddingRight: "20px",
                    }}
                    onClick={() => {
                      window.location.reload(true);
                      handleApprove(jobID);
                    }}
                  >
                    <CheckCircleIcon color="success" />
                  </Button>
                  <Button
                    style={{
                      maxWidth: "15px",
                      maxHeight: "15px",
                      minWidth: "15px",
                      minHeight: "15px",
                    }}
                    onClick={() => {
                      window.location.reload(true);
                      handleClickOpen();
                    }}
                  >
                    <CancelIcon sx={{ color: "#D9000D" }} />
                  </Button>
                </td>
              )}
              </tr>
            </tbody>
          </table>
        </Grid>
      </Card>
      <Dialog open={open} onClose={()=>{window.location.reload(true);handleClose(); handleReject(jobID, reasons)}}>
        <DialogTitle>Type your reasons to inform the IP Partner</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
            placeholder="Type your reasons"
            value={reasons}
            onChange={handleReasonsChange}
          />
        </DialogContent>
        <DialogActions>
          <ColorButton sx={{ width: "15%" }} onClick={()=> {window.location.reload(true); handleClose() ;handleReject()}}>
            Submit
          </ColorButton>
        </DialogActions>
      </Dialog>
      ;
    </>
  );
};

export default Verifications;
