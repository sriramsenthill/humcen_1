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
          <li>Patent Illustrations</li>
        </ul>
      </div>
      <div className={styles.container}>
        <img
          src="/images/freedom_to_operate.png"
        />
      <h1 className={style.heading}>Patent Illustrations</h1>
        <p
          style={{
            maxWidth: "60%",
            fontSize: "16px",
            textAlign: "justify",
            marginBottom: "45px",
          }}
        >
        We services offer professional and precise visual representations of your inventions. 
        Our skilled team of illustrators works closely with inventors to create high-quality illustrations that meet the strict guidelines of patent offices. 
        Whether it's utility, design, or flowchart drawings, we ensure that every detail is accurately portrayed. 
        With our expertise in patent illustration, we enhance the visual impact of your patent application, improving its clarity and understanding. 
        Trust us to provide exceptional Patent Illustration services that effectively communicate the unique features of your inventions.

        </p>
        <Link
          href="/patent-services/patent_illustrations_form"
          style={{ textDecoration: "none" }}
        >
          <ColorButton>Apply For Patent Illustrations</ColorButton>
        </Link>
      </div>
    </>
  );
}
