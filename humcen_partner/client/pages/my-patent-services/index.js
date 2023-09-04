import React, { useEffect, useState } from 'react';
import axios from "axios";
import ModernCard from "@/components/ModernCard";
import AddCard from '@/components/AddCard';
import Grid from "@mui/material/Grid";
import styles from "@/styles/PageTitle.module.css";
import { useRouter } from "next/router";
import Link from "next/link";
import withAuth from '@/components/withAuth';
import serviceList from './ServiceListArray';


const MyPage = () => {
  const router = useRouter();
  const [services, setServices] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:3000/api/partner/fields", {
          headers: {
            Authorization: token,
          },
        })
        .then((response) => {
          const fields = response.data;
          const servicee = [];
          Object.keys(fields).forEach((field) => {
            if(fields[field] === true){
            servicee.push(field);
            }
          })
          const filteredServices = serviceList.filter(service => servicee.includes(service.title));
          setServices(filteredServices);
        })
        .catch((error) => {
          console.error("Error fetching profile Settings:", error);
        });
    }
  }, []);

  return (
    <>
    <div className={'card'}>
      <div className={styles.pageTitle}>
        <ul>
          <li>
            <Link href="/">Dashboard</Link>
          </li>
          <li>Patent Services</li>
        </ul>
      </div>
      <h1 className={styles.heading} style={{
        marginBottom: "30px",
        marginTop: "10px"
      }}>My Patent Services</h1>
      <Grid
        container
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 2 }}
      >
        {services.map((service, index) => (
              <Grid item xs={12} md={6} lg={4} xl={4}>

          <ModernCard
            key={index}
            title={service.title}
            description={service.desc} // Use "desc" instead of "description"
            imageSrc={service.image}
            link={service.link}
          />
          </Grid>

        ))}
        <AddCard
            key="Add"
            title="Add Services"
            imageSrc="/images/patent_img/add.png"
        />

      </Grid>
      </div>
    </>
  );
};

export default withAuth(MyPage);
