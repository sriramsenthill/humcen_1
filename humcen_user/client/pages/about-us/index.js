import React from "react";
import Link from "next/link";
import styles from "@/styles/PageTitle.module.css";
import ModernCard from "@/components/Educard.js";
import Card from "../../components/Cards.js";
import Grid from "@mui/material/Grid";
import withAuth from "@/components/withAuth.js";
import { textAlign } from "@mui/system";

const serviceList = [
  {
    image: "/images/patent_img/11.jpg",
    title: "Patent Consultation",
    desc: "Discover the power of Patent Consultation! Our expert team is here to help you harness the full potential of your invention. With tailored advice and guidance, we aim to maximize the value of your intellectual property. Whether you're an individual innovator or a business looking to protect your unique ideas, we've got you covered.",
    desc1:"Benefit from our comprehensive expertise in patent law, strategy, and protection.Our streamlined consultation process ensures you receive the support you need to navigate the complexities of patenting. Start your journey towards securing and capitalizing on your innovative creations. Connect with us today!",
    link: "../patent-services/consultationform",
  },
  {
    image: "/images/patent_img/2.jpg",
    title: "Patent Drafting",
    desc: "Unlock the power of Patent Drafting and turn your innovative ideas into formidable patents with our expert service. Our team of experienced professionals will guide you through the complex process, ensuring your intellectual property is protected and solidified.",
    desc1: "Whether you're an individual inventor or a thriving business, we'll provide tailored solutions to maximize the strength and value of your patents. With a meticulous approach and comprehensive knowledge of patent law, we're committed to safeguarding your creativity and empowering you to succeed in the competitive market. Transform your concepts into concrete assets with our trusted Patent Drafting service.",
    link: "/patent-services/drafting-form",
  },
  {
    image: "/images/patent_img/3.jpg",
    title: "Patent Filing",
    desc: "Safeguard your innovative ideas with ease through our hassle-free patent filing service. Entrust us with the complexities of the patent application process while you focus on what matters most – your innovations. Our expert team streamlines the entire journey, from initial consultation to submission, ensuring a smooth and efficient process.",
    desc1:"Whether you're an individual inventor or a visionary enterprise, we provide tailored solutions to protect your intellectual property. Don't let your groundbreaking ideas go unprotected; secure their future value and market potential with our reliable and dedicated Patent Filing service. Take the first step towards a promising future today.",
    link: "/patent-services/filing-form",
  },
  {
    image: "/images/patent_img/1.jpg",
    title: "Patent Search",
    desc: "Unlock the true potential of your invention through our comprehensive and in-depth Patent Search service. Our expert team delves deep into the vast patent database to identify existing patents and similar technologies, ensuring your innovation stands out from the crowd.",
    desc1: "With meticulous attention to detail, we provide you with valuable insights, enabling you to make informed decisions and refine your ideas for maximum impact. Whether you're an individual innovator or a pioneering organization, our tailored approach caters to your specific needs. Discover a world of possibilities and secure your path to success with our reliable Patent Search service today.",
    link: "/patent-services/search_form",
  },
  {
    image: "/images/patent_img/4.jpg",
    title: "Response to FER/Office Action",
    desc: "Enhance your odds of securing a patent grant with our specialized and expert Response to FER service. Our seasoned team meticulously analyzes and addresses the Patent Office's examination reports, addressing any objections or rejections. With a strategic approach and comprehensive understanding of patent law, we craft persuasive responses that strengthen your patent application.",
    desc1:" Whether you're an individual inventor or a forward-thinking company, our tailored solutions cater to your unique needs. Elevate your chances of success and maximize the value of your intellectual property with our reliable and dedicated Response to FER/Office Action service. Take the next step towards patent success today.",
    link: "/patent-services/response_to_fer_form",
  },
  {
    image: "/images/patent_img/6.jpg",
    title: "Freedom To Operate Search",
    desc: "Mitigate potential legal hurdles and minimize risks with our comprehensive FTO Search service. Our expert team conducts a thorough analysis of existing patents and intellectual property, ensuring your innovations can proceed without infringement concerns. By identifying possible roadblocks, we empower you to make informed decisions and navigate the market with confidence.",
    desc1:" Whether you're an individual entrepreneur or a growing enterprise, our tailored approach caters to your specific requirements. Secure the freedom to operate and unleash your creativity with our reliable and dedicated FTO Search service. Take proactive steps towards success and protect your intellectual property today.",
    link: "/patent-services/freedom_to_operate_form",
  },
  {
    image: "/images/patent_img/7.jpg",
    title: "Freedom to Patent Landscape",
    desc: "Empower your business with insightful patent landscape analysis through our specialized service. Our expert team conducts comprehensive research to provide you with a clear understanding of the patent landscape in your industry. By identifying key trends, competitors, and potential opportunities, we equip you with valuable information to make informed business decisions.",
    desc1:" Whether you're a startup or an established company, our tailored approach caters to your specific needs. Stay ahead of the competition and maximize the value of your intellectual property with our reliable and dedicated Freedom to Patent Landscape service. Take the next step towards strategic success today.",
    link: "/patent-services/patent_landscape_form",
  },
  {
    image: "/images/patent_img/8.jpg",
    title: "Freedom to Patent Portfolio Analysis",
    desc: " Unlock the full potential of your intellectual property assets with our comprehensive Patent Portfolio Analysis service. Our expert team conducts in-depth research and evaluation of your patent portfolio, providing you with valuable insights and strategic recommendations. From identifying valuable patents to optimizing your portfolio's value, we help you make informed decisions that align with your business goals.",
    desc1:" Whether you're an individual inventor or a global corporation, our tailored approach caters to your specific needs. Maximize the strength and impact of your IP assets with our reliable and dedicated Freedom to Patent Portfolio Analysis service. Secure your path to success today.",
    link: "/patent-services/patent_portfolio_analysis_form",
  },
  {
    image: "/images/patent_img/9.jpg",
    title: "Patent Translation Service",
    desc: "Connect with a global audience and expand your patent's reach with our precise and professional Patent Translation Service. Our expert team of linguists ensures accurate and culturally sensitive translations of your patent documents, eliminating language barriers and maximizing your patent's impact in international markets.",
    desc1: " Whether you're seeking to enter new territories or enforce existing patents abroad, our tailored approach caters to your specific needs. With a keen eye for technical detail and legal terminology, we deliver top-notch translations that maintain the integrity of your patent's content. Bridge the language gap and unlock new opportunities with our reliable and dedicated Patent Translation Service. Take the first step towards global success today.",
    link: "/patent-services/patent_translation_service_form",
  },
  {
    image: "/images/patent_img/10.jpg",
    title: "Patent Illustration",
    desc: "Breathe life into your invention with our high-quality Patent Illustration service. Our skilled team of illustrators and designers transforms your ideas into visually compelling and accurate representations. With meticulous attention to detail and adherence to patent office guidelines, we create illustrations that enhance the clarity and understanding of your innovation. Whether you need detailed technical drawings or conceptual diagrams, our tailored approach caters to your specific requirements.",
    desc1: " From individual inventors to thriving enterprises, we provide customized solutions to suit your needs. Elevate your patent application and captivate stakeholders with our reliable and dedicated Patent Illustration service. Unleash the potential of your invention today.",
    link: "/patent-services/patent_illustrations_form",
  },
  {
    image: "/images/patent_img/5.jpg",
    title: "Patent Watch",
    desc: "Stay one step ahead and safeguard your intellectual property with our proactive Patent Watch service. Our expert team diligently monitors patent databases and relevant publications, keeping a keen eye on potential infringements or competitors' activities. By providing timely alerts and detailed analysis, we empower you to take swift action and protect your innovative ideas.",
    desc1: " Whether you're an individual inventor or a growing business, our tailored approach caters to your specific needs. Maintain the security of your IP assets and defend your market position with our reliable and dedicated Patent Watch service. Stay informed and safeguard your future success today.",
    link: "/patent-services/patent_watch_form",
  },
  {
    image: "/images/patent_img/12.jpg",
    title: "Patent Licensing and Commercialization Services",
    desc: "Unleash patent potential for revenue generation and market success. Our expert team excels in licensing and commercializing innovations, connecting inventors with strategic partners. Tailored strategies maximize patent value for startups and established companies alike. Propel your innovations towards commercial triumph with our reliable and dedicated services.",
    desc1: "Maximize patent value with tailored strategies for startups and established companies. Propel innovations towards commercial success with our dedicated services.",
    link: "/patent-services/design_patent_form",
  },
];

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
          <li>About Us</li>
        </ul>
      </div>
      <h1 className={styles.heading}>About Us</h1>
      <p style={{color:"grey", fontSize:"20px", marginTop: 20, textAlign:"justify"}}>
      Welcome to HumCen.io – a collaborative endeavor undertaken by a group of dedicated IP specialists and passionate tech enthusiasts, all united with a common goal: to revolutionize the realm of Intellectual Property. <br/> <br/>

At HumCen.io, we've harnessed our collective expertise to reshape the way Intellectual Property is navigated. Our platform serves as a catalyst for seamless cross-border IP journeys, catering to the needs of innovators, businesses, and IP professionals alike. <br/> <br/>

We take pride in offering a comprehensive suite of tools that empower you in every step of your IP endeavors, from safeguarding to asset management and even monetization.<br/> <br/>

Our mission is to provide a nurturing ecosystem where innovation thrives and where Intellectual Property is not just protected, but elevated. Through cutting-edge technology and a deep-rooted commitment to excellence, we're here to redefine how IP is perceived and utilized in today's dynamic landscape. <br/> <br/>

Join us on this transformative expedition and be a part of the future of Intellectual Property.
      </p>
    
      <br></br>
     
      <br></br>
      
      </div>
    </>
  );
};

export default withAuth(Projects);
