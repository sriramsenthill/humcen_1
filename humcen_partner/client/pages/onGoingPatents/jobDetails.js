import {React, useState, useEffect} from "react";
import { Box, Divider, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import axios from "axios";
import FileBase64 from "react-file-base64";
import Link from "next/link";
import { Button } from "@mui/material";
import { styled } from "@mui/system";
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { useRouter } from "next/router";



const api = axios.create({
    baseURL: "http://localhost:3000/api",
  });



const JobDetails = ({services, jobNo}) => {
    const [jobData,setJobData]=useState(null);
    const [files, setFiles] = useState(null);
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
    const router = useRouter();


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
            job_no: job,
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
        router.push("/"); // Replace "/success-page" with your desired route
    
      } catch (error) {
        console.error("Error in Updating Job Files", error);
        // Handle the error, show an error message, or implement any other error handling logic
      }

    }
  };
  

  const handleOk = () => {
    setIsSubmitted(false);
    router.push("/");
  };

  const handleOkClick = () => {
    setEmpty(false); // This will close the dialog box
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
        api
          .get(`${services}/${jobNo}`, {
            headers: {
              Authorization: token,
            },
          })
          .then((response) => { 
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
          .get(`partner-details/${services}/${jobNo}`, {
            headers: {
              Authorization: token,
            },
          })
          .then((response) => { 
              console.log("Hey" + response.data);
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
          .get(`partner/job_files_details/${jobNo}`, {
            headers: {
              Authorization: token,
            },
          })
          .then((response) => { 
            console.log(response.data);
            setStatus(response.data.verification);
            if (Object.keys(response.data.job_files).length > 0) {
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
          
          api.get(`partner/jobs/${jobNo}`, {
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
    }, [services, jobNo]);
            
        
           
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
        <Box
          sx={{
            borderBottom: "1px solid #EEF0F7",
            paddingBottom: "10px",
            mb: "20px",
          }}
          className="for-dark-bottom-border"
        >
          <Typography
            as="h3"
            sx={{
              fontSize: 18,
              fontWeight: 500,
            }}
          >
            Job Details
          </Typography>
        </Box>
        
        <Box sx={{ padding: '20px', backgroundColor: '#F7FAFF',}}>
        {personalInfo.map((info) => (
        <Box
          key={info.title}
          sx={{
           display:'flex',
            borderBottom: '1px solid #E1E7F5',
            
            py: '10px',
          }}
        >
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

          <Typography>{info.text}</Typography>
        
        </Box>
      ))}
      { upload && isAccepted && (<Typography variant="h5" sx={{ fontWeight: 'bold', py: '20px' }}>
        Upload your Work
      </Typography> )}
      { upload && isAccepted && (<FileBase64 multiple={true} onDone={getFiles} />)}
      <Divider sx={{ my: '20px' }} />
      <Box
          key="Status"
          sx={{
           display:'flex',
            borderBottom: '1px solid #E1E7F5',
            
            py: '10px',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              width: '100px',
              pr: '10px',
            }}
          >
            Status
          </Typography>

          <Typography
          sx={{
            color: textColor,
            }}
          >{status}</Typography>
        
        </Box>
    </Box>
      </Card>
      { upload && isAccepted && (<Button
            sx={{
              background: "#27AE60",
              position: "relative",
              left: "30px",
              bottom: "15px", 
              color: "white",
              borderRadius: "100px",
              width: "35%",
              height: "88%",
              textTransform: "none",
              "&:hover": {
                background: "linear-gradient(90deg, #5F9EA0 0%, #7FFFD4 100%)",
              },
              }}
              onClick={handleSubmit}
                    >
              Submit
            </Button> )}
      <Dialog open={isSubmitted}>
        <DialogTitle>Success</DialogTitle>
        <DialogContent>
          <p>Your Work has been submitted successfully.</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleOk}>OK</Button>
        </DialogActions>
      </Dialog>
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