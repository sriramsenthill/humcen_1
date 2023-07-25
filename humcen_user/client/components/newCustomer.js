import React from "react";
import styles from "@/styles/nc.module.css";
import { Typography, Card, CardContent, CardMedia, Grid } from "@mui/material";
import Link from "next/link";

const GridCard = ({ title, imageSrc, applyLink }) => {
  return (
    <Card>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {title}
        </Typography>
        {/* Add the "Apply Now" link for each card */}
        <Link href={applyLink} passHref>
          <Typography variant="body2" component="div">
            Apply Now
          </Typography>
        </Link>
      </CardContent>
      <CardMedia component="img" height="140" image={imageSrc} alt={title} />
    </Card>
  );
};

const cardsData = [
  {
    title: 'Patent Consultation',
    imageSrc: '/path/to/image1.jpg',
    applyLink: '/patent-services/consultationform', // Add a separate applyLink for each card
  },
  {
    title: 'Patent Drafting',
    imageSrc: '/path/to/image2.jpg',
    applyLink: '/patent-services/drafting-form', // Add a separate applyLink for each card
  },
  {
    title: 'Patent Filling',
    imageSrc: '/path/to/image3.jpg',
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
