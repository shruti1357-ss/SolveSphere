import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import Stats from "../components/landing/Stats";
import HowItWorks from "../components/landing/HowItWorks";
import Features from "../components/landing/Features";
import ReportProblemSection from "./ReportProblem";
import Footer from "../components/landing/Footer";

const LandingPage = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <Stats />
      <HowItWorks />
      <Features />
      {/* <ReportProblemSection /> */}
      <Footer />
    </>
  );
};

export default LandingPage;