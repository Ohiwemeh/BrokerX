import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Platform from "../components/Platform";
import Articles from "../components/Articles";
import Footer from "../components/Footer";
import CryptoPrices from "../components/CryptoPrices";

export default function Landing() {
  return (
    <div className="min-h-screen bg-white text-slate-800">
      <Navbar />
      <main className="pt-16">
        <Hero />
        <Features />
        <CryptoPrices/>
        <Platform />
        <Articles />
        <Footer />
      </main>
    </div>
  );
}
