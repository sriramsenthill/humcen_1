import React from "react";
import Link from "next/link";
import styles from "@/styles/PageTitle.module.css";
import Card from "@/components/UIElements/Cards/Media";
import Grid from "@mui/material/Grid";
import withAuth from "@/components/withAuth";
import ModernCard from "@/components/ModernCard";


const Projects = () => {
  return (
    <>
    <div className={'card'}>
      {/* Page title */}
      <div className={styles.pageTitle}>
        <ul>
          <li>
            <Link href="/">Dashboard</Link>
          </li>
          <li>Why Us</li>
        </ul>
      </div>
      <h1 className={styles.heading}>Why Us?</h1>
      <h2 style={{ marginTop: 18 }}>
      Global Collaborative Excellence
      </h2>
      <p style={{ fontSize: 15, textAlign:"justify", color:"grey" }}>At HumCen.io, we've curated a platform designed exclusively for intellectual property professionals like you. As a rapidly expanding hub, we bring together skilled individuals from diverse corners of the globe, fostering an environment of cross-border collaboration that's unparalleled in the industry. By joining us, you'll be part of an elite community that thrives on sharing insights, expertise, and innovative ideas, ultimately shaping the future of intellectual property. This is your opportunity to be a catalyst for change, leveraging your unique skills and experiences while working alongside fellow experts on an international scale.</p>
      <div>
      <h2 style={{ marginTop: 18 }}>
      Seize Remote Work Opportunities
      </h2>
        <p style={{ fontSize: 15, textAlign:"justify", color:"grey"}}>
        Embrace the new era of work with HumCen.io. We understand that your expertise shouldn't be limited by geographical boundaries or traditional office spaces. With our platform, you can embrace the freedom of remote work, opening doors to a vast array of projects and collaborations that transcend physical limitations. Imagine working on cutting-edge projects for clients located in different parts of the world, all from the comfort of your chosen workspace. This is your chance to redefine work-life balance, take charge of your schedule, and explore opportunities that align perfectly with your professional aspirations.
        </p>
      </div>
      <div>
      <h2 style={{ marginTop: 18 }}>
      Amplify Your Earnings and Impact
            </h2>
        <p style={{ fontSize: 15, textAlign:"justify", color:"grey"}}>
        HumCen.io isn't just a platform; it's a pathway to amplified success. By becoming a valued IP partner, you're not only gaining access to a network of like-minded professionals, but you're also tapping into a world of increased earnings potential. As cross-border collaborations flourish and your reach expands, so do the possibilities to elevate your income. Moreover, your contributions will have a lasting impact, helping businesses and individuals safeguard their intellectual property rights while driving innovation forward. Join us at HumCen.io to not only grow your career but to also leave an indelible mark on the global intellectual property landscape.          </p>
      </div>
      <h2 style={{ marginTop: 18 }}>
      Join us today and unlock a world of possibilities in the realm of intellectual property. Your expertise deserves a platform that matches your ambition. Embrace the future with HumCen.io and let's shape the world of IP together.      </h2>
      <br></br>
     
      </div>
    </>
  );
};

export default withAuth(Projects);
