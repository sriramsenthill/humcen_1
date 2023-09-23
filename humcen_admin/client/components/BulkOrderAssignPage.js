import {Grid, IconButton, Item} from "@mui/material";
import Card from "@mui/material/Card";
import { useState, useEffect } from "react";
import { Button } from "@material-ui/core";
import { Box, Typography } from "@mui/material";
import Table from "@mui/material/Table";
import axios from "axios";
import DialogBox from "./Dialog";
import PartnerSelect from "./PartnerDropDown";



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


const BulkOrderAssignPage = ({detailsList, jobLists, services, countries}) => {
  const [allJobs, setJobs] = useState(jobLists);
  const [allPartners, setPartners] = useState([]);
  const [success, setOpenSuccess] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [chosenPartner, setChosenPartner] = useState("");
 
  const handlePartnerChange = (value) => {
    setChosenPartner(value);
    console.log(value);
  }

  const handleBulkAssigns = async(partnerID, allJobs) => {
    try {
      setClicked(true);
      const sendPartnerData = await api.post(`bulk-orders/assign/${partnerID}/${allJobs}`)
      
      console.log("Assign Details Sent Successfully");
      if(sendPartnerData.status === 200) {
        setClicked(false);
        setOpenSuccess(true);
      }

    } catch(error) {
        console.error("Error in sending Bulk Order Details for Assign : " + error);
    }

  }

  useEffect(() => {
    const fetchPartners = async(allJobs) => {
      try {
        const partners = await api.get(`find-partners/bulk-orders/${services}/${countries}/${allJobs}`);
        if(partners.data) {
          setPartners(partners.data);
        }

      } catch(error) {
        console.error("Error in Fetching Partners : " + error);
      }
    }

    fetchPartners(allJobs);


  }, [allJobs])

  console.log(allPartners);

  return (
    <>
    {
  detailsList.map((detail, index) => (
    <Grid container>
      <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
      <Typography sx={{
                    borderBottom: "1px solid #F7FAFF",
                    fontSize: "18px",
                    textAlign: {
                     "xs" : "left",
                     "sm" : "center"
                    },
                    fontWeight: "bold",
                    paddingBottom: "20px",
                  }}>{detail.title}</Typography>
      </Grid>
      <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
      <Typography sx={{
                    borderBottom: "1px solid #F7FAFF",
                    textAlign: {
                     "xs" : "right",
                     "sm" : "center"
                    },
                    fontSize: "15px",
                    paddingBottom: "20px",
                  }} >{detail.text}</Typography>
      </Grid>
    </Grid>
  ))
}
<div style={{
    marginTop: "2rem",
    textAlign: "center",
  }}>
        <Typography sx={{
                    borderBottom: "1px solid #F7FAFF",
                    fontSize: "25px",
                    textAlign: "center",
                    fontWeight: "bold",
                    paddingBottom: "2rem",
         }}>Partner Selection</Typography>
  </div> 
  <Grid container>
      <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
      <Typography sx={{
                    borderBottom: "1px solid #F7FAFF",
                    fontSize: "18px",
                    textAlign: {
                     "xs" : "left",
                     "sm" : "center"
                    },
                    fontWeight: "bold",
                    paddingTop: "10px",
                  }}>Select the Partner</Typography>
      </Grid>
      <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
      <Typography sx={{
                    borderBottom: "1px solid #F7FAFF",
                    textAlign: {
                     "xs" : "right",
                     "sm" : "center"
                    },
                    fontSize: "15px",
                    paddingBottom: "20px",
                  }} >

                  { allPartners.length > 0 ? (<PartnerSelect partner={chosenPartner} onPartnerChange={handlePartnerChange} availablePartners={allPartners} />) : (
                    <>No Partners Available</>
                  ) 
                  }
                  </Typography>
      </Grid>
    </Grid>
   { chosenPartner != "" && <div style={{
      textAlign: "center"
    }}>
      <Button onClick={() => handleBulkAssigns(chosenPartner, allJobs)} variant="contained"  style={{ marginTop: '0.25rem', borderRadius: "100px" , boxShadow: "none", color: "white" ,background: "linear-gradient(90deg, rgba(0, 172, 246, 0.8) 0%, rgba(2, 225, 185, 0.79) 91.25%)"}}>
        Assign Jobs
      </Button>
    </div> }
    {clicked &&  <DialogBox title={"Processing"} description={"We're processing your Request. Please Wait for some time. Thank You!"} waitMessage={false}/>
    }
    {success &&  <DialogBox title={"Success"} description={allJobs.length +  " Bulk Orders assigned to " + chosenPartner + " Successfully."} waitMessage={true}/>
    }
    </>
  );
};

export default BulkOrderAssignPage;
