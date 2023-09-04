import { useState } from "react";
import { ArrowBack } from "@mui/icons-material";
import { useEffect } from "react";
import {Grid, IconButton, Item} from "@mui/material";
import Card from "@mui/material/Card";
import { Box, Typography } from "@mui/material";
import Table from "@mui/material/Table";
import axios from "axios";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";


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


const BulkOrderAssignPage = ({detailsList, oldJobIDs}) => {
  const [completeDetails, setCompleteDetails] = useState(null);
  const [selectedBulkOrders, setBulkOrders] = useState(oldJobIDs);

  useEffect(() => {
    
    const getReqDetails = async(selectedBulkOrders) => {
      const response = await api.get(`bulk-assign-details/${selectedBulkOrders}`);
      if(response.data) {
        const uniqueEmails = response.data.emails.filter((value, index, array) => array.indexOf(value) === index);
        const uniqueServices = response.data.bulkServices.filter((value, index, array) => array.indexOf(value) === index);
        const uniqueCountries = response.data.bulkCountries.filter((value, index, array) => array.indexOf(value) === index);
        console.log(uniqueEmails, uniqueServices, uniqueCountries);
      }
    }

    getReqDetails(selectedBulkOrders);

  }, [selectedBulkOrders])


  return (
    <>

    {console.log(detailsList)}
      
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
    </>
  );
};

export default BulkOrderAssignPage;
