import React from "react";
import Link from "next/link";
import styles from "@/styles/PageTitle.module.css";
import DefaultSelect from "@/components/Forms/AdvancedElements/DefaultSelect";
import RecentBulkOrdersFiles from "@/components/Dashboard/eCommerce/RecentBulkOrdersFiles";

import withAuth from "@/components/withAuth";

const BulkOrderFiles = () => {
  return (
    <>
      {/* Page title */}
      <div className={styles.pageTitle}>
        <h1>Bulk Order Requests</h1>
        <ul>
          <li>
            <Link href="/">Dashboard</Link>
          </li>
          <li>Bulk Order Push</li>
        </ul>
      </div>
    <RecentBulkOrdersFiles />
    </>
  );
};

export default withAuth(BulkOrderFiles);
