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
import { Email, OpenInBrowserOutlined } from "@mui/icons-material";

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
  textAlign:'center',
 height:"48px",
}));

const CenteredDialogActions = styled(DialogActions)({
  display: 'flex',
  justifyContent: 'center',
  flexDirection:'column',
});

const WhiteDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiPaper-root": {
    backgroundColor: "white",
    width: "530px",
    height: "420px",
  padding:'15px',
    borderRadius: "10px",
  },
}));


const CustomDialogTitle = styled(DialogTitle)({
  width: "390px",
  textAlign:'center',
  fontSize:'22px',
 marginBottom:'17px',
});

const TextAreaBox = styled(Box)({
  width: "450px",
  height: "119px",
  padding: "15px 314px 87px 16px",
  borderRadius: "8px",
  backgroundColor: "#ECEFF0",
  
});

const CustomTextArea = styled(TextField)({
  width: "100%",
  border: "none !important", 
  outline: "none !important" 
});



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
  const [jobs, setJobOrder] = useState("");

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const response = await api.get(`/job_order/${id}`);
        const specificJob = response.data.copyJobs;

        if (specificJob) {
          setJobID(id);
          setService(specificJob.service);
          setJobOrder(specificJob);
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
    service,
    customerName,
    partnerName,
    country,
    budget,
    status,
  } = jobs;

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
          activity: 10,
          user_steps: 6,
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
          steps: 2,
          activity: 4,
          user_steps: 3,
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
     { downloadStatus ? (<Card
        sx={{
          boxShadow: "none",
          borderRadius: "10px",
          border: "1px solid #00000033",
          mb: "15px",
          width: "100%",
          padding:"1%",
          margin: "0 auto",
          mt:'45px',
          ml:"10px",
          mr:"10px",
        }}
      
      >
        <Grid
        >
        <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              padding: "8px",
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
                      background: !decisions ?  "linear-gradient(90deg, rgba(0, 172, 246, 0.8) 0%, rgba(2, 225, 185, 0.79) 91.25%)" : "#D3D3D3"   , 
                      color: "white",
                      borderRadius: "100px",
                      width:"95%",
                      height:"100%",
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
                <td style={{ padding: "5px", }}>{service}</td>
                <td style={{ padding: "5px", }}>{customerName}</td>
                <td style={{ padding: "5px", }}>{partnerName}</td>
                <td style={{ padding: "5px", }}>{country}</td>
                <td style={{ padding: "5px", }}>{budget}</td>
                <td style={{ padding: "5px", }}>Yes</td>
                <td style={{ padding: "5px", }}>{status}</td>
              
                {decisions ? (
                <td style={{ padding: "5px", }}>Given</td>
              ) : (
                <td style={{ padding: "5px", }}>
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
      </Card>) : (
      <div>No Access given by the Admin. Please Wait.</div>
    )}
    <WhiteDialog open={open} onClose={handleClose}>
    <CenteredDialogActions>
        <CustomDialogTitle>Type your reasons to inform the IP Partner</CustomDialogTitle>
       <DialogContent>
        <TextAreaBox
        >
          <textarea
  rows={6}
  cols={60}
  placeholder="Type Your Reasons"
  value={reasons}
  onChange={handleReasonsChange}
  style={{ border: "none !important",fontFamily:'Roboto', outline: "none !important" ,backgroundColor:'transparent',borderWidth:"0px",outline:"none"}}
>
     </textarea>
          </TextAreaBox>
          </DialogContent>
        <DialogActions>
          <ColorButton style={{width:"150px"}} sx={{ width: "15%" }} onClick={()=> {window.location.reload(true); handleReject(jobID, reasons)}}>
            Submit
          </ColorButton>
        </DialogActions>
        </CenteredDialogActions>
      </WhiteDialog>
    </>
  );
};

export default Verifications;