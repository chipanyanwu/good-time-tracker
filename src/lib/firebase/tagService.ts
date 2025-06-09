import { database } from "@/lib/firebase/firebaseConfig"
import { ref, get, set, remove } from "firebase/database"
import type { Tag, TagType } from "@/types/entry"

/**
 * Adds or updates a tag in the user's global tag list.
 * Writes /users/{userId}/tags/{tagName} = { type?: TagType }
 */
export const upsertUserTag = async (
  userId: string,
  tagName: string,
  tagType?: TagType
): Promise<void> => {
  const tagRef = ref(database, `users/${userId}/tags/${tagName}`)

  // only include `type` if it’s defined
  const payload: { type?: TagType } = {}
  if (tagType !== undefined) {
    payload.type = tagType
  } else {
    payload.type = "Default" as unknown as TagType
  }

  await set(tagRef, payload)
}

/**
 * Removes a tag from the user's global tag list.
 * Deletes /users/{userId}/tags/{tagName}
 */
export const deleteUserTag = async (
  userId: string,
  tagName: string
): Promise<boolean> => {
  try {
    await remove(ref(database, `users/${userId}/tags/${tagName}`))
    return true
  } catch (err) {
    console.error(`Error deleting tag ${tagName} for user ${userId}:`, err)
    return false
  }
}

/**
 * Fetches all tags for a user.
 * Reads /users/{userId}/tags
 * Returns an array of Tag { name, type? } objects
 */
export const getUserTags = async (userId: string): Promise<Tag[]> => {
  const snap = await get(ref(database, `users/${userId}/tags`))
  if (!snap.exists()) return []

  const raw = snap.val() as Record<string, { type?: TagType }>
  return Object.entries(raw).map(([name, { type }]) => ({
    name,
    type,
  }))
}
