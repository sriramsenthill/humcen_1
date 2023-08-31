import React from 'react';
import ModernCard from "@/components/ModernCard";
import Grid from "@mui/material/Grid";
import styles from "@/styles/PageTitle.module.css";
import { useRouter } from "next/router";
import Link from "next/link";
import withAuth from '@/components/withAuth';

const serviceList = [
  {
    image: "/images/banner_img/bg.png",
    title: "Patent Consultation",
    desc: "Maximize the value of your invention with expert Patent Consultation from Us - Get Started Now!",
    link: "../patent-services/consultationform",
  },
  {
    image: "/images/banner_img/bg.png",
    title: "Patent Drafting",
    desc: "Transform your ideas into strong patents with our expert Patent Drafting service",
    link: "/patent-services/drafting-form",
  },
  {
    image: "/images/banner_img/bg.png",
    title: "Patent Filing",
    desc: "Secure your innovative ideas with our hassle-free patent filing service. Let us handle the complexities of the patent application process",
    link: "/patent-services/filing-form",
  },
  {
    image: "/images/banner_img/bg.png",
    title: "Patent Search",
    desc: "Uncover the potential of your invention with our in-depth Patent Search service.",
    link: "/patent-services/search_form",
  },
  {
    image: "/images/banner_img/bg.png",
    title: "Response to FER/Office Action",
    desc: "Amplify your chances of patent grant with our expert Response to FER service.",
    link: "/patent-services/response_to_fer_form",
  },
  {
    image: "/images/banner_img/bg.png",
    title: "Freedom To Operate Search",
    desc: "Avoid potential legal roadblocks and minimize risks with our thorough FTO Search service.",
    link: "/patent-services/freedom_to_operate_form",
  },
  {
    image: "/images/banner_img/bg.png",
    title: "Freedom to Patent Landscape",
    desc: "Make informed business decisions with our Insightful Patent Landscape analysis.",
    link: "/patent-services/patent_landscape_form",
  },
  {
    image: "/images/banner_img/bg.png",
    title: "Freedom to Patent Portfolio Analysis",
    desc: "Maximize the value of your IP assets with our comprehensive Patent Portfolio Analysis service.",
    link: "/patent-services/patent_portfolio_analysis_form",
  },
  {
    image: "/images/banner_img/bg.png",
    title: "Patent Translation Service",
    desc: "Bridge the language gap and expand your patent's global reach with our precise Patent Translation Service.",
    link: "/patent-services/patent_translation_service_form",
  },
  {
    image: "/images/banner_img/bg.png",
    title: "Patent Illustration",
    desc: "Bring your invention to life with our high-quality Patent illustration service.",
    link: "/patent-services/patent_illustrations_form",
  },
  {
    image: "/images/banner_img/bg.png",
    title: "Patent Watch",
    desc: "Stay informed and protect your IP with our proactive Patent Watch service.",
    link: "/patent-services/patent_watch_form",
  },
  {
    image: "/images/banner_img/bg.png",
    title: "Patent Licensing and Commercialization Services",
    desc: "Unlocking the value of your patents and leveraging innovations for revenue generation and market success.",
    link: "/patent-services/design_patent_form",
  },
];


const MyPage = () => {

  const router = useRouter();

  return (
    <>
    <div className={'card'}>
    <div className={styles.pageTitle}>
        <ul>
          <li>
            <Link href="/">Dashboard</Link>
          </li>
          <li>My Patent Services</li>
        </ul>
      </div>
      <h1 className={styles.heading} style={{
        marginBottom: "50px",
        marginTop: "10px"
      }}>My Patent Services</h1>
          <Grid    container
    rowSpacing={1}
    columnSpacing={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1 }}
  >
  {serviceList.map((service, index) => (
    <Grid item xs={12} md={6} lg={4} xl={4}>
        <ModernCard
          key={index}
          title={service.title}
          description={service.desc} // Use "desc" instead of "description"
          imageSrc={service.image}
          link={service.link}
          className={styles.card}
        />
       </Grid>   
      ))}

      </Grid>
      </div>
      </>

  );
};

export default withAuth(MyPage);