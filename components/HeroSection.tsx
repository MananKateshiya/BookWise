import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";

const steps = [
  { n: "1", title: "Upload PDF", desc: "Add your book file" },
  { n: "2", title: "AI Processing", desc: "We analyze the content" },
  { n: "3", title: "Voice Chat", desc: "Discuss with AI" },
];

const HeroSection = () => {
  return (
    <section className="w-full">
      <div className="library-hero-card">
        <div className="library-hero-content">
          {/* Left: Text & CTA */}
          <div className="library-hero-text">
            <h1 className="library-hero-title">Your Library</h1>
            <p className="library-hero-description">
              Convert your books into interactive AI conversations. Listen,
              learn, and discuss your favorite reads.
            </p>
            <Link href="/book/new" className="library-cta-primary">
              <Plus className="size-5" strokeWidth={2.5} />
              Add new book
            </Link>
          </div>

          {/* Center: Illustration (Unified for both mobile and desktop) */}
          <div className="my-6 flex flex-1 items-center justify-center lg:my-0">
            <Image
              src="/assets/hero-illustration.png"
              alt="Vintage books, open book, globe and lamp"
              width={520}
              height={400}
              priority
              className="h-auto w-full max-w-70 object-contain drop-shadow-[0_12px_20px_rgba(90,60,20,0.2)] sm:max-w-85 lg:max-w-100"
            />
          </div>

          {/* Right: Steps Card */}
          <div className="flex w-full justify-center lg:w-auto lg:justify-end">
            <ol className="library-steps-card w-full max-w-85 space-y-4 shadow-(--shadow-soft) lg:max-w-65">
              {steps.map((s) => (
                <li key={s.n} className="library-step-item">
                  <span className="library-step-number">{s.n}</span>
                  <span className="min-w-0 flex-1">
                    <span className="library-step-title block">{s.title}</span>
                    <span className="library-step-description block">
                      {s.desc}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;