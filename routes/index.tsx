import { Head } from "$fresh/runtime.ts";

export default function Home() {
  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div class="px-4 py-8 w-screen h-screen bg-grey-light flex flex-col font-oswald">
        {/* Header */}
        <div className="flex justify-between items-center w-full px-8">
          <a href="/">
            <div className="flex text-2xl font-bold">
              <h1 className="text-yellow">The Highlander&nbsp;</h1>
              <h1 className="text-blue">Network</h1>
            </div>
          </a>
          <div className="flex gap-4">
            <a href="/login">
              <button
                type="button"
                className="px-4 py-2 bg-blue text-white rounded-md text-sm font-medium"
              >
                Login
              </button>
            </a>
            <a href="/signup">
              <button
                type="button"
                className="px-4 py-2 bg-yellow text-white rounded-md text-sm font-medium"
              >
                Sign Up
              </button>
            </a>
          </div>
        </div>

        {/* Main Content */}
        <main class="flex flex-col items-center flex-grow mt-8">
          <div class="max-w-screen-md flex flex-col items-center">
            <div class="flex flex-row text-4xl font-bold text-yellow">
              <h1>The Highlander&nbsp;</h1>
              <h1 class="text-blue">Network</h1>
            </div>
            <div class="flex flex-wrap sm:flex-row flex-col gap-8 text-4xl font-bold text-black justify-center items-center mt-8">
              <div class="flex flex-col items-center">
                <img
                  class="my-6"
                  src="/classes.svg"
                  width="128"
                  height="128"
                  alt="Classes logo"
                />
                <h2>Classes</h2>
              </div>
              <a href="/reviewprofessors">
              <div class="flex flex-col items-center">
                <img
                  class="my-6"
                  src="/professors.svg"
                  width="128"
                  height="128"
                  alt="Professors logo"
                />
                <h2>Professors</h2>
              </div>
              </a>

              <div class="flex flex-col items-center">
                <img
                  class="my-6"
                  src="/businesses.svg"
                  width="128"
                  height="128"
                  alt="Businesses logo"
                />
                <h2>Businesses</h2>
              </div>
            </div>
          </div>
          <div class="flex flex-wrap sm:flex-row flex-col gap-8 text-4xl font-bold text-black justify-center items-center mt-8">
            <div class="flex flex-col items-center">
              <img
                class="my-6"
                src="/housing.svg"
                width="128"
                height="128"
                alt="Housing logo"
              />
              <h2>Housing</h2>
            </div>
            <div class="flex flex-col items-center">
              <img
                class="my-6"
                src="/organizations.svg"
                width="128"
                height="128"
                alt="Organizations logo"
              />
              <h2>Organizations</h2>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
