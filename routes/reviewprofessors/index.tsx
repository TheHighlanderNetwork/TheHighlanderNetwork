import { Head } from "$fresh/runtime.ts";
import UsernameHeader from "../../islands/UsernameHeader.tsx";
import ProfessorReviews from "../../islands/ProfessorReviews.tsx";
import AddReviewModal from "../../islands/AddProfessorReview.tsx";

export default function ProfessorReviewsPage() {
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;700&display=swap"
        />
      </Head>
      <div className="font-oswald w-screen h-screen bg-grey-light flex flex-col">
        <div className="flex justify-between items-center w-full px-8 py-4">
          <a href="/">
            <div className="flex text-2xl font-bold">
              <h1 className="text-yellow">The Highlander&nbsp;</h1>
              <h1 className="text-blue">Network</h1>
            </div>
          </a>
          <div className="flex items-center gap-4">
            <AddReviewModal />
            <UsernameHeader />
          </div>
        </div>
        <ProfessorReviews />
      </div>
    </>
  );
}
