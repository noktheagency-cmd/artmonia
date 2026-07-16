import Image from "next/image";
import type { StudentResult } from "@/data/studentResults";

export default function StudentResultCard({ studentName, image, description }: StudentResult) {
  return (
    <article className="student-result-card">
      <div className="student-result-media">
        <Image src={image} alt={`${studentName} — tələbə işi`} width={760} height={560} />
      </div>
      <div className="student-result-copy">
        <h2>{studentName}</h2>
        <p>{description}</p>
      </div>
    </article>
  );
}
