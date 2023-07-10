import React from "react";
import Link from "next/link";
import styles from "@/styles/PageTitle.module.css";
import Grid from "@mui/material/Grid";
import Card from "@/components/UIElements/Cards/Media";
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
]

const secondServiceList = [
  {
    image: "/images/response_to_fer.png",
    title: "Response To FER/Office Action",
    desc: "Amplify your chances of patent grant with our expert Response to FER service.",
  },
  {
    image: "/images/freedom_to_operate.png",
    title: "Freedom To Operate Search",
    desc: "Avoid potential legal roadblocks and minimize risks with our thorough FTO Search service",
  },
  {
    image: "/images/patent_landscape.png",
    title: "Patent Landscape",
    desc: "Make informed business decisions with our insightful Patent Landscape analysis.",
  },
  {
    image: "/images/patent_portfolio_analysis.png",
    title: "Patent Portfolio Analysis",
    desc: "Maximize the value of your IP assets with our comprehensive Patent Portfolio Analysis service.",
  },
  {
    image: "/images/patent_search.png",
    title: "Patent Search",
    desc: "Uncover the potential of your invention with our in-depth Patent Search service.",
  },
  {
    image: "/images/response_to_fer.png",
    title: "Response To FER/Office Action",
    desc: "Amplify your chances of patent grant with our expert Response to FER service.",
  },
  {
    image: "/images/freedom_to_operate.png",
    title: "Freedom To Operate Search",
    desc: "Avoid potential legal roadblocks and minimize risks with our thorough FTO Search service",
  },
  {
    image: "/images/patent_landscape.png",
    title: "Patent Landscape",
    desc: "Make informed business decisions with our insightful Patent Landscape analysis.",
  },
]

const FileManager = () => {
  return (
    <>
      {/* Page title */}
      <div className={styles.pageTitle}>
        <h1>My Patent Services</h1>
        <ul>
          <li>
            <Link href="/">Dashboard</Link>
          </li>
          <li>My Patent Services</li>
        </ul>
      </div>

      <Grid
        container
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 2 }}
      >
        {serviceList.map(Card)}
      </Grid>
      <div className={styles.pageTitle}>
        <h1>Select your Patent Services</h1>
      </div>
      <Grid
        container
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 2 }}
      >
        {secondServiceList.map(Card)}
      </Grid>
    </>
  );
}

export default withAuth(FileManager);
