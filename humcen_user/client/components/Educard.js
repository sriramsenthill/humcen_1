import React from 'react';
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { Flex } from '@mantine/core';

const ModernCard = ({ title, description,description1, imageSrc, link }) => {
  const cardStyle = {
    marginTop: '20px',
    marginBottom: '40px',
    marginLeft: '20px',
    marginRight: '40px',
    width: '660px',
    height: '410px',
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

  const containerStyle = {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: '100%',
  };

  const imageContainerStyle = {
    flex: '0.65', // Take 40% of the container's width, but don't grow or shrink
  };

  const textContainerStyle = {
    flex: '1', // Take the remaining space of the container's width
    backgroundColor: '#f8f8f8', // Background color for the text container
    padding: '16px',
  };

  const titleStyle = {
    color: 'black',
    fontWeight: 'bold',
    fontFamily: 'Inter, sans-serif',
    marginBottom: '10px',
  };

  const descriptionStyle = {
    fontFamily: 'Inter, sans-serif',
    fontSize: '14px',
    textAlign: 'justify', // Add this line to justify the text
  };

  const descriptionStyle1 = {
    fontFamily: 'Inter, sans-serif',
    fontSize: '14px',
    textAlign: 'justify',
    marginTop: '10px',// Add this line to justify the text
  };

  return (
    <Link href={link} style={{ textDecoration: "none" }}>
      <Card
        style={cardStyle}
        onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
        onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(0.99)')}
      >
        <style>
          {`
            @keyframes slideIn {
              from {
                transform: translateX(-35px);
                opacity: 0;
              }
              to {
                transform: translateX(0);
                opacity: 1;
              }
            }
          `}
        </style>
        <div style={containerStyle}>
          <div style={imageContainerStyle}>
            <img src={imageSrc} alt={title} style={imageStyle} />
          </div>
          <div style={textContainerStyle}>
            <Typography variant="h4" gutterBottom style={titleStyle}>
              {title}
            </Typography>
            <Typography variant="body2" style={descriptionStyle}>
              {description}
            </Typography>
            <Typography variant="body2" style={descriptionStyle1} >
              {description1}
            </Typography>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default ModernCard;
