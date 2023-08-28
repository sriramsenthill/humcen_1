// pages/inbox.js
import axios from "axios";
import BannerCard from "@/components/BannerCard";
import React, { useState } from "react";
import { Typography } from "@mui/material";
import Link from "next/link";
import style from "@/styles/PageTitle.module.css";
import styles from "@/styles/patent-job.module.css";
import { Button, TextField,Card } from "@mui/material";
import { styled } from "@mui/system"; // Import styled from "@mui/system" instead of "@mui/material/styles"
import { useRouter } from "next/router";
import { Box } from "@mui/material";

// Create an Axios instance
const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

// Add an interceptor to include the token in the request headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = token;
  }
  return config;
});

const ColorButton = styled(Button)(({ theme }) => ({
  color: "white",
  width: "50%",
  height: "60px",
  borderRadius: "30px",
  marginBottom: "30px",
  background: "linear-gradient(270deg, #02E1B9 0%, #00ACF6 100%)",
  "&:hover": {
    background: "linear-gradient(270deg, #02E1B9 0%, #00ACF6 100%)",
  },
  textTransform: "none",
  fontSize: "14px",
  fontWeight: "400",
}));

export default function Inbox() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [selectedEmail, setSelectedEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const consultationData = {
      service: serviceType,
      email: selectedEmail,
      meeting_date_time: new Date(`${selectedDate} ${selectedTime}`),
    };

    try {
      const response = await api.post("/consultation", consultationData);

      if (response.status === 201) {
        // Redirect to the home page ("/") and display prompt
        router.push("/");
        alert("A sales executive will contact you shortly.");
      } 
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <>
      {/* Page title */}
      <div className="card">
      <div className={style.pageTitle}>

        <ul>
          <li>
            <Link href="/">Dashboard</Link>
          </li>
          <li>
            <Link href="/patent-services">My Patent Services</Link>
          </li>
          <li>Patent Consultation</li>
        </ul>
      </div>
      <BannerCard title="Patent Consultation" imageSrc="/images/banner_img/bg.png" color="white"></BannerCard>
      {/* <p
        style={{
          fontFamily: "Inter",
          fontStyle: "normal",
          fontWeight: "400",
          fontSize: "16px",
          lineHeight: "19px",
          paddingLeft: "12%",
          marginTop: "8px"
        }}
      >
        Let's get started with the basic details to create your project
      </p> */}
      <div className={styles.container}>
 
        {/* <img
          style={{
            maxWidth: "40%",
            fontSize: "16px",
            marginBottom: "45px",
          }}
          src="https://media1.thehungryjpeg.com/thumbs2/800_3746783_7e0fpnjs5z6oprxvmn2lb6ky6tdcc341lczfwkpk_online-video-conference-vector-man-and-chat-director-communicates-with-staff-webinar-business-meeting-consultation-seminar-online-training-concept-flat-cartoon-isolated-illustration.jpg"
        />
        <p
          style={{
            maxWidth: "60%",
            fontSize: "16px",
            textAlign: "justify",
            marginBottom: "45px",
          }}
        >
          Gain valuable insights and expert guidance in safeguarding your
          intellectual property through our patent consultation service. Our
          team of seasoned professionals specializes in the intricate realm of
          patents, offering personalized solutions to protect your innovative
          ideas and inventions. Let us navigate the complexities for you,
          ensuring your intellectual assets are shielded in the ever-evolving
          landscape of intellectual property.
        </p> */}
        <Card variant="outlined" sx={{ margin: "2%", width: "80%", borderRadius: "15px" }}>

        <form onSubmit={handleSubmit}>
        <Card variant="outlined" sx={{ margin: "5% 12%",padding:"30px",}}>
        <Typography
              as="h3"
              sx={{
                fontSize: 18,
                fontWeight: 500,
                mb: "10px",
              }}
            >Choose Your Flexible Date
          </Typography>
          <TextField
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
            <Typography
              as="h3"
              sx={{
                fontSize: 18,
                fontWeight: 500,
                mb: "10px",
              }}
            >Choose Your Flexible Time</Typography>
          <TextField
            type="time"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
           <Typography
              as="h3"
              sx={{
                fontSize: 18,
                fontWeight: 500,
                mb: "10px",
              }}
            >Choose Service Type</Typography>

          <TextField
            select
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
            fullWidth
            margin="normal"
            required
          >
            <option value="Patent Drafting">Patent Drafting</option>
            <option value="Patent Filing">Patent Filing</option>
            <option value="Patent Marketplace">Patent Marketplace</option>
          </TextField>
          <Typography
              as="h3"
              sx={{
                fontSize: 18,
                fontWeight: 500,
                mb: "10px",
              }}
            >Provide Your Email Address</Typography>
          <TextField
            type="email"
            value={selectedEmail}
            onChange={(e) => setSelectedEmail(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
        <Box
              sx={{
                display: "flex",
                justifyContent: "center", // Center the button horizontally
                marginTop: "3%",
              }}
            >
              <ColorButton
                type="submit"
                style={{
                  width: "43%",
                  height: "43px",
                  textTransform: "none",
                  textAlign: "center",
                }}
              >
                Schedule A Consultation
              </ColorButton>
            </Box>
          </Card>
        </form>
        </Card>
      </div>
      </div>
    </>
  );
}
