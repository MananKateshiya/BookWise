import BookCard from "@/components/BookCard";
import HeroSection from "@/components/HeroSection";
import {sampleBooks} from "@/lib/constants";

export default function Home() {
  return (
    <main className="container mx-auto w-full max-w-7xl">
      <HeroSection />

      <div className="library-hero-grid">
        {sampleBooks.map((book) => (
          <BookCard key={book._id}
          title={book.title}
          author={book.author}
          coverURL={book.coverURL}
          slug={book.slug} />
        ))}
      </div>
    </main>
  );
}
