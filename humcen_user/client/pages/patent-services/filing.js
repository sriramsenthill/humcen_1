import React from "react";
import Grid from "@mui/material/Grid";
import Link from "next/link";
import style from "@/styles/PageTitle.module.css";
import RecentOrders from "@/components/Dashboard/eCommerce/RecentOrders";
import SearchForm from "@/components/_App/TopNavbar/SearchForm";
import styles from "@/styles/patent-job.module.css";
import { Button, ButtonProps } from "@mui/material";
import { styled } from "@mui/system"; // Import styled from "@mui/system" instead of "@mui/material/styles"

const ColorButton = styled(Button)(({ theme }) => ({
  color: "white",
  width: "130%",
  height: "55px",
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
          <li>Patent Filing</li>
        </ul>
      </div>

      <div className={styles.container}>
        <img src="/images/patent_filing.png"  />
        <h1 className={style.heading} >Patent Filing</h1>
        <p
          style={{
            maxWidth: "60%",
            fontSize: "16px",
            textAlign: "justify",
            marginBottom: "45px",
          }}
        >
          Don't let your revolutionary ideas go unprotected. Our patent filing
          service ensures that your intellectual property is secure and ready
          for market. With our experienced team of patent experts, we guide you
          through the patent application process, handle all the necessary
          paperwork, and keep you informed every step of the way. Let us help
          you turn your ideas into profitable assets with our reliable patent
          filing service.
        </p>
        <Link href="/patent-services/filing-form/">
          <ColorButton>Apply Now</ColorButton>
        </Link>
      </div>
    </>
  );
}
