import { Head } from "$fresh/runtime.ts";
import HighlanderHome from "../islands/HighlanderHome.tsx";

export default function HomePage() {
  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <HighlanderHome />
    </>
  );
}
