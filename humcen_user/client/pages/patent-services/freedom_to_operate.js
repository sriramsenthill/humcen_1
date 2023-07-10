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
          <li>Freedom To Operate Search</li>
        </ul>
      </div>
      <div className={styles.container}>
        <img
          src="/images/freedom_to_operate.png"
        />
      <h1 className={style.heading}>Freedom To Operate Search</h1>
        <p
          style={{
            maxWidth: "60%",
            fontSize: "16px",
            textAlign: "justify",
            marginBottom: "45px",
          }}
        >
          Our Freedom to Operate (FTO) Search service ensures that your innovative ideas can be implemented without infringing on existing patents or intellectual property rights.
          Our experienced team conducts comprehensive searches to identify any potential risks or obstacles that could hinder your commercial activities. 
          With our FTO Search, you gain a clear understanding of the patent landscape related to your technology, enabling you to make informed decisions and mitigate legal risks. 
          Trust us to provide reliable FTO Search results, empowering you to move forward with confidence and avoid costly infringement issues
        </p>
        <Link
          href="/patent-services/freedom_to_operate_form"
          style={{ textDecoration: "none" }}
        >
          <ColorButton>Apply For Freedom to Operate</ColorButton>
        </Link>
      </div>
    </>
  );
}
