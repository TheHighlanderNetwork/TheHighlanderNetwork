import { Head } from "$fresh/runtime.ts";
import UsernameHeader from "../../islands/UsernameHeader.tsx";

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
          <div className="flex text-2xl font-bold">
            <h1 className="text-yellow">The Highlander&nbsp;</h1>
            <h1 className="text-blue">Network</h1>
          </div>

          <div className="flex items-center gap-4">
            <a href="#" className="text-blue hover:underline">
              Add review
            </a>
            <UsernameHeader />
          </div>
        </div>

        <div className="flex flex-1 px-8 pb-8 gap-8">
          <div className="w-1/4 bg-white rounded-md shadow-md p-6">
            <h2 className="text-xl font-bold mb-6">Name</h2>

            <div className="mb-4">
              <input
                type="text"
                placeholder="Search Professor"
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-medium">Categories</label>
              <select className="w-full px-4 py-2 border rounded-md">
                <option value="">All</option>
                <option value="humanities">Humanities</option>
                <option value="sciences">Sciences</option>
                <option value="engineering">Engineering</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 font-medium">Sorting</label>
              <select className="w-full px-4 py-2 border rounded-md">
                <option value="alphabetical">Alphabetical</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>

          <div className="flex-1 bg-white rounded-md shadow-md p-6">
            <h2 className="text-xl font-bold mb-6">Name</h2>

            <div className="flex flex-col gap-6">
              <div className="flex gap-4 items-start">
                <div className="w-20 h-20 bg-gray-300 rounded-md" />
                <div>
                  <h3 className="font-bold text-lg">Professor Name</h3>
                  <p className="text-gray-600">Description</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-20 h-20 bg-gray-300 rounded-md" />
                <div>
                  <h3 className="font-bold text-lg">Professor Name</h3>
                  <p className="text-gray-600">Description</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-20 h-20 bg-gray-300 rounded-md" />
                <div>
                  <h3 className="font-bold text-lg">Professor Name</h3>
                  <p className="text-gray-600">Description</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-20 h-20 bg-gray-300 rounded-md" />
                <div>
                  <h3 className="font-bold text-lg">Professor Name</h3>
                  <p className="text-gray-600">Description</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
