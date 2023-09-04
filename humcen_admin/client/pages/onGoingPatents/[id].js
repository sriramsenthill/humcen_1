import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { Button,Box } from "@mui/material";
import { useRouter } from "next/router";
import styles from "@/styles/Patents.module.css";
import style from "@/styles/PageTitle.module.css";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CrossAssign from "./CrossAssign";
import Features from "./Features";
import withAuth from "@/components/withAuth";
import JSZip from "jszip";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { styled } from "@mui/system";

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


const  DynamicPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [job, setJob] = useState(null); // Initialize job state as null
  const [Service, setService] = useState("");
  const [jobID, setJobID] = useState("");
  const [access, setButtonAccess] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState(false);
  const [isComponentLoaded, setComponentLoaded] = useState(false);
  const [reasons, setReasons] = useState("");
  const [states, setStates] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/admin/job_order");
        const data = await response.json();

        // Find the specific job object you want to return
        const specificJob = data.find((job) => job.og_id === Number(id));

        if (specificJob) {
          setJob(specificJob);
          setService(specificJob.service);
          setJobID(specificJob._id.job_no);
          setStates(specificJob.status);
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

 

  // Visibility

  useEffect(() => {
    const fetchJobFileData = async (jobID) => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await axios.get(`http://localhost:3000/api/admin/job_files_details/${jobID}`);
          if(!response.data || response.data.job_files.length === 0){
            setDownloadStatus(false);
            setButtonAccess(false);
          } else {
            setDownloadStatus(true);
          }
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
      fetchJobFileData(job.og_id);
    }

  }, [jobID]);
  

  if (!job) {
    return <div>No job found with the provided job number.</div>;
  }

console.log(job)

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

  const onClickDownload = async (jobId) => {
    console.log(access);
    try {
      const response = await axios.get(`http://localhost:3000/api/admin/job_files/${jobId}`);
      console.log(response.data.fileName);
      
      const fileData = response.data.fileData;
      const fileName = response.data.fileName;
      const fileMIME = response.data.fileMIME;

      console.log(fileData)
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
  const onUserAccess = async (jobId,job) => {
    try {
      const token = localStorage.getItem("token");
      if(token) {
        const response = await axios.put(
          `http://localhost:3000/api/admin/job_files_details/${jobId}`,
          {
            accessProvided: true,
            jobDetails:job,
            decision: true,
            verification: "Job Files sent to User for Verification.",
            reduction: true,
            userDeci: false,
            steps_done: 3,
            steps_user: 5,
            steps_activity: 7,
            partners: [2, 3],
            users: [2, 3, 4, 5],
            activity: [5, 6, 7],
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
      console.log("Coming" + response.data);
    } catch(error) {
      console.error("Error in giving access for the User to download the File.", error);
    }

  }

  // Function to reject Partner's Work
  const onPartnerNotif = async (jobId, reasons) => {
    try {
      const token = localStorage.getItem("token");
      if(token) {
        const response = await axios.put(
          `http://localhost:3000/api/admin/job_files_details/${jobId}`,
          {
            accessProvided: false,
            decision: true,
            verification: reasons,
            reduction: true,
            userDeci: true,
            file: {},
            steps_done: 2,
            steps_user: 3,
            steps_activity: 4,
            users: [3],
            activity: [4],
            partners: [2],
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
    customerName,
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
                <td style={{ padding: "10px", textAlign:"center", fontSize: "13.5px",  }}>{partnerName}</td>
                <td style={{ padding: "10px", textAlign:"center", fontSize: "13.5px",  }}>{country}</td>
                <td style={{ padding: "10px", textAlign:"center", fontSize: "13.5px",  }}>{budget}</td>
                <td style={{ padding: "10px", textAlign:"center", fontSize: "13.5px",  }}>{formattedStartDate}</td>
                <td style={{ padding: "10px", textAlign:"center", fontSize: "13.5px",  }}><span style={getStatusColor(status)}>{status}</span></td>
                <td style={{ padding: "10px", textAlign:"center", fontSize: "13.5px",  }}>
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
                      onClick={()=>onClickDownload(job.og_id)}
                      disabled={!downloadStatus}
                    >
                      Download now
                    </Button>
                    </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", textAlign:"center", fontSize: "13.5px",  }}></td>
                <td style={{ padding: "10px", textAlign:"center", fontSize: "13.5px",  }}></td>
                <td style={{ padding: "10px", textAlign:"center", fontSize: "13.5px",  }}></td>
                { states !== "Completed" &&<td style={{ padding: "10px", textAlign:"center", fontSize: "13.5px",  }}>
                  <Link href="#" onClick={loadComponent}>
                    Cross-Assign
                  </Link>
                </td> }
              </tr>
            </tbody>
          </table>

  { (downloadStatus && !access) && (<Grid container spacing={2}>
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
        { (downloadStatus && !access) &&  (<Grid container spacing={2}>
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
                      onClick={()=> { onUserAccess(job.og_id,job); window.location.reload(true); }}
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
                      onClick={()=>{ handleClickOpen(); }}  
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
          <ColorButton style={{width:"150px"}} sx={{ width: "15%" }} onClick={()=> { onPartnerNotif(job.og_id, reasons); window.location.reload(true); }}>
            Submit
          </ColorButton>
        </DialogActions>
        </CenteredDialogActions>
      </WhiteDialog>
    </>
  );
}

export default withAuth(DynamicPage);