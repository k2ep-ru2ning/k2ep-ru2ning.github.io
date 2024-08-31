import { Tag } from "lucide-react";
import Link from "next/link";

export default function TagsLink() {
  return (
    <Link
      href="/tags"
      className="hover:bg-gray-200 dark:hover:bg-gray-700 w-8 h-8 flex justify-center items-center rounded-md"
    >
      <Tag size={24} />
    </Link>
  );
}
