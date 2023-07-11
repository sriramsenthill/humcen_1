import React from 'react';
import ModernCard from "@/components/ModernCard";
import Grid from "@mui/material/Grid";
import styles from "@/styles/PageTitle.module.css";
import { useRouter } from "next/router";
import Link from "next/link";
import withAuth from '@/components/withAuth';
import serviceList from './ServiceListArray';


const MyPage = () => {

  const router = useRouter();

  return (
    <>
    <div className={styles.pageTitle}>
        <ul>
          <li>
            <Link href="/">Dashboard</Link>
          </li>
          <li>My Patent Services</li>
        </ul>
      </div>
      <h1 className={styles.heading} style={{
        marginBottom: "50px",
        marginTop: "10px"
      }}>My Patent Services</h1>
          <Grid
    container
    rowSpacing={1}
    columnSpacing={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 2 }}
  >
      {serviceList.map((service, index) => (
        <ModernCard
          key={index}
          title={service.title}
          description={service.desc} // Use "desc" instead of "description"
          imageSrc={service.image}
          link={service.link}
        />
      ))}
      </Grid>
      </>

  );
};

export default withAuth(MyPage);
export { serviceList };