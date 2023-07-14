import {React, useState, useEffect} from "react";
import { Box, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import axios from "axios";



const api = axios.create({
    baseURL: "http://localhost:3000/api",
  });


const JobDetails = ({services, jobNo}) => {
    const [jobData,setJobData]=useState(null);
    const [personalInfo, setPersonalInfo] = useState([]);
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
                console.log("Response " + response.data);
                setPersonalInfo(Object.entries(response.data).map(([key, value]) => ({
                  title: key,
                  text: value,
                })));
                console.log(personalInfo);           
              })
              .catch((error) => {
                console.error("Error fetching profile Settings:", error);
              });
          }
        }, []);
    
           
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
        </Box>
      </Card>
    </>
  );
};

export default JobDetails;