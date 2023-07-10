import React from "react";
import Link from "next/link";
import styles from "@/styles/PageTitle.module.css";
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

const SearchPage = () => {
  return (
    <>
      {/* Page title */}
      <div className={styles.pageTitle}>
        <ul>
          <li>
            <Link href="/">Dashboard</Link>
          </li>
          <li>
            <Link href="/patent-services">My Patent Services</Link>
          </li>
          <li>Patent Search</li>
        </ul>
      </div>
      <div className={styles.container}>
        <img
          src="/images/patent_search.png"
        />
      <h1 className={styles.heading}>Patent Search</h1>
      <p
          style={{
            maxWidth: "60%",
            fontSize: "16px",
            textAlign: "justify",
            marginBottom: "45px",
          }}
        >
          Our Patent Search service offers comprehensive and accurate results, safeguarding your intellectual property.
          Our experts meticulously analyze existing patents and relevant sources to identify any conflicts or prior art.
          With our thorough approach, we minimize the risk of patent infringement and maximize your application's success.
          Trust us for precise and reliable Patent Search results, empowering you to confidently pursue your innovative ideas.

        </p>
        <Link href="/patent-services/search_form/">
          <ColorButton>Search Now</ColorButton>
        </Link>
      </div>
    </>
  );
};

export default SearchPage;
