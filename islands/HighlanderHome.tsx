"use client";
import { useState } from "preact/hooks";
import UsernameHeader from "./UsernameHeader.tsx";
import SearchBox from "./SearchBox.tsx";
import Filters from "./Filters.tsx";

export default function HighlanderHome() {
  const [bitfield, setBitfield] = useState(0b1100);

  function handleFilterChange(newBitfield: number) {
    setBitfield(newBitfield);
    console.log("Filters changed. New bitfield:", newBitfield);
  }

  function handleSearch(userQuery: string) {
    const encoded = encodeURIComponent(userQuery);
    globalThis.location.href = `/searchwrapper?query=${encoded}`;
  }

  return (
    <div className="w-screen h-screen bg-grey-light flex flex-col font-oswald">
      <header className="flex items-center justify-between w-full bg-white px-8 py-4 shadow-sm">
        <a href="/">
          <div className="flex text-2xl font-bold">
            <h1 className="text-yellow">The Highlander&nbsp;</h1>
            <h1 className="text-blue">Network</h1>
          </div>
        </a>
        <UsernameHeader />
      </header>

      <main className="flex flex-col items-center flex-grow mt-8 px-4">
        <div className="max-w-screen-md w-full flex flex-col items-center">
          <div className="flex flex-row text-6xl font-bold text-yellow justify-center">
            <h1>The Highlander&nbsp;</h1>
            <h1 className="text-blue">Network</h1>
          </div>

          <div className="mt-8 w-full max-w-xl flex flex-col gap-4">
            <SearchBox onResults={(q) => handleSearch(q)} />
            <Filters
              onFilterChange={handleFilterChange}
              initialBitfield={bitfield}
            />
          </div>

          <div className="flex flex-wrap sm:flex-row flex-col gap-8 text-4xl font-bold text-black justify-center items-center mt-8">
            <div className="flex flex-col items-center">
              <img
                className="my-6"
                src="/classes.svg"
                width="128"
                height="128"
                alt="Classes logo"
              />
              <h2>Classes</h2>
            </div>
            <a href="/reviewprofessors">
              <div className="flex flex-col items-center">
                <img
                  className="my-6"
                  src="/professors.svg"
                  width="128"
                  height="128"
                  alt="Professors logo"
                />
                <h2>Professors</h2>
              </div>
            </a>
            <a href="/createbusiness">
              <div className="flex flex-col items-center">
                <img
                  className="my-6"
                  src="/businesses.svg"
                  width="128"
                  height="128"
                  alt="Businesses logo"
                />
                <h2>Businesses</h2>
              </div>
            </a>
          </div>

          <div className="flex flex-wrap sm:flex-row flex-col gap-8 text-4xl font-bold text-black justify-center items-center mt-8">
            <div className="flex flex-col items-center">
              <img
                className="my-6"
                src="/housing.svg"
                width="128"
                height="128"
                alt="Housing logo"
              />
              <h2>Housing</h2>
            </div>
            <a href="/createclubs">
              <div className="flex flex-col items-center">
                <img
                  className="my-6"
                  src="/organizations.svg"
                  width="128"
                  height="128"
                  alt="Organizations logo"
                />
                <h2>Organizations</h2>
              </div>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
