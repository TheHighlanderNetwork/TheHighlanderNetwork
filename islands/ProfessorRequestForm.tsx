"use client";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../utils/firebase.ts";
import { useEffect, useRef, useState } from "preact/hooks";
import { Status, useStatus } from "./Status.tsx";
import {
  createProfessorAPI,
  deleteProfessorAPI,
  getProfessorAPI,
} from "../utils/firebase/crud/professors.ts";

type FirebaseUser = {
  displayName?: string | null;
};

export default function ProfessorRequestForm() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const professorNameRef = useRef<HTMLInputElement>(null);
  const { status, showStatus } = useStatus();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user: FirebaseUser | null) => {
        setIsSignedIn(!!user);
      },
    );
    return () => unsubscribe();
  }, []);

  const fetchProfessor = async (netid: string) => {
    const url = `https://profiles.ucr.edu/api/profile/${netid}`;

    const headers = {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0.1 Safari/605.1.15",
      "Accept": "application/json, text/plain, */*",
      "X-Requested-With": "XMLHttpRequest",
      "Accept-Encoding": "gzip, deflate, br",
      "Connection": "keep-alive",
    };

    try {
      const response = await fetch(
        url,
        {
          method: "GET",
          headers: headers,
        },
      );

      if (response.ok) {
        const data = await response.json();
        return data ? data : null;
      } else {
        console.error("Error fetching professor data", response);
        return null;
      }
    } catch (error) {
      console.error("Request failed", error);
      return null;
    }
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (!isSignedIn) {
      showStatus("error", "You must be signed in to submit a professor.");
      return;
    }

    const professorName = professorNameRef.current?.value.trim();
    if (!professorName) {
      showStatus("error", "Please enter a professor's name.");
      return;
    }

    try {
      const professor = await fetchProfessor(professorName);

      if (professor) {
        const professorNetid = professor.netId;
        const professorName = professor.name;
        const professorDepartment = professor.department;
        try {
          const dbSearch = await getProfessorAPI(professorNetid);
          if (
            dbSearch.department == professorDepartment &&
            dbSearch.name == professorName
          ) {
            showStatus("error", "Professor already exists");
          } else {
            await deleteProfessorAPI(professorNetid);
            throw new Error("Professor not found");
          }
        } catch (error) {
          if (error == "Error: Professor not found") {
            console.log("not found error");
            await createProfessorAPI({
              netid: professorNetid,
              name: professorName,
              department: professorDepartment,
              classes: ["000"],
            });
            showStatus(
              "success",
              `Professor ${professor.name} fetched successfully!`,
            );
          } else {
            throw error;
          }
        }
      } else {
        showStatus("error", "No professor found with that name");
      }
    } catch (error) {
      console.error("Error fetching professor:", error);
      showStatus("error", "An error occurred while fetching professor data");
    }
  };

  const buttonText = isSignedIn ? "Submit" : "Log In to Submit";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      <input
        type="text"
        name="professorName"
        placeholder="Professor Netid"
        ref={professorNameRef}
        className="px-4 py-2 border rounded-md w-full"
        required
      />
      <button
        type="submit"
        disabled={!isSignedIn}
        className={`bg-blue text-white rounded-md px-4 py-2 text-sm font-medium w-full ${
          !isSignedIn ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {buttonText}
      </button>
      {status && <Status type={status.type} message={status.message} />}
    </form>
  );
}
