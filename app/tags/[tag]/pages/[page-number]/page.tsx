import PageController from "@/app/_component/page-controller/page-controller";
import PostListItem from "@/app/_component/post-list-item";
import { getSortedPostsByTag, getTags } from "@/app/_lib/post";
import { notFound } from "next/navigation";

type Props = {
  params: {
    tag: string;
    "page-number": string;
  };
};

const PAGE_SIZE = 5;

export default async function PostListInTagPage({ params }: Props) {
  if (!/^\d+$/.test(params["page-number"])) {
    notFound();
  }

  const tag = decodeURIComponent(params.tag);

  const pageNumber = Number(params["page-number"]);

  const posts = await getSortedPostsByTag(tag);

  const numberOfPages = Math.ceil(posts.length / PAGE_SIZE);

  if (pageNumber < 1 || pageNumber > numberOfPages) {
    notFound();
  }

  const firstPostIndexOfCurrentPage = (pageNumber - 1) * PAGE_SIZE;

  const postsOfCurrentPage = posts.slice(
    firstPostIndexOfCurrentPage,
    firstPostIndexOfCurrentPage + PAGE_SIZE,
  );

  return (
    <section className="py-3 md:py-4 flex flex-col gap-2">
      <h2 className="font-bold text-2xl">{`태그 "${tag}"에 속한 글 목록 ${pageNumber}`}</h2>
      <ul className="divide-y divide-gray-500 dark:divide-gray-400">
        {postsOfCurrentPage.map((post) => (
          <PostListItem key={post.path} post={post} />
        ))}
      </ul>
      <PageController
        basePath={`/tags/${tag}/pages`}
        currentPageNumber={pageNumber}
        numberOfPages={numberOfPages}
      />
    </section>
  );
}

export async function generateStaticParams() {
  const tags = await getTags();
  const params: Props["params"][] = [];
  for (const tag of tags) {
    const posts = await getSortedPostsByTag(tag);
    const numberOfPage = Math.ceil(posts.length);
    for (let pageNumber = 1; pageNumber <= numberOfPage; pageNumber++) {
      params.push({
        tag,
        "page-number": String(pageNumber),
      });
    }
  }
  return params;
}
