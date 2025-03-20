import { Head } from "$fresh/runtime.ts";
import ProfessorInfo from "../../../islands/reviewDisplay/ProfessorInfo.tsx";
import ReviewsIsland from "../../../islands/reviewDisplay/Reviews.tsx";
import Header from "../../../islands/Header.tsx";

export default function CoursePage({ params }: { params: { net_id: string } }) {
  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="font-oswald min-h-screen bg-grey-light flex flex-col">
        <Header />
        <div className="max-w-3xl mx-auto p-6 bg-white">
          <ProfessorInfo netid={params.net_id} />

          <ReviewsIsland
            query={{ reviewee: params.net_id, type: 1 }}
          />
        </div>
      </div>
    </>
  );
}
