import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "@/styles/Patents.module.css";
import style from "@/styles/PageTitle.module.css";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import withAuth from "@/components/withAuth";
import { Typography } from "@mui/material";
import { Button, Checkbox, FormControlLabel } from "@mui/material";
import axios from "axios";
import JSZip from "jszip";

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
  const [getCountry, setCountry] = useState("");
    const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
  
    const handleCheckboxChange = (event) => {
      const { value } = event.target;
      setSelectedCheckboxes((prevSelected) => {
        if (prevSelected.includes(value)) {
          return prevSelected.filter((selected) => selected !== value);
        } else {
          return [...prevSelected, value];
        }
      });
    };

  console.log(selectedCheckboxes)
  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const response = await api.get(`/Unassigned/${id}`);

        const specificJob = response.data;
        console.log(specificJob);

        if (specificJob) {
          setJob(specificJob[0]);
          setJobID(specificJob.job_no);
          setService(specificJob.service);
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
  }, [id]);

  useEffect(() => {
    const fetchJobFileData = async (jobID) => {
      try {
        const response = await api.get(`/user/job_files_details/${jobID}`);
        if(!response.data){
          setDownloadStatus(false);
        }
        console.log("Response from GET:", response.data);
        setDownloadStatus(response.data.access_provided);
        setApproval(response.data.approval_given);
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

  const onClickDownload = async (jobId) => {
    const {service_specific_files}=job;
    const {invention_details}=service_specific_files
    console.log(invention_details)
    try {
      if (!invention_details || invention_details.length === 0) {
        throw new Error('No file data found in "invention_details"');
      }
  
      const fileData = invention_details[0].base64;
      const fileName = invention_details[0].name;
      const fileMIME = invention_details[0].type;
      const zip = new JSZip();
  
      const base64Data = fileData.split(",")[1];
  
      // Convert base64 data to binary
      const binaryString = window.atob(base64Data);
  
      // Create Uint8Array from binary data
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
  
      // Create Blob object from binary data
      const blob = new Blob([bytes], { type: fileMIME });
  
      // Create a default filename if fileName is missing
      const defaultFilename = `file_${jobId}.txt`;
      const finalFilename = fileName || defaultFilename;
      zip.file(finalFilename, blob);
  
      zip.generateAsync({ type: "blob" }).then(function(content) {
        const dataURL = URL.createObjectURL(content);
        // Create temporary download link
        const link = document.createElement("a");
        link.href = dataURL;
        link.download = `${service}_${jobId}.zip`; // Set the desired filename and extension
  
        // Trigger the download
        link.click();
  
        // Clean up the temporary link
        URL.revokeObjectURL(dataURL);
      });
  
    } catch (error) {
      console.error('Error downloading file:', error.message);
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
          <li>assignjobs</li>
          <li>status</li>
        </ul>
      </div>
      <h1>Details</h1>
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
                        background: approval ? "#27AE60" : "#D3D3D3"  , 
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
             
              <tr>
                <td style={{ padding: "10px" }}></td>
                <td style={{ padding: "10px" }}></td>
                <td style={{ padding: "10px" }}></td>
                <td style={{ padding: "10px" }}></td>
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
        <Grid container spacing={2}>
      {/* Heading */}
      <Grid item xs={2}>
        <h1>Assign</h1>
      
      </Grid>

      {/* Card */}
      <Grid item xs={12}>
        <Card
          sx={{
            boxShadow: "none",
            borderRadius: "10px",
            p: "25px",
        
          }}
        >
          <Typography
            as="h3"
            sx={{
              fontSize: 18,
              fontWeight: 500,
              mb:"30px",
            }}
          >
            Select the Country
          </Typography>
          {/* Buttons for country selection */}
          <Button
            style={{
              background: getCountry === "India" ? "#68BDFD" : "#F8FCFF",
              color: getCountry === "India" ? "white" : "#BFBFBF",
              width: "13%",
              marginRight: "2%",
              height: "40px",
              textTransform: "none",
            }}
            onClick={() => {
              setCountry("India");
            }}
          >
            <img
              src="https://hatscripts.github.io/circle-flags/flags/in.svg"
              width="24"
            />
            &nbsp;&nbsp;India
          </Button>
          <Button
            style={{
              background: getCountry === "United States" ? "#68BDFD" : "#F8FCFF",
              color: getCountry === "United States" ? "white" : "#BFBFBF",
              width: "13%",
              marginRight: "2%",
              height: "40px",
              textTransform: "none",
            }}
            onClick={() => {
              setCountry("United States");
            }}
          >
            <img
              src="https://hatscripts.github.io/circle-flags/flags/us.svg"
              width="24"
            />
            &nbsp;&nbsp;United States
          </Button>
          <Button
            style={{
              background: getCountry === "Germany" ? "#68BDFD" : "#F8FCFF",
              color: getCountry === "Germany" ? "white" : "#BFBFBF",
              width: "13%",
              marginRight: "2%",
              height: "40px",
              textTransform: "none",
            }}
            onClick={() => {
              setCountry("Germany");
            }}
          >
            <img
              src="https://hatscripts.github.io/circle-flags/flags/de.svg"
              width="24"
            />
            &nbsp;&nbsp;Germany
          </Button>
          <Button
              style={{
                background: getCountry === "China" ? "#68BDFD" : "#F8FCFF",
                color: getCountry === "China" ? "white" : "#BFBFBF",
                width: "13%",
                marginRight: "2%",
                height: "40px",
                textTransform: "none",
              }}
              onClick={() => {
                setCountry("China");
              }}
            >
              <img
                src="https://hatscripts.github.io/circle-flags/flags/cn.svg"
                width="24"
              />
              &nbsp;&nbsp;China
            </Button>
            <Button
              style={{
                background: getCountry === "UAE" ? "#68BDFD" : "#F8FCFF",
                color: getCountry === "UAE" ? "white" : "#BFBFBF",
                width: "13%",
                marginRight: "2%",
                height: "40px",
                textTransform: "none",
              }}
              onClick={() => {
                setCountry("UAE");
              }}
            >
              <img
                src="https://hatscripts.github.io/circle-flags/flags/ae.svg"
                width="24"
              />
              &nbsp;&nbsp;UAE
            </Button>
            <Button
              style={{
                background: getCountry === "Japan" ? "#68BDFD" : "#F8FCFF",
                color: getCountry === "Japan" ? "white" : "#BFBFBF",
                width: "13%",
                marginRight: "2%",
                height: "40px",
                textTransform: "none",
              }}
              onClick={() => {
                setCountry("Japan");
              }}
            >
              <img
                src="https://hatscripts.github.io/circle-flags/flags/jp.svg"
                width="24"
              />
              &nbsp;&nbsp;Japan
            </Button>
          </Card>
          <Card
            sx={{
              boxShadow: "none",
              borderRadius: "10px",
              p: "25px",
              mb: "10px",
            }}
          >
           
        </Card>
      </Grid>
      <Typography
            as="h3"
            sx={{
              fontSize: 18,
              fontWeight: 500,
              mb: "30px",
              ml:"35px",
              mt:"10px",
            }}
          >
            Known Fields
          </Typography>
          <Grid container spacing={2} style={{marginLeft:"20px"}}>
      {serviceList.map((service, index) => (
        <Grid item xs={size} key={index}>
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedCheckboxes.includes(service.title)}
                onChange={handleCheckboxChange}
                value={service.title}
              />
            }
            label={service.title}
          />
        </Grid>
      ))}
    </Grid>
    </Grid>
      </Card>
      </div>
    </>
  );
          }

export default withAuth(DynamicPage);
