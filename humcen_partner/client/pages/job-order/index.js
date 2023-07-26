import React from "react";
import Link from "next/link";
import styles from "@/styles/PageTitle.module.css";
import RecentOrders from "@/components/Dashboard/eCommerce/RecentOrders";
import withAuth from "@/components/withAuth";

 function Inbox() {
  return (
    <>
    <div className={'card'}>
      {/* Page title */}
      <div className={styles.pageTitle}>
        <ul>
          <li>
            <Link href="/">Dashboard</Link>
          </li>
          <li>Job Order</li>
        </ul>
      </div>
      <RecentOrders />
      </div>
    </>
  );
}

export default withAuth(Inbox);
