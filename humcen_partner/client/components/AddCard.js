import React from 'react';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { useRouter } from "next/router"; // Import useRouter hook for Next.js navigation


const AddCard = ({ title, imageSrc, link }) => {
  const router = useRouter(); // Create a router object using the useRouter hook

  // Function to handle the click event on the card
  const handleCardClick = () => {
    router.push("/settings/AddServices"); // Redirect to the "Services" tab in the BasicTabs component
  };
  const cardStyle = {
    cursor: "pointer",
    marginTop: '20px',
    marginBottom: '40px',
    marginLeft: '20px',
    marginRight: '40px',
    width: '307px',
    height: '400px',
    position: 'relative',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: 'rgba(0, 0, 0, 0.3) 0px 7px 29px 0px',
  };

  const imageStyle = {
    width: "50%",
    height: "40%",
    position: "relative",
    top: "55px",
    left: "35px",
    marginLeft:"37px",
    marginTop:"30px",
  };
  

  const titleStyle = {
    position: 'absolute',
    marginBottom: '10px',
    bottom: '0',
    width: '100%',
    top: "77%",
    left: "13%",
    padding: '16px',
    textAlign: "left"
  };

  
  return (
    <Card style={cardStyle} onClick={handleCardClick}>
      <img src={imageSrc} alt={title} style={imageStyle} />
      <div style={titleStyle}>
        <Typography variant="h4" color="common.black" gutterBottom style={{ fontWeight: 'bold', fontFamily: 'Inter, sans-serif' }}>
          {title}
        </Typography>
      </div>
    </Card>
  );
};

export default AddCard;
