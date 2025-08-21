export const paths = {
  home: {
    getHref() {
      return "/";
    },
  },
  posts: {
    getHref({ tag, page }: { tag?: string; page?: number } = {}) {
      let href = "/posts";

      const searchParams = new URLSearchParams();
      if (tag) {
        searchParams.set("tag", tag);
      }
      if (page) {
        searchParams.set("page", page.toString());
      }
      if (searchParams.size > 0) {
        href += `?${searchParams.toString()}`;
      }

      return href;
    },
  },
  post: {
    getHref(id: string) {
      return `/posts/${id.split("/").map(encodeURIComponent).join("/")}`;
    },
  },
  series: {
    getHref() {
      return "/series";
    },
  },
  seriesDetail: {
    getHref(id: string) {
      return `/series/${encodeURIComponent(id)}`;
    },
  },
} as const;
