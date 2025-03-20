import { Head } from "$fresh/runtime.ts";
import { PageProps } from "$fresh/server.ts";
import SearchWrapper from "../../islands/SearchWrapper.tsx";

export default function SearchPage({ url }: PageProps) {
  const searchParams = new URL(url).searchParams;
  const query = searchParams.get("query") || "";

  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <SearchWrapper initialQuery={query} />
    </>
  );
}
