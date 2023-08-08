import React from "react";
import Link from "next/link";
import styles from "@/styles/PageTitle.module.css";
import DefaultSelect from "@/components/Forms/AdvancedElements/DefaultSelect";
import RecentBulkOrders from "@/components/Dashboard/eCommerce/RecentBulkOrders";

import withAuth from "@/components/withAuth";

const BulkOrders = () => {
  return (
    <>
      {/* Page title */}
      <div className={styles.pageTitle}>
        <h1>Bulk Orders</h1>
        <ul>
          <li>
            <Link href="/">Dashboard</Link>
          </li>
          <li>Bulk Orders</li>
        </ul>
      </div>
    <RecentBulkOrders />
    </>
  );
};

export default withAuth(BulkOrders);
