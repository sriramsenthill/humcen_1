import React from 'react';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Link from "next/link";

const BannerCard = ({ title, description, imageSrc, color}) => {
  const cardStyle = {
    marginBottom: '2rem',
    width: '100%',
    height: '275px',
    position: 'relative',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: 'rgba(0, 0, 0, 0.3) 0px 7px 29px 0px',
    transition: 'transform 0.3s ease-in-out',
    animation: 'slideIn 0.6s ease-out',
  };

  const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  };
  

  const titleStyle = {
    position: 'absolute',
    marginBottom: '10px',
    bottom: '0',
    width: '100%',
    top: "70%",
    padding: '16px',
    textAlign: "left"
  };

  
  return (
    <Card
    style={cardStyle}
    onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.01)')} // Add the onMouseOver event to apply the pop-up effect
    onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1.0)')} // Add the onMouseOut event to revert the effect on mouse out
  >
    <style>
      {`
        @keyframes slideIn {
          from {
            transform: translateX(-35px); /* Start position, 30 pixels to the left */
            opacity: 0; /* Start with opacity 0 */
          }
          to {
            transform: translateX(0); /* End position, no horizontal movement */
            opacity: 1; /* End with opacity 1 (fully visible) */
          }
        }
      `}
    </style>
      <img src={imageSrc} alt={title} style={imageStyle} />
      <div style={titleStyle}>
      <Typography variant="h3" color={color} gutterBottom style={{ fontWeight: 'bold', fontFamily: 'Inter, sans-serif' }}>
          {title}
        </Typography>
        <Typography variant="body1" color="common.black" style={{ fontFamily: 'Inter, sans-serif' }}>
          {description}
        </Typography>
      </div>
    </Card>
  );
};

export default BannerCard;
