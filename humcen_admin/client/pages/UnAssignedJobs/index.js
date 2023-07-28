import React from "react";
import Link from "next/link";
import styles from "@/styles/PageTitle.module.css";

import UnAssignedJobs from "@/components/Dashboard/eCommerce/UnAssignedJobs";

import withAuth from "@/components/withAuth";

const Projects = () => {
  return (
    <>
      {/* Page title */}
      <div className={styles.pageTitle}>
        <h1>Un-Assigned Jobs</h1>
        <ul>
          <li>
            <Link href="/">Dashboard</Link>
          </li>
          <li>Un-Assigned Jobs</li>
        </ul>
      </div>
      <UnAssignedJobs/>
    </>
  );
};

export default withAuth(Projects);
