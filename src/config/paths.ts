export const paths = {
  home: {
    getHref() {
      return "/";
    },
  },
  posts: {
    getHref({ tag, page }: { tag?: string; page?: string | number }) {
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
} as const;
