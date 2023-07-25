import React from "react";
import styles from "@/styles/nc.module.css";
import { Typography } from "@mui/material";
import { Card } from "@mui/material";
import Link from "next/link";
// Import any other necessary components or styles

const New_cus = () => {
  // You can set up any state or data if needed

  return (
    <>
    <div className={styles.topLine}></div>
    <div className={styles.container}>
      <div className={styles.content}>
        <h1>Your account is now active</h1>
        <Typography className={styles.text1}>
            Browse our services and explore all the ways to use Humcen
        </Typography>

      </div>
      <div className={styles.buttonContainer}>
        <Link href="/patent-services">
        <button className={styles.button}>Our Services</button>
        </Link>
      </div>
    </div>
    <div  className={styles.container2}>
    <h1>
        Get Started with humcen
    </h1>
    </div>
    </>
  );
};

export default New_cus;
