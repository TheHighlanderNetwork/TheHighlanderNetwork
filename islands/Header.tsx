// islands/Header.tsx
"use client";
import UsernameHeader from "./UsernameHeader.tsx";

export default function TitleBar() {
  return (
    <header className="flex items-center justify-between w-full bg-white px-8 py-4 shadow-sm">
      <a href="/">
        <div className="flex text-2xl font-bold">
          <h1 className="text-yellow">The Highlander&nbsp;</h1>
          <h1 className="text-blue">Network</h1>
        </div>
      </a>
      <UsernameHeader />
    </header>
  );
}
