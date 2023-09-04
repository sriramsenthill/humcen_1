import React from "react";
import Link from "next/link";
import styles from "@/styles/PageTitle.module.css";
import BulkOrderAssignPage from "@/components/BulkOrderAssignPage";

import withAuth from "@/components/withAuth";

const AssignBulkOrders = () => {
  return (
    <>
      {/* Page title */}
      <div className={styles.pageTitle}>
        <h1>Assign Bulk Orders</h1>
        <ul>
          <li>
            <Link href="/">Dashboard</Link>
          </li>
          <li>Assign Bulk Orders</li>
        </ul>
      </div>
    <BulkOrderAssignPage />
    </>
  );
};

export default withAuth(AssignBulkOrders);
