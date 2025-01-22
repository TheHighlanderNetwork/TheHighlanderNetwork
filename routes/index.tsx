export default function Home() {
  return (
    <div class="px-4 py-8 w-screen h-screen bg-grey-light flex flex-col items-center font-oswald">
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
    </div>
  );
}
