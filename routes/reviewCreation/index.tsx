import { Head } from "$fresh/runtime.ts";
import ReviewIsland from "../../islands/CreateReviewIsland.tsx";

export default function Home() {
  return (
    <>
      <Head>
        <title>Review Page</title>
      </Head>
      
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <h1 className="text-3xl font-bold mb-4">Submit a Review</h1>
        
        <ReviewIsland />
      </div>
    </>
  );
}
