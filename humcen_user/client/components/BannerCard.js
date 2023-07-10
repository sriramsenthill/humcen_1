import React from 'react';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Link from "next/link";

const BannerCard = ({ title, description, imageSrc, color}) => {
  const cardStyle = {
    marginTop: '20px',
    marginBottom: '40px',
    marginLeft: '20px',
    marginRight: '40px',
    width: '100%',
    height: '275px',
    position: 'relative',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: 'rgba(0, 0, 0, 0.3) 0px 7px 29px 0px',
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
    <Card style={cardStyle}>
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
