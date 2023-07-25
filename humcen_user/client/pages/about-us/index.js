import React from "react";
import Link from "next/link";
import styles from "@/styles/PageTitle.module.css";
import ModernCard from "@/components/ModernCard";
import Card from "../../components/Cards.js";
import Grid from "@mui/material/Grid";
import withAuth from "@/components/withAuth.js";

const serviceList = [
  {
    image: "/images/patent_img/11.jpg",
    title: "Patent Consultation",
    desc: "Maximize the value of your invention with expert Patent Consultation from Us - Get Started Now!",
    link: "../patent-services/consultationform",
  },
  {
    image: "/images/patent_img/2.jpg",
    title: "Patent Drafting",
    desc: "Transform your ideas into strong patents with our expert Patent Drafting service",
    link: "/patent-services/drafting-form",
  },
  {
    image: "/images/patent_img/3.jpg",
    title: "Patent Filing",
    desc: "Secure your innovative ideas with our hassle-free patent filing service. Let us handle the complexities of the patent application process",
    link: "/patent-services/filing-form",
  },
  {
    image: "/images/patent_img/1.jpg",
    title: "Patent Search",
    desc: "Uncover the potential of your invention with our in-depth Patent Search service.",
    link: "/patent-services/search_form",
  },
  {
    image: "/images/patent_img/4.jpg",
    title: "Response to FER/Office Action",
    desc: "Amplify your chances of patent grant with our expert Response to FER service.",
    link: "/patent-services/response_to_fer_form",
  },
  {
    image: "/images/patent_img/6.jpg",
    title: "Freedom To Operate Search",
    desc: "Avoid potential legal roadblocks and minimize risks with our thorough FTO Search service.",
    link: "/patent-services/freedom_to_operate_form",
  },
  {
    image: "/images/patent_img/7.jpg",
    title: "Freedom to Patent Landscape",
    desc: "Make informed business decisions with our Insightful Patent Landscape analysis.",
    link: "/patent-services/patent_landscape_form",
  },
  {
    image: "/images/patent_img/8.jpg",
    title: "Freedom to Patent Portfolio Analysis",
    desc: "Maximize the value of your IP assets with our comprehensive Patent Portfolio Analysis service.",
    link: "/patent-services/patent_portfolio_analysis_form",
  },
  {
    image: "/images/patent_img/9.jpg",
    title: "Patent Translation Service",
    desc: "Bridge the language gap and expand your patent's global reach with our precise Patent Translation Service.",
    link: "/patent-services/patent_translation_service_form",
  },
  {
    image: "/images/patent_img/10.jpg",
    title: "Patent Illustration",
    desc: "Bring your invention to life with our high-quality Patent illustration service.",
    link: "/patent-services/patent_illustrations_form",
  },
  {
    image: "/images/patent_img/5.jpg",
    title: "Patent Watch",
    desc: "Stay informed and protect your IP with our proactive Patent Watch service.",
    link: "/patent-services/patent_watch_form",
  },
  {
    image: "/images/patent_img/12.jpg",
    title: "Patent Licensing and Commercialization Services",
    desc: "Unlocking the value of your patents and leveraging innovations for revenue generation and market success.",
    link: "/patent-services/design_patent_form",
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
         {serviceList.map((service, index) => (
        <ModernCard
          key={index}
          title={service.title}
          description={service.desc} // Use "desc" instead of "description"
          imageSrc={service.image}
          link={service.link}
        />
      ))}
      </Grid>
    </>
  );
};

export default withAuth(Projects);
