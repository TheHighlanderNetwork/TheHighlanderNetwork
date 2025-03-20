import { Head } from "$fresh/runtime.ts";
import Header from "../../../islands/Header.tsx";
import CourseInfo from "../../../islands/reviewDisplay/ClubInfo.tsx";
import ReviewsIsland from "../../../islands/reviewDisplay/Reviews.tsx";

export default function CoursePage(
  { params }: { params: { club_id: string } },
) {
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
          <CourseInfo club_id={params.club_id} />

          <ReviewsIsland query={{ reviewee: params.club_id, type: 4 }} />
        </div>
      </div>
    </>
  );
}
