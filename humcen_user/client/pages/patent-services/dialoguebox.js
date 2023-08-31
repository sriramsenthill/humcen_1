import React, { useState, useEffect } from "react";
import Link from "next/link";
import style from "@/styles/PageTitle.module.css";
import { Button, ButtonProps, Card, InputLabel } from "@mui/material";
import { styled } from "@mui/system";
import DefaultSelect from "@/components/Forms/AdvancedElements/DefaultField";
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
import Upload from "../../components/Upload";
import BannerCard from "@/components/BannerCard";



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
      height: "460px",
    padding:'6px',
      borderRadius: "10px",
    },
  }));
  
  
  const CenteredDialogActions = styled(DialogActions)({
    display: 'flex',
    justifyContent: 'center',
    flexDirection:'column',
  });
  

 

export default function OkDialogueBox({success, domainValue, serviceValue}){
    const [closeError, setCloseError] = useState(true); 

    const router = useRouter();

    const handleOk = () => {

        router.push("/");
      };
    

     if (success === true) {
      return(
        <WhiteDialog open={true}>
     <CenteredDialogActions>
      <DialogTitle>
        {/* Replace 'your-image-url.jpg' with the actual URL of the image */}
        <img src="/images/done 2done.jpg" alt="Done" style={{width:"80px",height:'80px', marginBottom:"0px"}}/>
      </DialogTitle>
      <DialogContent>
        <h1 style={{textAlign:"center",fontWeight:"600",fontSize:"21px",color:"#00002B"}}>We're On It!
We've Received Your Request.</h1>
        <p style={{textAlign:"center",fontWeight:"500",fontSize:"15px",fontFamily:'Inter',color:"#8C8E8F"}}>Track Step-by-Step Progress Ahead!</p>
      </DialogContent>
      <DialogActions>
        <ColorButton onClick={handleOk} style={{width:"120px",height:"40px",fontFamily:'Inter'}}>Done</ColorButton>
      </DialogActions>
      </CenteredDialogActions>

</WhiteDialog>
      )

     } else if (success === false) {
      return(
        <>
{ closeError && <Dialog open={true}>
    <DialogTitle>Error</DialogTitle>
    <DialogContent>
      <p>Please fill all the required details before submitting the form.</p>
    </DialogContent>
    <DialogActions>
      <Button onClick={() => setCloseError(false)}>OK</Button>
    </DialogActions>
  </Dialog> }
  </>
      )
     }

}