import React from "react";
import Paper from '@material-ui/core/Paper';
import { useRouter } from "next/router";
import { makeStyles } from '@material-ui/core/styles';
import { styled } from "@mui/material/styles";
import {Button} from "@mui/material";
import DialogBox from "@/components/Dialog";
import { useState, useEffect } from "react";
import { Typography, Card, CardContent, Grid,Container } from "@mui/material";
import CustomDropZone from "./CustomDropBox"
import Link from "next/link";
import JSZip from "jszip";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = token;
  }
  return config;
});


const headingStyle = {
  fontWeight: 'bold',
  marginBottom: '16px',
  marginTop:'40px',
   // You can adjust the spacing as needed
};

const paragraphStyle = {
  marginBottom: '16px',
  fontSize:'18px', // You can adjust the spacing as needed
};
const useStyles = makeStyles((theme) => ({
    
    card: {
      transition: 'box-shadow 0.3s', // Smooth transition for hover effect
      '&:hover': {
        boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.1)', // Box shadow on hover
      },
    },
    descriptionParagraph: {
        width: 500,
        [theme.breakpoints.down('sm')]: {
          width: '100%', // Adjust width for smaller screens (optional)
        },
      },
    }));


    const IconBox = ({ title, description, icon }) => {
        const [isHovered, setIsHovered] = useState(false);
      
        const handleMouseEnter = () => {
          setIsHovered(true);
        };
      
        const handleMouseLeave = () => {
          setIsHovered(false);
        };
      
        return (
          <Card
            sx={{
              backgroundColor: isHovered ? "transparent" : "#00ACF6",
              cursor: "pointer",
              margin: 0,
              padding: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "150px",
              boxShadow: isHovered ? "0px 4px 8px rgba(0, 0, 0, 0.2)" : "none",
              transition: "background-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
              borderRadius:"20px",
              width: '100%', // Set a fixed width for the card
              height: '100%', 
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <CardContent>
         
              <Typography
                variant="h6"
                align="center"
                style={{ color: isHovered ? "#333" : "#fff", transition: "color 0.3s ease-in-out" ,fontSize:'21px',marginBottom:'10px'}}
              >
                {title}
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                align="center"
                style={{ color: isHovered ? "#777" : "#fff", transition: "color 0.3s ease-in-out",fontSize:'14px' }}
              >
                {description}
              </Typography>
            </CardContent>
          </Card>
        );
      };
  

const Generator = () => {
    const classes = useStyles();
    const router = useRouter();
    const { id } = router.query;

    const [files, setFiles] = useState([]);
    const [bulkOrderJobs, setBulkOrderJobs] = useState([]);
    const [bulkOrderFiles, setBulkOrderFiles] = useState([]);
    const [bulkOrderTitle, setBulkOrderTitle] = useState([]);
    const [fileNo, setFileNo] = useState("");
    const [bulkOrderServices, setBulkOrderServices] = useState([]);
    const [base64ZipData, setBase64ZipData] = useState('');
    const [csvFile, setCSVFile ] = useState([]);
    const [zipFile, setZipFile] = useState([]);
    const [getThat, setThat] = useState([]);
    const [success, setSuccess] = useState(false);
    const [csvBase64Data, setCsvBase64Data] = useState("");
    const [subFileData, setSubFileData] = useState([]);

    useEffect(() => {
      // Run your asynchronous operations here
      setFileNo(id);
      if (files.length === 2) {
        handleFileChange(files);
      }
      if (csvBase64Data && base64ZipData) {
        handleBulkOrder();
      }
    }, [csvBase64Data, base64ZipData, files, id]);

    console.log(files);
    console.log(bulkOrderFiles);
    console.log(fileNo);

    const createBulkOrders = async(jobs, titles, files, fileNo) => {
      console.log("Process has started");
      if(jobs.length > 0) {
        setSuccess(true);
      }
      const response = await api.post(`admin/create-bulk-orders/`, {
        bulkJobs: jobs,
        bulkTitles: titles,
        bulkFiles: files,
        fileNumber: fileNo
      }).then(() => {
        console.log("Bulk Job Orders created Successfully.");
      }).catch((err) => {
        console.error("Error in creating Bulk Orders : " + err);
      });
    
    }


    const runPythonScript = async (csvBase64) => {
      try {
        const response = await api.get(`process-base64-csv/${csvBase64}`);
        // Assuming the server sends 'data' field in response
        console.log(response.data);
        setThat(response.data.fileDirectory);
        setBulkOrderTitle(response.data.bulkOrderTitle);
        setBulkOrderJobs(response.data.fileDirectory);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    
    const handleFileChange = async(newFiles) => {
        // Process the uploaded files data as needed
        setFiles(newFiles);
        if(newFiles.length === 2){
          if(newFiles[0].name.split('.')[1] === "zip") {
          setBase64ZipData(newFiles[0].base64.split(',')[1]);
          setCSVFile(newFiles[1]);
          setZipFile(newFiles[0]);
          setCsvBase64Data(newFiles[1].base64.split(',')[1]);
          console.log(csvFile);
        } else {
          setCsvBase64Data(newFiles[0].base64.split(',')[1]);
          setCSVFile(newFiles[0]);
          setZipFile(newFiles[1]);
          setBase64ZipData(newFiles[1].base64.split(',')[1]);
          console.log(zipFile);
        }}
      };
    
      const getMimeType = (fileName) => {
        const extension = fileName.split('.').pop();
        switch (extension) {
          case 'jpg':
            return 'image/jpeg';
          case 'png':
            return 'image/png';
          case 'pdf':
            return 'application/pdf';
          // Add more cases for other file types
          default:
            return 'application/octet-stream'; // Default MIME type
        }
      };

      const blobToBase64 = (blob) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const base64Data = reader.result.split(',')[1];
            resolve(base64Data);
          };
          reader.onerror = (error) => {
            reject(error);
          };
          reader.readAsDataURL(blob);
        });
      };

      const handleBulkOrder = async () => {
        console.log(files);
        console.log("Say Hi");
        console.log(files[1]);

        try {
          console.log("Hey");
          runPythonScript(csvBase64Data);
          console.log(getThat);
          // Decode the base64 zip data to binary
          const binaryZipData = atob(base64ZipData);
          console.log(binaryZipData);
          // Create a new JSZip instance and load the binary zip data
          const zip = new JSZip();
          const zipData = await zip.loadAsync(binaryZipData);
      
          const extractedData = [];
          // Process entries that match the '0/' subdirectory
          let subDirectory = getThat;
          for (const [entryPath, entry] of Object.entries(zipData.files)) {
            for(let directoryCount = 0; directoryCount < subDirectory.length; directoryCount++) {
              if (entryPath.startsWith(subDirectory[directoryCount])) {
                if (!entry.dir) {
                  // If it's a file, extract and process its data
                  const fileBinaryData = await entry.async('blob');
                  const base64Data = await blobToBase64(fileBinaryData);

                  extractedData[directoryCount] = extractedData[directoryCount] || [];

        
                  extractedData[directoryCount].push({
                    name: entryPath.replace(subDirectory[directoryCount], ''), // Use just the name here
                    type: getMimeType(entry.name),
                    size: fileBinaryData.size,
                    base64: base64Data,
                  });

                }
              }

            }

          }
          setBulkOrderFiles(extractedData);
          await createBulkOrders(bulkOrderJobs, bulkOrderTitle, extractedData, fileNo);
        } catch (error) {
          console.error('Error extracting subfiles:', error);
        }
      };
      
  console.log(success);
    
    return (
        <Card sx={{
            boxShadow: "none",
            borderRadius: "10px",
            p: "25px",
            mb: "15px",
          }}>
          <Grid item xs={12} sm={6} md={6}>
            <h1>Generate Bulk Orders</h1>
          </Grid>
          <div style={{textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 'auto'}}>
           <CustomDropZone files={files} onFileChange={handleFileChange} />
         </div> 


            <div style={{textAlign: "center", paddingBottom: "40px", position: "relative", top: "50px",}}>
              { (files.length == 2 && ((files[0].name.split('.')[1] === "csv" && files[1].name.split('.')[1] === "zip") || (files[1].name.split('.')[1] === "csv" && files[0].name.split('.')[1] === "zip")))&& <Button
                  sx={{
                        background: "#27AE60", 
                        color: "white",
                        borderRadius: "100px",
                        fontWeight: 500,
                        width: "10%",
                        height: "88%",
                        textTransform: "none",
                        "&:hover": {
                          background: "linear-gradient(90deg, #5F9EA0 0%, #7FFFD4 100%)",
                        },
                      }}
                onClick={() => handleBulkOrder()}
              >
                Submit File
              </Button>}
            </div>
  {success &&  <DialogBox title={"Success"} description={"Bulk Orders generated Successfully."} waitMessage={true}/>
    }
        </Card>
      );
};

export default Generator;
