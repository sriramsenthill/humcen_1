import React from "react";
import styles from "@/styles/nc.module.css";
import { Typography, Card, CardContent, CardMedia, Grid } from "@mui/material";
import Link from "next/link";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';



const GridCard = ({ title, imageSrc, applyLink }) => {
  return (
    <div>
      <Typography className={styles.title} component="div">
        {title}
      </Typography>
      <Link href={applyLink} className={styles.applyContainer}>
        <Typography className={styles.apply} component="div">
          Apply Now
          <ArrowForwardIcon sx={{ fontSize: 18, marginLeft: 1 ,paddingTop: "5px" }} />
        </Typography>
      </Link>
        <Card sx={{ backgroundColor: '#F6F8FA',
                  height: "100%",
                  width: "80%",
                  borderRadius: '12px 12px 0 0',
                  overflow: 'hidden',
                  marginTop: '20px',
                  boxShadow: '10px 15px 15px rgba(0, 0, 0, 0.3)',
                   }}>
        <CardMedia  component="img"
                    image={imageSrc}
                    alt={title}

                    sx={{
                    height: '120%',
                    width: 'auto',
                    objectFit: 'cover', // Maintain the aspect ratio and cover the entire area
                  }} />
      </Card>
    </div>
  );
};

const cardsData = [
  {
    title: 'Patent Consultation',
    imageSrc: '/images/pat.png',
    applyLink: '/patent-services/consultationform', // Add a separate applyLink for each card
  },
  {
    title: 'Patent Drafting',
    imageSrc: '/images/draft.png',
    applyLink: '/patent-services/drafting-form', // Add a separate applyLink for each card
  },
  {
    title: 'Patent Filling',
    imageSrc: '/images/fill.png',
    applyLink: '/patent-services/filing-form', // Add a separate applyLink for each card
  },
];



const New_cus = () => {

  return (
    <>
      <div className={styles.topLine}></div>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1>Your account is now active</h1>
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
      <div className={styles.container2}>
        <h1>
          Get Started with humcen
        </h1>
        <Grid container spacing={2}>
          {cardsData.map((card, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <GridCard title={card.title} imageSrc={card.imageSrc} applyLink={card.applyLink} />
            </Grid>
          ))}
        </Grid>
      </div>
    </>
  );
};

export default New_cus;
