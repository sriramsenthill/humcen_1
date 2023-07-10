import React from "react";
import Link from "next/link";
import styles from "@/styles/PageTitle.module.css";
import Card from "@/components/UIElements/Cards/Media";
import Grid from "@mui/material/Grid";
import withAuth from "@/components/withAuth";

const serviceList = [
  {
    image: "/images/patent_consult.png",
    title: "Patent Consultation",
    desc: "Maximize the value of your invention with expert Patent Consultation from Us",
  },
  {
    image: "/images/patent_drafting.png",
    title: "Patent Drafting",
    desc: "Transform your ideas into strong patents with our expert Patent Drafting service",
  },
  {
    image: "/images/patent_filing.png",
    title: "Patent Filing",
    desc: "Secure your innovative ideas with our hassle-free patent filing service. Let us handle the complexities of the patent application process",
  },
  {
    image: "/images/patent_search.png",
    title: "Patent Search",
    desc: "Uncover the potential of your invention with our in-depth Patent Search service.",
  },
];

const Projects = () => {
  return (
    <>
      {/* Page title */}
      <div className={styles.pageTitle}>
        <h1>Why Us?</h1>
        <ul>
          <li>
            <Link href="/">Dashboard</Link>
          </li>
          <li>Why Us</li>
        </ul>
      </div>
      <h2 style={{ marginTop: 20 }}>
        Unlock unparalleled opportunities as an IP professional by joining our
        IP marketplace.
      </h2>
      <div>
        <p style={{ fontSize: 15 }}>
          Experience direct access to a global demand, enjoy higher earnings
          potential, and embrace the freedom of a flexible work mode.
          <br />
          Connect, collaborate, and thrive in a vibrant community of like-minded
          experts. Join us today and elevate your career in the world of
          intellectual property.
        </p>
      </div>
      <br></br>
      <div className={styles.pageTitle}>
        <h1>Our Services</h1>
      </div>
      <br></br>
      <Grid
        container
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 2 }}
      >
        {serviceList.map(Card)}
      </Grid>
    </>
  );
};

export default withAuth(Projects);
