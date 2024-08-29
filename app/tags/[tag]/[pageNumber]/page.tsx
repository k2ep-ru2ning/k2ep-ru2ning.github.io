import { notFound } from "next/navigation";

type Props = {
  params: {
    tag: string;
    pageNumber: string;
  };
};

export default function PostListInTagPage({ params }: Props) {
  if (!/^\d+$/.test(params.pageNumber)) {
    notFound();
  }

  const tag = decodeURIComponent(params.tag);

  const pageNumber = Number(params.pageNumber);

  return (
    <p>{`태그 "${tag}", page "${pageNumber}"에 속한 글 목록을 표시할 페이지 `}</p>
  );
}
