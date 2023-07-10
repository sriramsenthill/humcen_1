import React from "react";
import Link from "next/link";
import styles from "@/styles/PageTitle.module.css";
import RecentPartners from "@/components/Dashboard/eCommerce/RecentPartner";
import withAuth from "@/components/withAuth";

const Projects = () => {
  return (
    <>
      {/* Page title */}
      <div className={styles.pageTitle}>
        <h1>Partners</h1>
        <ul>
          <li>
            <Link href="/">Dashboard</Link>
          </li>
          <li>Partners</li>
        </ul>
      </div>
      <RecentPartners />
    </>
  );
};

export default withAuth(Projects);
