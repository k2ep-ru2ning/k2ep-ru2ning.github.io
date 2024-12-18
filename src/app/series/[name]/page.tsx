import Link from "next/link";
import { notFound } from "next/navigation";
import ListHeading from "@/components/list-heading";
import ListSection from "@/components/list-section";
import TagList from "@/components/tag-list";
import { getPostsBySeries } from "@/service/posts";
import { getSeriesByName } from "@/service/series";
import { formatDate } from "@/utils/date-formatter";

type Props = {
  params: {
    name: string;
  };
};

export default async function SeriesDetailPage({ params }: Props) {
  const seriesName = decodeURIComponent(params.name);

  const series = await getSeriesByName(seriesName);

  if (!series) {
    notFound();
  }

  const postsOnSeries = await getPostsBySeries(series.name);

  return (
    <ListSection>
      <ListHeading>
        &quot;
        <strong className="underline decoration-wavy decoration-indigo-500">
          {series.name}
        </strong>
        &quot; 시리즈
      </ListHeading>
      {series.description ? (
        <p className="p-2 rounded-md bg-zinc-200 dark:bg-zinc-800">
          {series.description}
        </p>
      ) : null}
      <ul className="flex flex-col gap-8">
        {postsOnSeries.map((post, idx) => (
          <li key={post.absoluteUrl}>
            <div className="inline-block min-w-12 rounded-t-md border border-b-0 border-zinc-300 dark:border-zinc-700 px-2 py-0.5 font-bold text-2xl after:content-['.']">
              {idx + 1}
            </div>
            <div className="p-2 flex flex-col gap-3 rounded-b-md border border-zinc-300 dark:border-zinc-700">
              <Link
                href={post.absoluteUrl}
                className="flex flex-col gap-3 hover:text-indigo-500 transition-colors"
              >
                <h3 className="font-bold text-xl">{post.title}</h3>
                {post.description.length > 0 ? <p>{post.description}</p> : null}
              </Link>
              <time className="text-sm text-zinc-700 dark:text-zinc-300">
                {formatDate(post.createdAt)}
              </time>
              {post.tags ? <TagList tags={post.tags} /> : null}
            </div>
          </li>
        ))}
      </ul>
    </ListSection>
  );
}
