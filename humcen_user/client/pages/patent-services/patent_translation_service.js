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
          <li>Patent Translation Service</li>
        </ul>
      </div>
      <div className={styles.container}>
        <img
          src="/images/response_to_fer.png"
        />
      <h1 className={style.heading}>Patent Translation Service</h1>
        <p
          style={{
            maxWidth: "60%",
            fontSize: "16px",
            textAlign: "justify",
            marginBottom: "45px",
          }}
        >
        We ensure accurate and reliable translation of patent documents in various languages. 
        We understand the critical importance of maintaining the integrity and technical accuracy of patent content during the translation process. 
        Our team of experienced translators, specialized in patent law and industry-specific terminology, deliver high-quality translations that meet the strict standards of patent offices worldwide. 
        With our expertise, we help you effectively communicate your inventions and protect your intellectual property across different linguistic barriers. 
        Trust us for precise and professional Patent Translation services that ensure global patent coverage for your innovations.
        </p>
        <Link
          href="/patent-services/patent_translation_service_form"
          style={{ textDecoration: "none" }}
        >
          <ColorButton>Apply for Patent Translation Service</ColorButton>
        </Link>
      </div>
    </>
  );
}
