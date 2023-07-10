import React from "react";
import Link from "next/link";
import style from "@/styles/PageTitle.module.css";
import styles from "@/styles/patent-job.module.css";
import { Button, ButtonProps } from "@mui/material";
import { styled } from "@mui/system";

const ColorButton = styled(Button)(({ theme }) => ({
  color: "white",
  width: "150%",
  height: "58px",
  borderRadius: "100px",
  marginBottom: "30px",
  background: "linear-gradient(270deg, #02E1B9 0%, #00ACF6 100%)",
  "&:hover": {
    background: "linear-gradient(270deg, #02E1B9 0%, #00ACF6 100%)",
  },
  textTransform: "none",
  fontSize: "14px",
  fontWeight: "400",
}));

export default function Inbox() {
  return (
    <>
      {/* Page title */}
      <div className={style.pageTitle}>
        <ul className={style.header}>
          <li>
            <Link href="/">Dashboard</Link>
          </li>
          <li>
            <Link href="/patent-services">My Patent Services</Link>
          </li>
          <li>Patent Licensing and Commercialization services</li>
        </ul>
      </div>
      <div className={styles.container}>
        <img
          src="/images/patent_portfolio_analysis.png"
        />
      <h1 className={style.heading}>Patent Licensing and Commercialization services</h1>
        <p
          style={{
            maxWidth: "60%",
            fontSize: "16px",
            textAlign: "justify",
            marginBottom: "45px",
          }}
        >
        With our expertise and industry knowledge, we help you effectively monetize your innovations and navigate the complex landscape of licensing and commercialization. 
        Our team identifies strategic licensing opportunities, conducts negotiations, and drafts customized licensing agreements to maximize revenue generation. 
        We guide you through the entire process, ensuring optimal market penetration and protecting your intellectual property rights. 
        Trust us to unlock the value of your patents and drive commercial success in the competitive marketplace.
        </p>
        <Link
          href="/patent-services/design_patent_form"
          style={{ textDecoration: "none" }}
        >
          <ColorButton>Apply For Patent Licensing and Commercialization Services</ColorButton>
        </Link>
      </div>
    </>
  );
}
