import { auth } from "../../firebase.ts";

export type Professor = {
  netid: string;
  name: string;
  classes: string[];
  department: string;
};

async function getAuthToken() {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error("User not authenticated");
  }

  return await currentUser.getIdToken();
}

export async function createProfessorAPI(data: Professor) {
  const token = await getAuthToken();

  const response = await fetch("/api/db/professors", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to create professor");
  }

  return response.json();
}

export async function getProfessorAPI(netid: string) {
  const response = await fetch(`/api/db/professors/${netid}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Professor not found");
    }
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to get professor");
  }

  return response.json();
}

export async function updateProfessorAPI(
  netid: string,
  data: Partial<Professor>,
) {
  const token = await getAuthToken();

  const response = await fetch(`/api/db/professors/${netid}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to update professor");
  }

  return response.json();
}

export async function deleteProfessorAPI(netid: string) {
  const token = await getAuthToken();

  const response = await fetch(`/api/db/professors/${netid}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to delete professor");
  }

  return response.json();
}
