import React, { useState } from "react";
import styles from "@/styles/nc.module.css";
import RecentOrders from "@/components/Dashboard/eCommerce/RecentOrders";
import SearchForm from "@/components/_App/TopNavbar/SearchForm";
import withAuth from "@/components/withAuth";
import { Typography, Card, CardContent, Grid,Container } from "@mui/material";
import Link from "next/link";
import axios from "axios";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

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

const api = axios.create({
  baseURL: "http://localhost:3000/",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = token;
  }
  return config;
});

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
        backgroundColor: isHovered ? "#00ACF6" : "transparent",
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
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <CardContent>
   
        <Typography
          variant="h6"
          align="center"
          style={{ color: isHovered ? "#fff" : "#333", transition: "color 0.3s ease-in-out" }}
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          align="center"
          style={{ color: isHovered ? "#fff" : "#777", transition: "color 0.3s ease-in-out" }}
        >
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

const Inbox = () => {
  const [checkJobs, setCheckJobs] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (value) => {
    setSearchQuery(value);
  };

  const customerDataResponse = async () => {
    try {
      const response = await api.get("/");
      const customerData = response.data;
      console.log("Customer Data:", customerData);
      setCheckJobs(customerData.length);
    } catch (error) {
      console.error("Error fetching customer data:", error);
    }
  };

  customerDataResponse();

  return (
    <>
      <div className={'card'}>
        <div className={styles.pageTitle} style={{ justifyContent: "space-between", paddingBottom: "20px" }}>
          <h1>My Patents</h1>
          {checkJobs === 0 ? null : <SearchForm onSearch={handleSearchSubmit} />}
        </div>
        {checkJobs === 0 ? (
          <>
            <Carousel
              autoPlay={true}
              infiniteLoop={true}
              interval={3000}
              showArrows={false}
              showThumbs={false}
              showStatus={false}
              showIndicators={true}
              dynamicHeight={false}
              style={{ maxWidth: "400px", margin: "0 auto", boxShadow: "0px 4px 13px rgba(0, 0, 0, 0.1)" }}
            >
              {carouselImages.map((image, index) => (
                <div
                  key={index}
                  style={{ borderRadius: "20px", overflow: "hidden", cursor: "pointer" }}
                  onClick={() => window.open(image.link, "_blank")}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    style={{ width: "100%", height: "300px", borderRadius: "20px" }}
                  />
                </div>
              ))}
            </Carousel>
            <div className={styles.container}>
              <div className={styles.content}>
                <h1>You don't have any patents registered!</h1>
                <Typography className={styles.text1}>
                  Browse our services and explore all the ways to use Humcen
                </Typography>
              </div>
              <div className={styles.buttonContainer}>
                <Link href="/patent-services">
                  <button className={styles.button}>Our Services</button>
                </Link>
              </div>
            </div>
            <Container style={{ marginTop: "21px" }}>
              <Grid container spacing={2} sx={{ rowGap: 0 }}>
                <Grid item xs={4}>
                  <IconBox
              
                    title="Safeguard"
                    description="Trademarks are vital signs companies use to distinguish their products or services from others. It deploys a multi-layered strategy to safeguard its brand."
                  />
                </Grid>
                <Grid item xs={4}>
                  <IconBox
                
                    title="Identity"
                    description="Trademarking is an essential step for protecting one’s brand identity. It will stop competitors from wiping off the customers by imitating the brand."
                  />
                </Grid>
                <Grid item xs={4}>
                  <IconBox
          
                    title="Value"
                    description="People will choose one brand over alternatives. Protecting the brand adds excellent value to your business. It's a compelling competitive advantage."
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2} sx={{ rowGap: 0 }} style={{ marginTop: "10px" }}>
                <Grid item xs={4}>
                  <IconBox
                
                    title="Ownership"
                    description="By doing brand Protection, the owner obtains a right to ownership and the right to prevent others from using a similar mark without their permission."
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
          
                    title="Profit"
                    description="A brand protection strategy allows the company to charge a premium. It results in more customers paying more due to trust, earning more profits."
                  />
                </Grid>
              </Grid>
            </Container>
          </>
        ) : (
          <Card sx={{}}>
            <RecentOrders searchQuery={searchQuery} />
          </Card>
        )}
      </div>
    </>
  );
};

export default withAuth(Inbox);
