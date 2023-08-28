import * as React from "react";
import Link from "next/link";
import styles from "@/styles/PageTitle.module.css";
import BasicAccordion from "@/components/UIElements/Accordion/BasicAccordion";
import { Card } from "@mui/material";
import withAuth from "@/components/withAuth";

const Products =() => {
  return (
    <>
    <div className={'card'}>
      <Card style={{ padding: "2em" }}>
        {/* Page title */}
        <div className={styles.pageTitle}>


          <ul>
            <li>
              <Link href="/">Dashboard</Link>
            </li>
            <li>Help & support</li>
          </ul>
        </div>
        <h1 className={styles.heading}>Help & Support</h1>
        <div>
          <h2 className={styles.head}>Contact Information</h2>
          <hr className={styles.line}></hr>
        </div>
        <div>
          <ul className={styles.list}>
            <li>
              <h2 className={styles.emailheading}>Email</h2>
            </li>
            <li>
              <p className={styles.email}>info@humcen.com</p>
            </li>
          </ul>
          <hr className={styles.line} style={{ width: "70%" }}></hr>
          <hr className={styles.line} style={{ width: "70%" }}></hr>
          <div>
            <h2 className={styles.head}>Frequently Asked Qusetions</h2>
            <hr className={styles.line}></hr>
            <BasicAccordion />
          </div>
        </div>
      </Card>
      </div>
    </>
  );
}

export default withAuth(Products)