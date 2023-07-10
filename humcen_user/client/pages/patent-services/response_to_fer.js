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
          <li>Response to FER/Office Action</li>
        </ul>
      </div>
      <div className={styles.container}>
        <img
          src="/images/response_to_fer.png"
        />
      <h1 className={style.heading}>Response to FER/Office Action</h1>
        <p
          style={{
            maxWidth: "60%",
            fontSize: "16px",
            textAlign: "justify",
            marginBottom: "45px",
          }}
        >
          We ensures a strong and effective response to address objections and rejections raised by the patent examiner. 
          Our experienced team meticulously analyzes the FER/Office Action, strategizes the response, and prepares persuasive arguments, amendments, and supporting evidence to enhance the patentability of your invention. 
          We understand the importance of a timely and comprehensive response to maximize the chances of success. 
          Trust us to navigate the complexities of the patent examination process and secure the approval of your patent application.

        </p>
        <Link
          href="/patent-services/response_to_fer_form/"
          style={{ textDecoration: "none" }}
        >
          <ColorButton>Apply For Response to FER/Office Action</ColorButton>
        </Link>
      </div>
    </>
  );
}
