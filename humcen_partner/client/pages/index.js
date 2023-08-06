import React from "react";
import {useState, useEffect} from "react";
import Grid from "@mui/material/Grid";
import Link from "next/link";
import styles from "@/styles/PageTitle.module.css";
 import cardStyle from "@/styles/nc.module.css";
import Performance from "@/components/Dashboard/eCommerce/Performance";
import RecentOrders from "@/components/Dashboard/eCommerce/RecentOrders";
import NewOrder from "@/components/index_comp/new_orders";
import withAuth from "@/components/withAuth";
import NewCustomers from "@/components/Dashboard/eCommerce/NewCustomers";
import axios from "axios";
import { Typography } from "@mui/material";

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// Add an interceptor to include the token in the request headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = token;
  }
  return config;
});


async function fetchJobOrders() {
  try {
    const response = await api.get('/partner/job_order');
    const { jobOrders } = response.data; // Extract the jobOrders array from the response data
    console.log(jobOrders)
    if (Array.isArray(jobOrders)) {
      const filteredJobOrders = jobOrders   // .filter(order => order.Accepted === true);
      // console.log(filteredJobOrders);
      return filteredJobOrders;
    } else {
      console.error('Invalid data format: Expected an array');
      return [];
    }
  } catch (error) {
    console.error('Error fetching job orders:', error);
    return [];
  }
}




function eCommerce() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [partnerName, setPartnerName] = useState("");
  const [getJobs,setJobs]=useState('');
  const open = Boolean(anchorEl);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:3000/api/partner/name", {
          headers: {
            Authorization: token,
          },
        })
        .then((response) => {
          const  partnerNameData  = response.data;
          setPartnerName(partnerNameData);
        })
        .catch((error) => {
          console.error("Error fetching partner name:", error);
        });
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchJobOrders();
      setJobs(data);
      console.log(data);
    };

    fetchData();
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
    <div className={'card'}>
      {/* Page title */}
      <div className={styles.pageTitle}>
        <ul>
          <li>
            <Link href="/">Dashboard</Link>
          </li>
          <li>Home</li>
        </ul>
      </div>
      <h1>Welcome Back, {partnerName}!</h1>
      {getJobs.length===0? <div className={cardStyle.container}>
      <div className={cardStyle.content}>
        <h1>Your account is now active</h1>
          <Typography className={cardStyle.text1}>
            Browse our services and explore all the ways to use Humcen
          </Typography>
        </div>
      <div className={cardStyle.buttonContainer}>
        
          <button className={cardStyle.button}>Active</button>
      
      </div>
    </div>:
  <>
      <NewOrder />
      <RecentOrders />
      <Grid
        container
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 2, md: 2 }}
        margin={2}
      >
        <Grid item xs={12} md={8}>
          {/* RevenuStatus */}
          <Performance />
        </Grid>
        <Grid item xs={12} md={4}>
          <NewCustomers />
        </Grid>
      </Grid>
</>
  }

      </div>
    </>
  );
}

export default withAuth(eCommerce);
