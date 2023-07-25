import React from "react";
import ProductDetailsContent from "@/components/eCommerce/ProductDetails/ProductDetailsContent";
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
          <li>Product Details</li>
        </ul>
      </div>
      <h1 className={styles.heading}>Product Details</h1>

      <ProductDetailsContent />
      </div>
    </>
  );
}

export default withAuth(ProductDetails)