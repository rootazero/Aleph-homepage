import { Hero } from "@/components/home/Hero";
import { Philosophy } from "@/components/home/Philosophy";
import { Architecture } from "@/components/home/Architecture";
import { Features } from "@/components/home/Features";
import { QuickStart } from "@/components/home/QuickStart";

export default function HomePage() {
  return (
    <main className="bg-aleph-deep">
      <Hero />
      <Philosophy />
      <Architecture />
      <Features />
      <QuickStart />
    </main>
  );
}
