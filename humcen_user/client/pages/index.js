import React from "react";
import Grid from "@mui/material/Grid";
import Impressions from "@/components/Dashboard/eCommerce/Impressions";
import BasicTabs from "@/components/UIElements/Tabs/BasicTabs";
import withAuth from "@/components/withAuth";
import axios from "axios";
import { useState, useEffect} from "react";


const api = axios.create({
  baseURL: "http://localhost:3000/",
});

// Add an interceptor to include the token in the request headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = token;
  }
  return config;
});





  const eCommerce = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [name, setName] = useState("");
  const open = Boolean(anchorEl);
  const [checkJobs,setCheckJobs]=useState(null)
  
  const customerDataResponse = async () => {
    try {
      const response = await api.get("/");
      const customerData = response.data;
      console.log("Customer Data:", customerData);
      setCheckJobs(customerData.length);
      // Process the customer data as needed
    } catch (error) {
      console.error("Error fetching customer data:", error);
    }
  };

  customerDataResponse();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:3000/api/user/name", {
          headers: {
            Authorization: token,
          },
        })
        .then((response) => {
          const  nameData  = response.data;
          setName(nameData);
        })
        .catch((error) => {
          console.error("Error fetching profile name:", error);
        });
    }
  }, []);

  
  

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <h1>Welcome, {name}!</h1>
      {/* Page title */}

      <Grid item xs={12} md={12} lg={12} xl={8}>
      {checkJobs===0?null:
      <>
      <Impressions />
        <BasicTabs /> </>}
      </Grid>
    </>
  );
}

export default withAuth(eCommerce);
