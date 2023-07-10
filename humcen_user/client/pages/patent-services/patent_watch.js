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
          <li>Patent Watch</li>
        </ul>
      </div>
      <div className={styles.container}>
        <img
          src="/images/patent_landscape.png"
        />
      <h1 className={style.heading}>Patent Watch</h1>
        <p
          style={{
            maxWidth: "60%",
            fontSize: "16px",
            textAlign: "justify",
            marginBottom: "45px",
          }}
        >
        Our Patent Watch services provide comprehensive monitoring and analysis of patent activity in your industry. 
        We keep a vigilant eye on newly published patents and applications, tracking competitors, technological advancements, and potential infringement risks. 
        With our expert team and advanced tools, we deliver timely alerts and detailed reports, enabling you to stay informed and make strategic decisions. 
        Our customized Patent Watch services ensure that you are aware of the latest developments and can protect your intellectual property effectively. 
        Trust us to keep you ahead of the game with our reliable Patent Watch services.
        </p>
        <Link
          href="/patent-services/patent_watch_form"
          style={{ textDecoration: "none" }}
        >
          <ColorButton>Apply For Patent Watch</ColorButton>
        </Link>
      </div>
    </>
  );
}
