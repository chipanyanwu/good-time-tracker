import { database } from "@/lib/firebase/firebaseConfig"
import { ref, get, set, remove } from "firebase/database"

/**
 * Adds or updates a tag in the user's global tag list.
 * Writes /users/{userId}/tags/{tag} = true
 */
export const upsertUserTag = async (
  userId: string,
  tag: string
): Promise<void> => {
  await set(ref(database, `users/${userId}/tags/${tag}`), true)
}

/**
 * Removes a tag from the user's global tag list.
 * Deletes /users/{userId}/tags/{tag}
 */
export const deleteUserTag = async (
  userId: string,
  tag: string
): Promise<boolean> => {
  try {
    await remove(ref(database, `users/${userId}/tags/${tag}`))
    return true
  } catch (err) {
    console.error(`Error deleting tag ${tag} for user ${userId}:`, err)
    return false
  }
}

/**
 * Fetches all tags for a user.
 * Reads /users/{userId}/tags
 * Returns an array of tag names.
 */
export const getUserTags = async (userId: string): Promise<string[]> => {
  const snap = await get(ref(database, `users/${userId}/tags`))
  if (!snap.exists()) return []
  return Object.keys(snap.val())
}
