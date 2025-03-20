import { Head } from "$fresh/runtime.ts";
import UsernameHeader from "../../islands/UsernameHeader.tsx";
import ClubCreationForm from "../../islands/ClubCreationForm.tsx";

export default function CreateClubsPage() {
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;700&display=swap"
        />
      </Head>
      <div className="font-oswald min-h-screen flex flex-col bg-grey-light">
        {/* Header */}
        <header className="flex justify-between items-center w-full px-8 py-4">
          <a href="/">
            <div className="flex text-2xl font-bold">
              <h1 className="text-yellow">The Highlander&nbsp;</h1>
              <h1 className="text-blue">Network</h1>
            </div>
          </a>
          <div className="flex items-center gap-4">
            <UsernameHeader />
          </div>
        </header>

        {/* Club Creation Section */}
        <main className="flex flex-col items-center justify-center flex-grow px-6">
          <ClubCreationForm />
        </main>
      </div>
    </>
  );
}
