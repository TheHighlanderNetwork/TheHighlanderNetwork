import { Head } from "$fresh/runtime.ts";
import AddBusinessReview from "../../islands/AddBusinessReview.tsx";

export default function SearchPage() {
  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <AddBusinessReview />
    </>
  );
}
