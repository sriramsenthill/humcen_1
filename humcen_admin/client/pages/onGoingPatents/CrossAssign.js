import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "@/styles/Patents.module.css";
import style from "@/styles/PageTitle.module.css";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import withAuth from "@/components/withAuth";
import { Typography } from "@mui/material";
import { Button, Checkbox, FormControl, InputLabel, MenuItem, Select,FormControlLabel } from "@mui/material";
import axios from "axios";
import JSZip from "jszip";
import { styled } from "@mui/system";
import { headers } from "next.config";

// Create an Axios instance

const serviceList = [
  {
    title: "Patent Consultation",
  },
  {
    title: "Patent Drafting",
  },
  {
    title: "Patent Filing",
  },
  {
    title: "Patent Search",
  },
  {
    title: "Response to FER/Office Action",
  },
  {
    title: "Freedom To Operate Search",
  },
  {
    title: "Freedom to Patent Landscape",
  },
  {
    title: "Freedom to Patent Portfolio Analysis",
  },
  {
    title: "Patent Translation Service",
  },
  {
    title: "Patent Illustration",
  },
  {
    title: "Patent Watch",
  },
  {
    title: "Patent Licensing and Commercialization Services",
  },
];

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


const DynamicPage = () =>{
  const router = useRouter();
  const { id } = router.query;


  const [job, setJob] = useState(null); // Initialize job state as null
  const [downloadStatus, setDownloadStatus] = useState(false); // Initally, User is denied from downloading
  const [jobID, setJobID] = useState("");
  const [Service, setService] = useState("");
  const [approval, setApproval] = useState(false);
  const [noFile, setFile] = useState(true);
  const [getCountry, setCountry] = useState("");
  const [clicked, setClicked] = useState(false); 
  const [partners, setPartners] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState('');
  const [submit, setSubmit] = useState(false);
  const [prevPartner, setPrevPartner] = useState("");

 const [listOfPartner,setListOfPartner]=useState([]);
    


  useEffect(() => {
    setJobID(jobID);
    console.log("Here " + id);
    const fetchJobData = async (id) => {
      try {
        const noFileInputServices = ['Patent Licensing and Commercialization Services', "Patent Watch", "Freedom to Patent Landscape" ];
        const response = await api.get(`admin/job_order/${id}`);
        console.log(response.data);
        const specificJob = response.data;
        console.log(specificJob);

        if (specificJob) {
          setJob(specificJob);
          setJobID(specificJob._id.job_no);
          setPrevPartner(specificJob.partnerID);
          setService(specificJob.service);
          setCountry(specificJob.country);
          setFile(noFileInputServices.includes(specificJob.service));
        } else {
          console.log("No job found with the provided job number:", id);
          setJob(null);
        }
      } catch (error) {
        console.error("Error fetching job order data:", error);
        setJob(null);
      }
    };

    fetchJobData(id);

    // Clean up the effect by resetting the job state when the component is unmounted
    return () => {
      setJob(null);
    };
  }, [id]);
  
console.log(job);
  if (!job) {
    return <div>No job found with the provided job number.</div>;
  }

  const onClickFindPartner = async (Service, getCountry) => {
    try {

      // Make the API call to find the partner based on selected country and checkboxes
      setClicked(true);
      const response = await api.get(`cross-assign/find-partner/${Service}/${getCountry}/${prevPartner}`);
      const partnerList = response.data
      setListOfPartner(partnerList);
      console.log(listOfPartner);
      if(partnerList.length === 0 ) {
        setPartners(false);
      } else {
        setPartners(true);
      }

   
      // Handle the API response here, e.g., display the partner data or take any other action
    } catch (error) {
      console.error("Error finding the partner:", error);
      // Handle any errors that occurred during the API call
    }
  };

  const handlePartnerSelection = (event) => {
    if (!event.target.value) {
      setSubmit(false);
    } else {
      setSubmit(true);
      setSelectedPartner(event.target.value); // Update the state with the selected value
      console.log(event.target.value);
    }

  };

  // To give Assign Request
  const handleSubmit = async() => {
    console.log(selectedPartner);
    try {
      const assignResponse = await api.post("/cross_assign", {
        JobID: id,
        newPartID: selectedPartner,
        prevPartID: prevPartner,
        service: Service,
      }).then((response) => {
        console.log("Successfully sent to the API endpoint: " + response.data);
      })

    } catch(error) {
        console.error("Error in Assigning Task : " + error);
    }
  
  }
  
  const checkboxesPerRow = 3; // Number of checkboxes to show per row
  const size = 4; // 
  
  return (
    <>
      <div className={'card'}>
      {/* Page title */}
      <Card
        sx={{
          boxShadow: "none",
          borderRadius: "10px",
          p: "25px",
          mb: "15px",
        }}
      >
        <Grid container spacing={2}>
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
                <td style={{ padding: "10px" }}></td>
                <td style={{ padding: "10px" }}></td>
                <td style={{ padding: "10px" }}></td>
                <td style={{ padding: "10px" }}></td>
              </tr>
            </tbody>
          </table>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={6}>
          <h1>Cross Assign : </h1>
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            md={6}
          >
  { clicked ? ( partners ? (
    <Grid item xs={12}>
         <FormControl style={{marginTop:"17px",marginLeft:"16px", width:260, position: "relative", right: "35%"}} fullWidth>
      <InputLabel id="partner-dropdown-label">Select a partner</InputLabel>
      <Select
        labelId="partner-dropdown-label"
        id="partner-dropdown"
        value={selectedPartner}
        label="Select a partner"
        onChange={handlePartnerSelection}
      >
        {
          listOfPartner.map((partner) => (
            <MenuItem key={partner._id} value={partner.userID}>
              {partner.first_name+" "+partner.last_name} {/* Replace "name" with the actual field in the partner object that contains the partner's name */}
            </MenuItem>
          ))
        }
      </Select>
    </FormControl>
    </Grid>
  ) : (
    <h3 style={{
          position: "relative",
          top: "17%",
          fontWeight: "22px",
          right: "20%",
        }}>No Partners available to do the Task</h3>
  ) ) : (
    <Button
        sx={{
        background: "#27AE60"  , 
        color: "white",
        position: "relative",
        top: "33%",
        right: "30%",
        borderRadius: "100px",
        width: "32%",
        height: "40%",
        textTransform: "none",
        "&:hover": {
          background: "linear-gradient(90deg, #5F9EA0 0%, #7FFFD4 100%)",
        },
        }}
        onClick={() => onClickFindPartner(Service, getCountry)}
      >
        Find Partner
      </Button>
      
  )}


          </Grid>
         
        </Grid>

<>
</>
      </Grid>
   
  
      </Card>
      
      {submit && (<ColorButton
                sx={{ 
                  width: "10%",
                  height: "10%",
                  position: "relative",
                  left: "33%",
                  "&:hover": {
                          background: "linear-gradient(90deg, #5F9EA0 0%, #7FFFD4 100%)",
                        }, }}
                type="submit"
                onClick={() => {window.location.href = "/"; handleSubmit()}}
              >
                Assign Job
      </ColorButton> )}
   
      </div>
    </>
  );
          }

export default withAuth(DynamicPage);