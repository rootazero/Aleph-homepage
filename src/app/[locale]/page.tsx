import { Topbar } from "@/components/home/Topbar";
import { Hero } from "@/components/home/Hero";
import { Marquee } from "@/components/home/Marquee";
import { Manifesto } from "@/components/home/Manifesto";
import { Capabilities } from "@/components/home/Capabilities";
import { Archive } from "@/components/home/Archive";
import { Process } from "@/components/home/Process";
import { AgentsShowcase } from "@/components/home/AgentsShowcase";
import { Testimonial } from "@/components/home/Testimonial";
import { Models } from "@/components/home/Models";
import { Faq } from "@/components/home/Faq";
import { Footer } from "@/components/home/Footer";
import { RevealRunner } from "@/components/home/RevealRunner";

export default function HomePage() {
  return (
    <>
      <Topbar />
      <main>
        <Hero />
        <Marquee />
        <Manifesto />
        <div className="wrap"><hr className="hr-soft" /></div>
        <Capabilities />
        <div className="wrap"><hr className="hr-soft" /></div>
        <Archive />
        <div className="wrap"><hr className="hr-soft" /></div>
        <Process />
        <AgentsShowcase />
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
