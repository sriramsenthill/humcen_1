import React from 'react';
import PricingPlanStyle1 from '@/components/Pricing/PricingPlanStyle1';
import PricingPlanStyle2 from '@/components/Pricing/PricingPlanStyle2';
import Link from 'next/link';
import styles from '@/styles/PageTitle.module.css';

export default function Pricing() {
  return (
    <>
    <div className='card'>
      {/* Page title */}
      <div className={styles.pageTitle}>
        <ul>
          <li>
            <Link href="/">Dashboard</Link>
          </li>
          <li>Pricing</li>
        </ul>
      </div>
      <div className={styles.pageTitle} style={{padding: "30px 0px"}}>
      <h1>Pricing</h1>
      </div>
      <PricingPlanStyle1 />

      <PricingPlanStyle2 />
      </div>
    </>
  );
}
