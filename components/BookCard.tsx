import Link from "next/link";
import { BookCardProps } from "@/types";

const BookCard = ({ title, author, coverURL, slug }: BookCardProps) => {
  return <Link href={`/books/${slug}`}>
    <article className="book-card">
      <img src={coverURL} alt={title} className="book-cover" />
      <h3 className="book-title">{title}</h3>
      <p className="book-author">by {author}</p>
    </article>
  </Link>;
};

export default BookCard;
