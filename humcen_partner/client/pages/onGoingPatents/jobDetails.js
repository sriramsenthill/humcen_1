import {React, useState, useEffect} from "react";
import { Box, Divider, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import axios from "axios";
import FileBase64 from "react-file-base64";
import Link from "next/link";
import { Button } from "@mui/material";
import { styled } from "@mui/system";
import styles from "@/components/eCommerce/OrderDetails/TrackOrder/TrackOrder.module.css";
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { useRouter } from "next/router";
import CustomDropZone from "./CustomDropBox";


const ColorButton = styled(Button)(({ theme }) => ({
  color: "white",
  width: "120%",
  height: "52px",
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

const WhiteDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiPaper-root": {
    backgroundColor: "white",
    width: "490px",
    height: "360px",
  padding:'6px',
    borderRadius: "10px",
  },
}));


const CenteredDialogActions = styled(DialogActions)({
  display: 'flex',
  justifyContent: 'center',
  flexDirection:'column',
});



const api = axios.create({
    baseURL: "http://localhost:3000/api",
  });



const JobDetails = ({services, jobNo}) => {
    const router = useRouter();
    const {id} = router.query;
    const [jobData,setJobData]=useState(null);
    const [files, setFiles] = useState(null);
    const [jobNum, setJobNum] = useState("");
    const [job, setJob] = useState("");
    const [tokens, setTokens] = useState("");
    const [partID, setPartID] = useState(null);
    const [upload, setShowUpload] = useState(true);
    const [service, setService] = useState("");
    const [status, setStatus] = useState("");
    const [country, setCountry] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [partName, setPartName] = useState(null);
    const [textColor, setTextColor] = useState("black");
    const [personalInfo, setPersonalInfo] = useState([]);
    const [isEmpty, setEmpty ] = useState(false);
    const [isAccepted, setAccepted] = useState(false); // To show up the Submit button if and only if the Partner accepts the Job
    const [uploaded, setUploaded] = useState("");

    const getFiles = (files) => {
    setFiles(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!files) {
      setEmpty(true);
    } else {
      setIsSubmitted(true); // If you want to show the success dialog
  
      try {
        const token = localStorage.getItem("token");
    
        if (!token) {
          // Handle the case when the user is not authenticated
          console.error("User not authenticated");
          return;
        }
        if (!files) {
  
        } else {
                // Make the PUT request to update the job files
        const response = await api.put(
          'partner/job-files',
          {
            job_no: id,
            service: service,
            country: country,
            partnerID: partID,
            partnerName: partName,
            job_files: files,
          },
          {
            headers: {
              "Authorization": token,
              "Content-Type": "application/json",
            },
          }
        );
    
        console.log("Job Files Updated:", response.data);

  
        }
      
    
        // Set a state or handle any other logic after successful submission
        // For example, you can show a success message and redirect the user to another page
        
        // After successful submission, you can redirect the user to another page
      } catch (error) {
        console.error("Error in Updating Job Files", error);
        // Handle the error, show an error message, or implement any other error handling logic
      }



    }
  };
  
console.log(id);
  const handleOk = async() => {
    setIsSubmitted(false);
    try {
      const token = localStorage.getItem("token");
    
      if (!token) {
        // Handle the case when the user is not authenticated
        console.error("User not authenticated");
        return;
      }
      // Update the Timeline
      const timelineResponse = await api.put(
        "partner/uploaded",
        {
          job_no: id,
          activity: 5,
        },
        {
          headers: {
            "Authorization": token,
            "Content-Type": "application/json",
          },
        }
      );
  
      console.log("Timeline Updated:", timelineResponse.data);

    } catch(error) {
      console.error("Error updating timeline:", error);
    }

  };

  const handleOkClick = () => {
    setEmpty(false); // This will close the dialog box
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
        setJobNum(id);

        api.get(`partner/jobs/${id}`, {
          headers: {
            Authorization: token,
          },
        }).then((response) => {
          const partnerUploadDate = response.data.date_activity[4];
          console.log(partnerUploadDate);
          if(partnerUploadDate === "") {
            setShowUpload(true);
          }
        }) 


        api
          .get(`${services}/${id}`, {
            headers: {
              Authorization: token,
            },
          })
          .then((response) => { 
            console.log(response.data);
            setPersonalInfo(Object.entries(response.data).map(([key, value]) => ({
              title: key,
              text: value,
            })));   
          })
          .catch((error) => {
            console.error("Error fetching profile Settings:", error);
          }
          );

          api
          .get(`partner-details/${services}/${id}`, {
            headers: {
              Authorization: token,
            },
          })
          .then((response) => { 
              console.log("Hey" , response.data);
              const partnerInfo = response.data;
              setPartID(partnerInfo.partnerID);
              setJob(jobNo);
              setPartName(partnerInfo.partnerName);
              setService(partnerInfo.service);
              setCountry(partnerInfo.country);
          })
          .catch((error) => {
            console.error("Error fetching Partner Details", error);
          });

          api
          .get(`partner/job_files_details/${id}`, {
            headers: {
              Authorization: token,
            },
          })
          .then((response) => { 
            console.log(response.data);
            setStatus(response.data.verification);
            if (response.data.job_files.length > 0) {
              setShowUpload(false);
            }
            if(response.data.decided === true && response.data.access_provided === false) {
              setTextColor("red");
            } else if(response.data.decided === true && response.data.access_provided === true) {
              setTextColor("green");
            } else {
              setTextColor("orange");
            }
          })
          .catch((error) => {
            console.error("Error fetching Partner Details", error);
          });
          
          api.get(`partner/jobs/${id}`, {
            headers: {
              Authorization: token,
            },
          }).then(response => {
            const specificJob = response.data;
            setAccepted(response.data.Accepted);
          }).catch((err) => {
            console.error("Error in checking Accepted Status: ", err);
          })

          
      }
    }, [services, jobNo, id]);
            
        
           
  return (
    <>
      <Card
        sx={{
          boxShadow: "none",
          borderRadius: "10px",
          p: "25px",
          mb: "15px",
        }}
      > 
        <Box sx={{ padding: '20px'}}>
        {personalInfo.map((info) => (
        <Box sx={{ padding: '5px', backgroundColor: '#fff', borderRadius: "20px" }} className={styles.containerBox}>

          <ul className={styles.list}>
            <li style={{
              textAlign: "left",
            }}>
              <h3 className={styles.emailheading}>{info.title}</h3>
            </li>
            <li style={{
              textAlign: "right",
            }}>
              <p className={styles.email} style={{width:'100px'}}>{info.text}</p>
            </li>
          </ul>

          <hr className={styles.line} style={{ width: "100%" }} />

        </Box>))}
   
          {/* <ul className={styles.list}>
            <li style={{
              textAlign: "left"
            }}>
              <h3 className={styles.emailheading} style={{
              textAlign: "right"
            }}>{info.title}</h3>
            </li>
            <li style={{
              textAlign: "right"
            }}>
              <p className={styles.email} style={{
              textAlign: "right"
            }}>{info.text}</p>
            </li>
          </ul> */}
{/* 
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              width: '100px',
              pr: '10px',
            }}
          >
            {info.title}
          </Typography>

          <Typography>{info.text}</Typography> */}
          { upload && isAccepted && 
          (<ul className={styles.list}>
            <li style={{
              position: "relative",
              right: "4%",
              textAlign: "left",
              width: "200px",
            }}>
              <h3 className={styles.emailheading}>Upload your Completed Work</h3>
            </li>
            <li style={{
              position: "relative",
              right: "3%", 
              textAlign: "right",
              bottom: "50%",
              width: "150px",
              marginRight:'33px',
            }}>
              <p className={styles.email} style={{width:'200px'}} ><CustomDropZone files={files} onFileChange={getFiles}/></p>
            </li>
          </ul>)}
      <Box
          key="Status"
          sx={{
           display:'flex',
            borderBottom: '1px solid #E1E7F5',
            
            py: '10px',
          }}
        >
        </Box>
    </Box>
      </Card>
      { upload && isAccepted && (<Button
            sx={{
              background: "linear-gradient(270deg, #02E1B9 0%, #00ACF6 100%)",
              position: "relative",
              bottom: "10%",
              left: "40%",
              bottom: "15px", 
              color: "white",
              borderRadius: "100px",
              width: "10%",
              height: "88%",
              textTransform: "none",
              "&:hover": {
                background: "#00002B",
              },
              }}
              onClick={handleSubmit}
                    >
              Submit
            </Button> )}
            <WhiteDialog open={isSubmitted}>
     <CenteredDialogActions>
      <DialogTitle>
        {/* Replace 'your-image-url.jpg' with the actual URL of the image */}
        <img src="/images/done 2done.jpg" alt="Done" style={{width:"80px",height:'80px', marginBottom:"0px"}}/>
      </DialogTitle>
      <DialogContent>
        <h1 style={{textAlign:"center",fontWeight:"600",fontSize:"22px",fontFamily:'Inter',color:"#00002B"}}>Your Work has been Submitted Successfully!</h1>
      </DialogContent>
      <DialogActions>
        <ColorButton  onClick={() => {handleOk(); router.push("/");}} style={{width:"120px",height:"40px",fontFamily:'Inter'}}>OK</ColorButton>
      </DialogActions>
      </CenteredDialogActions>

</WhiteDialog>
      <Dialog open={isEmpty}>
        <DialogTitle>Failed</DialogTitle>
        <DialogContent>
          <p>No Files Detected. Please upload your File</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleOkClick}>OK</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default JobDetails;