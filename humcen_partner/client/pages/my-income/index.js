import React from "react";
import Link from "next/link";
import styles from "@/styles/PageTitle.module.css";
import MyIncome from "@/components/MyIncome";
import withAuth from "@/components/withAuth";

function ContactList() {
  return (
    <>
    <div className={'card'}>
      {/* Page title */}
      <div className={styles.pageTitle}>
        <ul>
          <li>
            <Link href="/">Dashboard</Link>
          </li>
          <li>My Income</li>
        </ul>
      </div>
      <br></br>
      <MyIncome />
      <br></br>
      </div>
    </>
  );
}

export default withAuth(ContactList);
