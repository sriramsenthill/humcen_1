import React from "react";
import Paper from '@material-ui/core/Paper';
import Box from "@mui/material/Box";
import { makeStyles } from '@material-ui/core/styles';
import { styled } from "@mui/material/styles";
import {Button} from "@mui/material";
import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import DialogBox from "@/components/Dialog";
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

const TextAreaBox = styled(Box)({
  width: "450px",
  height: "119px",
  padding: "15px 314px 87px 16px",
  borderRadius: "8px",
  backgroundColor: "#ECEFF0",
  
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
  

const BulkOrderComponent = () => {
    const classes = useStyles();
    const [files, setFiles] = useState([]);
    const [bulkOrderFiles, setBulkOrderFiles] = useState([]);
    const [base64ZipData, setBase64ZipData] = useState('');
    const [userID, setUserID] = useState("");
    const [success, setSuccess] = useState(false);
    const [description, setDescription] = useState("");
    const [csvBase64Data, setCsvBase64Data] = useState("");
    const [subFileData, setSubFileData] = useState([]);

    
    const findUserID = async() => {
      const response = await api.get("user/settings").then((response) => {
        setUserID(response.data.userID);
      }).catch((err) => {
        console.error("Error in finding User ID : " + err);
      }); 
    }


    useEffect(() => {
      findUserID();
      handleFileChange(files);
    }, [files]);

    console.log(files);
    console.log(description);
    console.log(userID);

    const handleDescriptionChange = async(e) => {
      console.log(e.target.value);
      setDescription(e.target.value);
    }

    
    const handleFileChange = async(newFiles) => {
        // Process the uploaded files data as needed
        setFiles(newFiles);
      };
    ;
  const handleBulkOrder = async (user, files, desc) => {
    if(files.length > 0) {
      setSuccess(true);
    }
        const response = await api.post(`user/bulk-order-files/${user}`, {
          userFiles: files,
          message: desc
        }).then(() => {
          console.log("User's Bulk Order Files sent Successfully");
        }).catch((error) => {
          console.error('Error in sending the File to the Server : ' + error);
        });
      };
      
  
    
    return (
        <div>
          <Typography variant="h4" style={headingStyle}>
            Welcome to our Patent Design Services for Bulk Orders!
          </Typography>
          <Typography variant="body1" style={paragraphStyle}>
            At HumCen, we understand that innovation knows no bounds, and when it comes to protecting your intellectual property,
            we've got you covered in bulk. Whether you're a large corporation, a research institution, or an ambitious startup,
            our specialized patent design and services are tailored to cater to your extensive needs.
          </Typography>
          <Typography variant="h4" style={headingStyle}>
        Why Choose Our Bulk Patent Design Services?
      </Typography>
      <Container style={{ marginTop: "21px",marginBottom:'40px' }}>
              <Grid container spacing={2} sx={{ rowGap: 0 }}>
                <Grid item xs={4}>
                  <IconBox
              
                    title="Seamless Process"
                    description="We've streamlined the process to make handling large-scale patent designs effortless for you. Our experienced team is equipped to handle orders of 100 or more with precision and professionalism."

                  />
                </Grid>
                <Grid item xs={4}>
                  <IconBox
                
                    title="Tailored Solutions"
                    description="Each project is unique, and so are your requirements. Our experts work closely with you to ensure that your bulk order aligns perfectly with your specifications, ensuring the utmost accuracy and quality.
"
                  />
                </Grid>
                <Grid item xs={4}>
                  <IconBox
          
                    title="Efficient Upload System"
                    description="We've simplified the file submission process. By clicking on the easy-to-find Upload button, you can swiftly submit your files. The preferred file format for design details is Excel, allowing for organized and structured data that our team can efficiently work with."

                  />
                </Grid>
              </Grid>
              <Grid container spacing={2} sx={{ rowGap: 0 }} style={{ marginTop: "10px" }}>
                <Grid item xs={4}>
                  <IconBox
                
                    title="Neat Organization"
                    description="We value your time and understand the importance of order. To streamline the process even further, we request you to arrange the design files in an orderly manner within the Excel spreadsheet. Each design should have its corresponding files neatly categorized, making it easier for our team to comprehend and execute your vision.
"
                  />
                </Grid>
                <Grid item xs={4}>
                  <IconBox
                
                    title="Loyalty"
                    description="Customers believe the trademarked brand represents higher quality, and it becomes a cultural icon and is considered worthy of trust."
                  />
                </Grid>
                <Grid item xs={4}>
                  <IconBox
          
                    title="Zip File Convenience"
                    description="Once you've organized your files, we kindly request that you compress them into a single ZIP file. This ensures that all relevant information is bundled together and readily accessible, expediting the process and minimizing any confusion."

                  />
                </Grid>
                <Grid item xs={4}>
                  <IconBox
          
                    title="Expert Team"
                    description="Our team of patent design professionals is not only skilled in their craft but also well-versed in handling bulk orders. They bring their expertise to the table, ensuring that each design is meticulously examined and perfected, even within the scope of a large-scale order."
                    
                  />
                </Grid>
                <Grid item xs={4}>
                  <IconBox
          
                    title="Timely Delivery"
                    description="We value deadlines and understand the importance of receiving your designs promptly. With our efficient workflow and dedicated team, we strive to deliver within the agreed-upon timeframe, without compromising on quality."
                    
                  />
                </Grid>
                <Grid item xs={4}>
                  <IconBox
          
                    title="Cost-effective"
                    description="Our bulk order solutions come with attractive pricing packages, making it a financially viable option for businesses of all sizes. Protecting your intellectual property doesn't have to be a financial burden."
                    
                  />
                </Grid>
              </Grid>
            </Container>
            <Grid container>
              <Grid item xs={2}>
                <Typography variant="h4" style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  position: "relative",
                  top: "30%",
                  left: "60%",
                }}>
                    Description 
                </Typography>
            </Grid>
            <Grid item xs={10}>
                <TextAreaBox style={{
                  position: "relative",
                  left: "30%",
                }}>
                <textarea
                  rows={6}
                  cols={60}
                  placeholder="Type the Bulk Order Description"
                  value={description}
                  onChange={handleDescriptionChange}
                  style={{ border: "none !important",fontFamily:'Roboto', outline: "none !important" ,backgroundColor:'transparent',borderWidth:"0px",outline:"none"}}
  >
                </textarea>
          </TextAreaBox>
          </Grid>
      </Grid>
      <Grid container>
              <Grid item xs={6}>
                <Typography variant="h4" style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  position: "relative",
                  right: "10%",
                  top: "50%",
                }}>
                    Upload Your Files 
                </Typography>
            </Grid>
            <Grid item xs={6}>
            <div style={{
              position: "relative",
              top: "10%",
              right: "15%",
              width: "75%",
            }}>
            <CustomDropZone
           files={files} onFileChange={handleFileChange} />
            </div>
          </Grid>
      </Grid> 
         <div style={{textAlign: "center", position: "relative", top: "50px", right: "10%",paddingBottom: "30px"}}>
         { (files.length > 0) && <Button
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
                onClick={() => handleBulkOrder(userID, files, description)}
              >
                Submit File
              </Button>}
            </div>
            <Typography variant="h4" style={headingStyle}>
            Embark on a Journey of Bulk Innovation Protection:

          </Typography>
          <Typography variant="body1" style={paragraphStyle}>

      We're not just about bulk orders; we're about bulk innovation protection. Your ideas, your creations—they deserve the best possible care and attention, regardless of the order size. With HumCen, you can rest assured that your patent designs are in capable hands.

     Ready to get started? Click the "Upload" button now, and let's begin this exciting journey of safeguarding your innovations through our premier patent design and services.

     Should you have any questions or need further assistance, our dedicated support team is just a click or call away. Thank you for choosing HumCen as your partner in protecting your ideas on a grand scale.
          </Typography>
      {success &&  <DialogBox title={"Success"} description={"Bulk Order Files Uploaded Successfully."}/>
    }
        </div>
      );
};

export default BulkOrderComponent;
