import * as React from "react";
import Link from 'next/link';
import styles from '@/styles/PageTitle.module.css'
import withAuth from "@/components/withAuth";

const Products = () => {

  return (
    <>
      {/* Page title */}
      <div className={styles.pageTitle}>
        
        <h1 className={styles.pageh}>Help & Support</h1>
        
        <ul>
          <li>
            <Link href="/">Dashboard</Link>
          </li>
          <li>Help & support</li>
        </ul>
      </div>
      <div>
      <h2 className={styles.heading}>Contact Information</h2>
      <hr className={styles.line}></hr>
      </div>
      <div>
      <ul className={styles.list}>
      <li><h2 className={styles.emailheading}>Email</h2></li>
      <li><h3 className={styles.email}>info@humcen.com</h3></li>
      </ul>
      <hr className={styles.line}></hr>
      <div>
      <h2 className={styles.heading}>Frequently Asked Qusetions</h2>
      <hr className={styles.line}></hr>
      </div>
      
      </div>
    </>
  );
}

export default withAuth(Products);