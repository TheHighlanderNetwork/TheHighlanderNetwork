import { useState } from "preact/hooks";
import { deleteUserData } from "../utils/firebase/docDeletion/deleteUser.ts";

export default function DeleteUserPage() {
  const [status, setStatus] = useState<string | null>(null); // For status messages

  const handleDeleteUser = async () => {
    try {
      // Delete the user account
      await deleteUserData();
      setStatus("User account deleted successfully.");
    } catch (error) {
      console.error("Error deleting user:", error);
      setStatus("Error deleting user.");
    }
  };

  return (
    <div>
      <h1>Delete User Account</h1>
      <button type="button" onClick={handleDeleteUser}>
        Delete My Account
      </button>
      {status && <p>{status}</p>}
    </div>
  );
}
