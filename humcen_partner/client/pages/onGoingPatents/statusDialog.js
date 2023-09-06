import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import style from "@/styles/PageTitle.module.css";
import { Button, ButtonProps, Card, InputLabel } from "@mui/material";
import { styled } from "@mui/system";
import { Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import { CheckBox, Margin } from "@mui/icons-material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import FileBase64 from "react-file-base64";
import axios from "axios";
import { useRouter } from "next/router";

// Create an Axios instance
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
      height: "330px",
    padding:'5px',
      borderRadius: "10px",
    },
  }));
  
  
  const CenteredDialogActions = styled(DialogActions)({
    display: 'flex',
    justifyContent: 'center',
    flexDirection:'column',
  });
  

export default function StatusDialogueBox(){
    const [jobno,setjobno]=useState(null);
    const [realStatus, setStatus] = useState("");
    const router = useRouter();
    const {id} = router.query;

    useEffect(() => {
        const fetchJobFileData = async (id) => {
          try {
            const response = await api.get(`partner/job_files_details/${id}`);
            const specificJob = response.data;

            if (specificJob) {
                const {job_no}=specificJob._id;
                setjobno(job_no);
                setStatus(specificJob.verification);
    
            } else {
              console.log("No job file found with the provided job number:", id);
              
            }
          } catch (error) {
            console.error("Error fetching job file data:", error);
            
          }
        };
    
        fetchJobFileData(id);

      }, [id]);


    const handleOk = () => {
        window.location.reload(true);
      };
    

      return(
        <WhiteDialog open={true}>
     <CenteredDialogActions>
      <DialogContent sx={{
          position: "relative",
          top: "20%",
       
      }}>
        <h1 style={{textAlign:"center",fontWeight:"600",fontSize:"28px",fontFamily:'Inter',color:"#00002B"}}> Work Status and Remarks</h1>
        {realStatus ? <p style={{textAlign:"center",fontWeight:"500",fontSize:"18px",fontFamily:'Inter',color:"#8C8E8F"}}>{realStatus}</p> : <p style={{textAlign:"center",fontWeight:"500",fontSize:"15px",fontFamily:'Inter',color:"#8C8E8F"}}>Please Wait for some Time to get Work Status</p>}
        
      </DialogContent>
      <DialogActions sx={{
        position: "relative",
        top: "18%",
      }}>
        <ColorButton onClick={handleOk} style={{width:"120px",height:"40px"}}>Done</ColorButton>
      </DialogActions>
      </CenteredDialogActions>

</WhiteDialog>
      )
}