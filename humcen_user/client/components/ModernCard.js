import React from 'react';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Link from "next/link";

const ModernCard = ({ title, description, imageSrc, link }) => {
  const cardStyle = {
    marginTop: '20px',
    marginBottom: '40px',
    marginLeft: '40px',
    maxWidth: "100%",
    width: '307px',
    height: '400px',
    position: 'relative',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '22px 20px 29px rgba(0, 0, 0, 0.35)',
    transition: 'transform 0.3s ease-in-out', // Add the transition property for the pop effect
    animation: 'slideIn 0.6s ease-out', // Add the custom animation for slide-in effect
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
    top: "67%",
    padding: '16px',
    textAlign: "left",
  };

  return (
    <Link href={link} style={{ textDecoration: "none" }}>
      <Card
        style={cardStyle}
        onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.06)')} // Add the onMouseOver event to apply the pop-up effect
        onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(0.99)')} // Add the onMouseOut event to revert the effect on mouse out
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
          <Typography variant="h5" color="common.white" gutterBottom style={{ fontWeight: 'bold', fontFamily: 'Inter, sans-serif' }}>
            {title}
          </Typography>
          <Typography variant="body2" color="common.white" style={{ fontFamily: 'Inter, sans-serif' }}>
            {description}
          </Typography>
        </div>
      </Card>
    </Link>
  );
};

export default ModernCard;
