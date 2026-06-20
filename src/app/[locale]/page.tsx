import { Topbar } from "@/components/home/Topbar";
import { Hero } from "@/components/home/Hero";
import { Marquee } from "@/components/home/Marquee";
import { Manifesto } from "@/components/home/Manifesto";
import { Capabilities } from "@/components/home/Capabilities";
import { Archive } from "@/components/home/Archive";
import { Process } from "@/components/home/Process";
import { AgentsShowcase } from "@/components/home/AgentsShowcase";
import { Differentiators } from "@/components/home/Differentiators";
import { Testimonial } from "@/components/home/Testimonial";
import { Models } from "@/components/home/Models";
import { Faq } from "@/components/home/Faq";
import { Footer } from "@/components/home/Footer";
import { RevealRunner } from "@/components/home/RevealRunner";
import { getStars, getDownloadUrls } from "@/lib/github";

export default async function HomePage() {
  const [stars, downloads] = await Promise.all([getStars(), getDownloadUrls()]);
  return (
    <>
      <Topbar stars={stars} />
      <main>
        <Hero stars={stars} downloads={downloads} />
        <Marquee />
        <Manifesto />
        <div className="wrap"><hr className="hr-soft" /></div>
        <Capabilities />
        <div className="wrap"><hr className="hr-soft" /></div>
        <Archive />
        <div className="wrap"><hr className="hr-soft" /></div>
        <Process />
        <AgentsShowcase />
        <Differentiators />
        <Testimonial />
        <Models />
        <div className="wrap"><hr className="hr-soft" /></div>
        <Faq />
      </main>
      <Footer />
      <RevealRunner />
    </>
  );
}
