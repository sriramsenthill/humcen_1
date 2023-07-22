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
    const [service, setService] = useState("");
    const [country, setCountry] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [partName, setPartName] = useState(null);
    const [personalInfo, setPersonalInfo] = useState([]);
    const router = useRouter();


    const getFiles = (files) => {
    setFiles(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true); // If you want to show the success dialog
  
  
    try {
      const token = localStorage.getItem("token");
  
      if (!token) {
        // Handle the case when the user is not authenticated
        console.error("User not authenticated");
        return;
      }
  
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
  
      // Set a state or handle any other logic after successful submission
      // For example, you can show a success message and redirect the user to another page
      
      // After successful submission, you can redirect the user to another page
      router.push("/"); // Replace "/success-page" with your desired route
  
    } catch (error) {
      console.error("Error in Updating Job Files", error);
      // Handle the error, show an error message, or implement any other error handling logic
    }
  };
  

  const handleOk = () => {
    setIsSubmitted(false);
    router.push("/");
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
              console.log("Hey" + response.data.partnerID);
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
        
        <Box>
          
          {personalInfo.map((info) => (
            <Box
              sx={{
                display: 'flex',
                borderBottom: '1px solid #F7FAFF',
                p: '10px 0',
              }}
              key={info.title}
              className="for-dark-bottom-border"
            >
              <Typography 
                as='h4' 
                fontWeight='500' 
                fontSize='14px' 
                width='100px'
              >
                {info.title}
              </Typography>

              <Typography>{info.text}</Typography>
            </Box>
          ))}
          <Divider />
          <Typography
            as="h2"
            sx={{
              fontSize: 20,
              fontWeight: 500,
              paddingTop: "20px",
              paddingBottom: "20px",
            }}
          >
            Upload your Work
          </Typography>
          <FileBase64 multiple={true} onDone={getFiles} />{" "}
          <Divider />
        </Box>
      </Card>
      <Button
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
            </Button>
      <Dialog open={isSubmitted}>
        <DialogTitle>Success</DialogTitle>
        <DialogContent>
          <p>Your Work has been submitted successfully.</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleOk}>OK</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default JobDetails;