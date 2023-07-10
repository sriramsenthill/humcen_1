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
          <li>Patent Portfolio Analysis</li>
        </ul>
      </div>
      <div className={styles.container}>
        <img
          src="/images/patent_portfolio_analysis.png"
        />
      <h1 className={style.heading}>Patent Portfolio Analysis</h1>
        <p
          style={{
            maxWidth: "60%",
            fontSize: "16px",
            textAlign: "justify",
            marginBottom: "45px",
          }}
        >
        We offers a thorough assessment of your intellectual property assets. 
        Our experienced team meticulously evaluates your patent portfolio, examining the strength, value, and alignment with your business objectives. Through this analysis, we identify opportunities for portfolio optimization, such as identifying valuable patents, pruning non-strategic assets, and exploring licensing or monetization options. 
        With our detailed insights and recommendations, you can make informed decisions to maximize the strategic value of your patent portfolio, protect your innovations, and drive business growth. 
        Trust us to unlock the full potential of your patent assets.
  
        </p>
        <Link
          href="/patent-services/patent_portfolio_analysis_form"
          style={{ textDecoration: "none" }}
        >
          <ColorButton>Apply for Patent Portfolio Analysis</ColorButton>
        </Link>
      </div>
    </>
  );
}
