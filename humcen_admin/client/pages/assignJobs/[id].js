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

 const [listOfPartner,setListOfPartner]=useState([]);
    


  useEffect(() => {
    console.log("Here " + id);
    const fetchJobData = async () => {
      try {
        const noFileInputServices = ['Patent Licensing and Commercialization Services', "Patent Watch", "Freedom to Patent Landscape" ];
        const response = await api.get(`/Unassigned/${id}`);

        const specificJob = response.data;
        console.log(specificJob);

        if (specificJob) {
          setJob(specificJob[0]);
          setJobID(specificJob.job_no);
          setService(specificJob[0].service);
          setCountry(specificJob.country);
          setFile(noFileInputServices.includes(specificJob[0].service));
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
  

  if (!job) {
    return <div>No job found with the provided job number.</div>;
  }

  const onClickFindPartner = async (Service, getCountry) => {
    try {

      // Make the API call to find the partner based on selected country and checkboxes
      setClicked(true);
      const response = await api.get(`/find-partner/${Service}/${getCountry}`);
      const partnerList = response.data
      setListOfPartner(partnerList);
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
      const assignResponse = await api.post("/assign", {
        uaJobID: job._id.job_no,
        partID: selectedPartner,
        service: job.service,
      }).then((response) => {
        console.log("Successfully sent to the API endpoint: " + response.data);
      })

    } catch(error) {
        console.error("Error in Assigning Task : " + error);
    }
  
  }

  const onClickDownload = async (Service, jobId) => {
    try {
      const response = await api.get(`admin/user_files/${Service}/${jobId}`);
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
        link.download = Service + "_" +  jobId + "_Unassigned_User_Files.zip"; // Set the desired filename and extension
    
        // Trigger the download
        link.click();
    
        // Clean up the temporary link
        URL.revokeObjectURL(link.href);  
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };
  
  const {
    budget,
    country,
    customerName,
    domain,
    job_title,
    service,
    status,
    time_of_delivery,
  } = job;


  const checkboxesPerRow = 3; // Number of checkboxes to show per row
  const size = 4; // 
  
  return (
    <>
      <div className={'card'}>
      {/* Page title */}
      <div className={style.pageTitle}>
        <ul>
          <li>
            <Link href="/">Dashboard</Link>
          </li>
          <li>Assign Jobs</li>
          <li>Status</li>
        </ul>
      </div>
      <h1>Job Details</h1>
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
              <span className={styles.label1}>Job No(UA) : </span>
              {id}
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
                  Full Name
                </td>
                <td className={styles.label} style={{ padding: "10px" }}>
                  Service
                </td>
                <td className={styles.label} style={{ padding: "10px" }}>
                  Domain
                </td>
                <td className={styles.label} style={{ padding: "10px" }}>
                   Country
                </td>
                <td className={styles.label} style={{ padding: "10px" }}>
                  Job Title
                </td>
                <td className={styles.label} style={{ padding: "10px" }}>
                  Budget
                </td>
                <td className={styles.label} style={{ padding: "10px" }}>
                  Time Of Delivery
                </td>
                <td className={styles.label} style={{ padding: "10px" }}>
                  Status
                </td>
                <td className={styles.label} style={{ padding: "10px" }}>
                  Customer Files
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px" }}>{customerName}</td>
                <td style={{ padding: "10px" }}>{service}</td>
                <td style={{ padding: "10px" }}>{domain}</td>
                <td style={{ padding: "10px" }}>{country}</td>
                <td style={{ padding: "10px" }}>{job_title}</td>
                <td style={{ padding: "10px" }}>{budget}</td>
                <td style={{ padding: "10px" }}>{time_of_delivery}</td>
                <td style={{ padding: "10px" }}>{status}</td>
                <td>
                <Button
                      sx={{
                        background: noFile ?  "#D3D3D3" : "#27AE60" , 
                        color: "white",
                        borderRadius: "100px",
                        width: "100%",
                        height: "88%",
                        textTransform: "none",
                        "&:hover": {
                          background: "linear-gradient(90deg, #5F9EA0 0%, #7FFFD4 100%)",
                        },
                      }}
                      onClick={()=>onClickDownload(job.service , job._id.job_no)}
                      disabled={noFile}
                      
                    >
                      Download now
                    </Button>
                    </td>
              </tr>
             
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
          <h1>Admin's Job Assigner : </h1>
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
        onClick={() => onClickFindPartner(job.service, job.country)}
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
