
import {Grid, IconButton, Item} from "@mui/material";
import Card from "@mui/material/Card";
import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import Table from "@mui/material/Table";
import axios from "axios";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";



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


const BulkOrderAssignPage = ({detailsList, jobLists, services}) => {
  const [allJobs, setJobs] = useState(jobLists);

  useEffect(() => {
    const fetchPartners = async(allJobs) => {
      try {
        const partners = await api.get(`find-partners/bulk-orders/${allJobs}`);
        if(partners.data) {
          console.log(partners.data);
        }

      } catch(error) {
        console.error("Error in Fetching Partners : " + error);
      }
    }

    fetchPartners(allJobs);


  }, [allJobs])

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

    </>
  );
};

export default BulkOrderAssignPage;
