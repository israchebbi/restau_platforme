import HomeNavbar from "../components/home/HomeNavbar";
import Hero from "../components/home/Hero";
import HowItWorks from "../components/home/HowItWorks";
import AppSection from "../components/home/AppSection";
import Footer from "../components/home/Footer";

export default function Home() {
  return (
    <>
      <HomeNavbar />
      <main>
        <Hero />
        <HowItWorks />
        <AppSection />
      </main>
      <Footer />
    </>
  );
}