import React from "react";
import Link from "next/link";
import styles from "@/styles/PageTitle.module.css";
import Card from "../../components/Cards.js";
import Grid from "@mui/material/Grid";
import withAuth from "@/components/withAuth.js";

const serviceList = [
  {
    image: "/images/patent_consult.png",
    title: "Patent Consultation",
    desc: "Maximize the value of your invention with expert Patent Consultation from Us",
    link: "/patent-services/consultation",
  },
  {
    image: "/images/patent_drafting.png",
    title: "Patent Drafting",
    desc: "Transform your ideas into strong patents with our expert Patent Drafting service",
    link: "/patent-services/drafting",
  },
  {
    image: "/images/patent_filing.png",
    title: "Patent Filing",
    desc: "Secure your innovative ideas with our hassle-free patent filing service. Let us handle the complexities of the patent application process",
    link: "/patent-services/filing",
  },
  {
    image: "/images/patent_search.png",
    title: "Patent Search",
    desc: "Uncover the potential of your invention with our in-depth Patent Search service.",
    link: "/patent-services/search",
  },
  {
    image: "/images/response_to_fer.png",
    title: "Response to FER/Office Action",
    desc: "Amplify your chances of patent grant with our expert Response to FER service.",
    link: "/patent-services/response_to_fer",
  },
  {
    image: "/images/freedom_to_operate.png",
    title: "Freedom To Operate Search",
    desc: "Avoid potential legal roadblocks and minimize risks with our thorough FTO Search service.",
    link: "/patent-services/freedom_to_operate",
  },
  {
    image: "/images/patent_landscape.png",
    title: "Freedom to Patent Landscape",
    desc: "Make informed business decisions with our Insightful Patent Landscape analysis.",
    link: "/patent-services/patent_landscape",
  },
  {
    image: "/images/patent_portfolio_analysis.png",
    title: "Freedom to Patent Portfolio Analysis",
    desc: "Maximize the value of your IP assets with our comprehensive Patent Portfolio Analysis service.",
    link: "/patent-services/patent_portfolio_analysis",
  },
  {
    image: "/images/response_to_fer.png",
    title: "Patent Translation Service",
    desc: "Bridge the language gap and expand your patent's global reach with our precise Patent Translation Service.",
    link: "/patent-services/patent_translation_service",
  },
  {
    image: "/images/freedom_to_operate.png",
    title: "Patent Illustration",
    desc: "Bring your invention to life with our high-quality Patent illustration service.",
    link: "/patent-services/patent_illustrations",
  },
  {
    image: "/images/patent_landscape.png",
    title: "Patent Watch",
    desc: "Stay informed and protect your IP with our proactive Patent Watch service.",
    link: "/patent-services/patent_watch",
  },
  {
    image: "/images/patent_portfolio_analysis.png",
    title: "Design Patent",
    desc: "Secure the unique visual appeal of your product with our specialized Design Patent service.",
    link: "/patent-services/design_patent",
  },
];

const Projects = () => {
  return (
    <>
      {/* Page title */}
      <div className={styles.pageTitle}>
        <ul>
          <li>
            <Link href="/">Dashboard</Link>
          </li>
          <li>Why Us</li>
        </ul>
      </div>
      <h1 className={styles.heading}>Why Us?</h1>
      <h2 className={styles.head} style={{ marginTop: 20 }}>
        Unlock unparalleled opportunities as an IP professional by joining our
        IP marketplace.
      </h2>
      <div className={styles.head1}>
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
      <div>
        <h1 className={styles.heading}>Our Services</h1>
      </div>
      <br></br>
      <Grid
        container
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 2 }}
        sx={{ pl: "1%" }}
      >
        {serviceList.map(Card)}
      </Grid>
    </>
  );
};

export default withAuth(Projects);
