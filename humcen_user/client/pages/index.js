import React from "react";
import Grid from "@mui/material/Grid";
import BasicTabs from "@/components/UIElements/Tabs/BasicTabs";
import withAuth from "@/components/withAuth";
import axios from "axios";
import { useState, useEffect } from "react";
import New_cus from "@/components/newCustomer";
import { Carousel } from "react-responsive-carousel";
import { Card } from "@mui/material";
import "react-responsive-carousel/lib/styles/carousel.min.css";


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
  const [checkJobs, setCheckJobs] = useState(null);

  const customerDataResponse = async () => {
    try {
      const response = await api.get("/");
      const customerData = response.data;
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
          const nameData = response.data;
          setName(nameData);
        })
        .catch((error) => {
          console.error("Error fetching profile name:", error);
        });
    }
  }, []);

  const carouselImages = [
    {
      src: "https://tse4.mm.bing.net/th?id=OIP.vi2If3c1dba6xSKiYvpITgHaEK&pid=Api&P=0&h=180",
      alt: "image1",
      link: "https://www.youtube.com/watch?v=49HTIoCccDY",
    },
    {
      src: "https://www.hdwallpapers.in/download/pink_gradient-HD.jpg",
      alt: "image2",
      link: "https://store.google.com/in/magazine/compare_nest_speakers_displays?pli=1&hl=en-GB",
    },
    {
      src: "https://wallpaperaccess.com/full/1092649.jpg",
      alt: "image3",
      link: "https://www.amazon.in/amazonprime",
    },
    {
      src: "https://i.redd.it/9kflyzws5ch61.png",
      alt: "image4",
      link: "https://en.wikipedia.org/wiki/Microsoft",
    },
    // Add more image paths as needed
  ];

  const handleClick = (link) => {
    window.open(link, "_blank");
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  

  return (
    <>
      <Grid item xs={12} md={12} lg={12} xl={8}>
        {checkJobs === 0 ? (
          <div className={"card"}>
            <New_cus />
          </div>
        ) : (
          <>
            <div className={"card"}>
              <h1>Welcome, {name}!</h1>
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
              
                style={{ maxWidth: "400px", margin: "0 auto",}}
              >
                {carouselImages.map((image, index) => (
                  <div
                    key={index}
                    style={{ borderRadius: "20px", overflow: "hidden", cursor: "pointer" }}
                    onClick={() => handleClick(image.link)}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      style={{ width: "100%", height: "300px", borderRadius: "20px" }}
                    />
                  </div>
                ))}
              </Carousel>
              </Card>
              <BasicTabs />
            </div>
          </>
        )}
      </Grid>
    </>
  );
};

export default withAuth(eCommerce);
