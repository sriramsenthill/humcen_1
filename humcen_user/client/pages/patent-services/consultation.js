import React from "react";
import Link from "next/link";
import style from "@/styles/PageTitle.module.css";
import styles from "@/styles/patent-job.module.css";
import { Button, ButtonProps } from "@mui/material";
import { styled } from "@mui/system"; // Import styled from "@mui/system" instead of "@mui/material/styles"

const ColorButton = styled(Button)(({ theme }) => ({
  color: "white",
  width: "80%",
  height: "60px",
  borderRadius: "30px",
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
          <li>Patent Consultation</li>
        </ul>
      </div>
      
      <div className={styles.container}>
        <img src="/images/patent_consult.png"/>
        <h1 className={style.heading}>Patent Consultation</h1>
        <p
          style={{
            maxWidth: "60%",
            fontSize: "16px",
            textAlign: "justify",
            marginBottom: "45px",
          }}
        >
          Get expert advice and guidance on protecting your intellectual
          property with our patent consultation service. Our team of experienced
          professionals will help you navigate the complex world of patents and
          provide tailored solutions to safeguard your ideas and inventions.
        </p>
        <Link href="/patent-services/consultationform">
          <ColorButton>Schedule A Consultation</ColorButton>
        </Link>
      </div>
    </>
  );
}
