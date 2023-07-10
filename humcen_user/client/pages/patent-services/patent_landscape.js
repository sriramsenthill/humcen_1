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
          <li>Patent Landscape</li>
        </ul>
      </div>
      <div className={styles.container}>
        <img
          src="/images/patent_landscape.png"
        />
      <h1 className={style.heading}>Patent Landscape</h1>
        <p
          style={{
            maxWidth: "60%",
            fontSize: "16px",
            textAlign: "justify",
            marginBottom: "45px",
          }}
        >
        Our Patent Landscape service provides a comprehensive analysis of the intellectual property landscape in your field. 
        Our expert team conducts extensive research to identify existing patents, emerging trends, and potential competitors. 
        By understanding the patent landscape, you gain valuable insights to make informed business decisions, identify white spaces for innovation, and assess the patentability of your ideas. 
        With our detailed reports and visual representations, you stay ahead of the competition and maximize the strategic value of your intellectual property portfolio. 
        Trust us to navigate the complex patent landscape and unlock opportunities for growth and success.

        </p>
        <Link
          href="/patent-services/patent_landscape_form"
          style={{ textDecoration: "none" }}
        >
          <ColorButton>Apply For Patent Landscape</ColorButton>
        </Link>
      </div>
    </>
  );
}
