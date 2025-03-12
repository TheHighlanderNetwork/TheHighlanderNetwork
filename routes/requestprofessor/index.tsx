import { Head } from "$fresh/runtime.ts";
import UsernameHeader from "../../islands/UsernameHeader.tsx";
import ProfessorRequestForm from "../../islands/ProfessorRequestForm.tsx";

export default function ProfessorRequestPage() {
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;700&display=swap"
        />
      </Head>
      <div className="font-oswald px-4 py-8 w-screen h-screen bg-grey-light flex flex-col">
        <div className="flex justify-between items-center w-full px-8">
          <a href="/">
            <div className="flex text-2xl font-bold">
              <h1 className="text-yellow">The Highlander&nbsp;</h1>
              <h1 className="text-blue">Network</h1>
            </div>
          </a>
          <UsernameHeader />
        </div>
        <div className="flex flex-col justify-center items-center flex-1 px-8">
          <div className="w-full max-w-xl p-8 bg-white shadow-md rounded-md min-h-[500px] flex flex-col items-center">
            <h2 className="text-xl font-bold mb-4 text-center">
              Professor Request Form
            </h2>
            <hr className="mb-20 bg-grey-light w-full" />
            <ProfessorRequestForm />
          </div>
        </div>
      </div>
    </>
  );
}
