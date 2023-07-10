import React from "react";
import Link from "next/link";
import styles from "@/styles/PageTitle.module.css";
import RecentOrders from "@/components/Dashboard/eCommerce/RecentOrders";
import withAuth from "@/components/withAuth";

const Inbox = () => {
  return (
    <>
      {/* Page title */}
      <div className={styles.pageTitle}>
        <ul>
          <li>
            <Link href="/">Dashboard</Link>
          </li>
          <li>Job Listing</li>
        </ul>
      </div>
      <RecentOrders />
    </>
  );
}

export default withAuth(Inbox);