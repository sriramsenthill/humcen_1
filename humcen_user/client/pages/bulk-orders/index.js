import React from "react";
import BulkOrderComponent from "./BulkOrderComponent"
import Link from "next/link";
import styles from "@/styles/PageTitle.module.css";
import withAuth from "@/components/withAuth";

const ProductDetails = () => {
  return (
    <><div className={'card'} >
      {/* Page title */}
      <div className={styles.pageTitle}>
        <ul>
          <li>
            <Link href="/">Dashboard</Link>
          </li>
          <li>Bulk Orders</li>
        </ul>
      </div>
      <h1 className={styles.heading}>Bulk Orders</h1>

     <BulkOrderComponent/>
      </div>
    </>
  );
}

export default withAuth(ProductDetails)