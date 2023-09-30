import React from "react";
import {useState, useEffect} from "react";
import Grid from "@mui/material/Grid";
import { Card } from "@mui/material";
import Link from "next/link";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
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
    const jobOrders = response.data; // Extract the jobOrders array from the response data
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

  const carouselImages = [
    {
      src: "/images/partner1.jpg",
      alt: "image1",
      link: "https://www.youtube.com/watch?v=49HTIoCccDY",
    },
    {
      src: "/images/partner2.jpg",
      alt: "image2",
      link: "https://store.google.com/in/magazine/compare_nest_speakers_displays?pli=1&hl=en-GB",
    },
    {
      src: "/images/partner3.jpg",
      alt: "image3",
      link: "https://www.amazon.in/amazonprime",
    },
  ];

  const handleCarClick = (link) => {
    window.open(link, "_blank");
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
  <Card
            sx={{
              boxShadow: "0px 4px 13px rgba(0, 0, 0, 0.1)",
              borderRadius: "20px",
              marginBottom:"20px" 
            }}>
        <Carousel
  autoPlay={true}
  infiniteLoop={true}
  interval={3000}
  showArrows={false}
  showThumbs={false}
  showStatus={false}
  showIndicators={true}
  dynamicHeight={false}
  style={{ maxWidth: "400px", margin: "0 auto" }}
>
  {carouselImages.map((image, index) => (
    <div
      key={index}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "20px",
        overflow: "hidden",
        cursor: "pointer",
        height: "300px", // Set a fixed height for the carousel items
      }}
      onClick={() => handleCarClick(image.link)}
    >
      <img
        src={image.src}
        alt={image.alt}
        style={{
          maxWidth: "100%", // Ensure the image scales within its container
          maxHeight: "100%", // Maintain the aspect ratio of the image
          borderRadius: "20px",
        }}
      />
    </div>
                ))}
              </Carousel>
              </Card>
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
