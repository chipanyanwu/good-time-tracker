import { database } from "@/lib/firebase/firebaseConfig"
import { get, ref, set, remove, update, onValue, off } from "firebase/database"
import { v4 as uuidv4 } from "uuid"
import type { User } from "@/types/user"
import type { User as FirebaseUser } from "firebase/auth"
import type { Activity, Reflection, Tag } from "@/types/entry"

// User Functions
export const addUser = async (user: FirebaseUser) => {
  const { uid, photoURL, email, displayName } = user

  const userData: User = {
    userId: uid,
    name: displayName || "",
    email: email || "",
    profilePic: photoURL || "",
    activities: [],
    reflections: [],
  }

  try {
    await set(ref(database, `users/${uid}`), userData)
    console.log(`User added! ${uid}`)
    return true
  } catch (error) {
    console.log("Error creating user:", error)
    return false
  }
}

export const getUser = async (userId: string) => {
  try {
    const userRef = ref(database, `users/${userId}`)
    const snapshot = await get(userRef)

    if (snapshot.exists()) {
      return snapshot.val() as User
    } else {
      console.log(`Could not find user with id ${userId}`)
      return null
    }
  } catch (err) {
    console.log(`An error occurred while trying to get user ${userId}:`, err)
    return null
  }
}

/**
 * Adds a new Activity under users/{userId}/activities/{generatedId}
 * @returns the generated activityId on success, or null on failure.
 */
export const addActivity = async (
  userId: string,
  activity: Omit<Activity, "id">
): Promise<string | null> => {
  const activityId = uuidv4()
  const payload = {
    title: activity.title,
    content: activity.content,
    date: activity.date.getTime(),
    engagement: activity.engagement,
    energy: activity.energy,
    tags: activity.tags ?? ([] as Tag[]),
  }

  console.log(payload)

  try {
    await set(
      ref(database, `users/${userId}/activities/${activityId}`),
      payload
    )
    return activityId
  } catch (error) {
    console.error("Error adding activity:", error)
    return null
  }
}

/**
 * Adds a new Reflection under users/{userId}/reflections/{generatedId}
 * @returns the generated reflectionId on success, or null on failure.
 */
export const addReflection = async (
  userId: string,
  reflection: Omit<Reflection, "id">
): Promise<string | null> => {
  const reflectionId = uuidv4()
  const payload = {
    title: reflection.title,
    content: reflection.content,
    startDate: reflection.startDate.getTime(),
    endDate: reflection.endDate.getTime(),
    tags: reflection.tags ?? ([] as Tag[]),
  }

  try {
    await set(
      ref(database, `users/${userId}/reflections/${reflectionId}`),
      payload
    )
    return reflectionId
  } catch (error) {
    console.error("Error adding reflection:", error)
    return null
  }
}

/**
 * Fetches all activities for the given userId.
 * Reads from: /users/{userId}/activities
 * Returns an array of Activity objects (with `date` parsed into a Date).
 */
export const getAllActivities = async (userId: string): Promise<Activity[]> => {
  try {
    const activitiesRef = ref(database, `users/${userId}/activities`)
    const snapshot = await get(activitiesRef)

    if (!snapshot.exists()) {
      return []
    }

    const rawData = snapshot.val() as Record<
      string,
      {
        title: string
        content: string
        date: number
        engagement: number
        energy: number
        tags?: Tag[]
      }
    >

    return Object.entries(rawData).map(([id, item]) => ({
      id,
      title: item.title,
      content: item.content,
      date: new Date(item.date),
      engagement: item.engagement,
      energy: item.energy,
      tags: item.tags ?? [],
    }))
  } catch (error) {
    console.error(`Error fetching all activities for ${userId}:`, error)
    return []
  }
}

/**
 * Fetches all reflections for the given userId.
 * Reads from: /users/{userId}/reflections
 * Returns an array of Reflection objects (with `startDate` and `endDate` parsed into Date).
 */
export const getAllReflections = async (
  userId: string
): Promise<Reflection[]> => {
  try {
    const reflectionsRef = ref(database, `users/${userId}/reflections`)
    const snapshot = await get(reflectionsRef)

    if (!snapshot.exists()) {
      return []
    }

    const rawData = snapshot.val() as Record<
      string,
      {
        title: string
        content: string
        startDate: number
        endDate: number
        tags?: Tag[]
      }
    >

    return Object.entries(rawData).map(([id, item]) => ({
      id,
      title: item.title,
      content: item.content,
      startDate: new Date(item.startDate),
      endDate: new Date(item.endDate),
      tags: item.tags ?? [],
    }))
  } catch (error) {
    console.error(`Error fetching all reflections for ${userId}:`, error)
    return []
  }
}

/**
 * Fetches a single Activity by its ID.
 * Reads from: /users/{userId}/activities/{activityId}
 * Returns an Activity object if found, otherwise null.
 */
export const getActivityById = async (
  userId: string,
  activityId: string
): Promise<Activity | null> => {
  try {
    const activityRef = ref(
      database,
      `users/${userId}/activities/${activityId}`
    )
    const snapshot = await get(activityRef)

    if (!snapshot.exists()) {
      return null
    }

    const data = snapshot.val() as {
      title: string
      content: string
      date: number
      engagement: number
      energy: number
      tags?: Tag[]
    }

    return {
      id: activityId,
      title: data.title,
      content: data.content,
      date: new Date(data.date),
      engagement: data.engagement,
      energy: data.energy,
      tags: data.tags ?? [],
    }
  } catch (error) {
    console.error(`Error fetching activity ${activityId} for ${userId}:`, error)
    return null
  }
}

/**
 * Fetches a single Reflection by its ID.
 * Reads from: /users/{userId}/reflections/{reflectionId}
 * Returns a Reflection object if found, otherwise null.
 */
export const getReflectionById = async (
  userId: string,
  reflectionId: string
): Promise<Reflection | null> => {
  try {
    const reflectionRef = ref(
      database,
      `users/${userId}/reflections/${reflectionId}`
    )
    const snapshot = await get(reflectionRef)

    if (!snapshot.exists()) {
      return null
    }

    const data = snapshot.val() as {
      title: string
      content: string
      startDate: number
      endDate: number
      tags?: Tag[]
    }

    return {
      id: reflectionId,
      title: data.title,
      content: data.content,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      tags: data.tags ?? [],
    }
  } catch (error) {
    console.error(
      `Error fetching reflection ${reflectionId} for ${userId}:`,
      error
    )
    return null
  }
}

/**
 * Updates an existing Activity.
 * Writes to: /users/{userId}/activities/{activityId}
 * Dates are stored as milliseconds since epoch.
 */
export const updateActivity = async (
  userId: string,
  activityId: string,
  activity: Omit<Activity, "id">
): Promise<boolean> => {
  try {
    const activityRef = ref(
      database,
      `users/${userId}/activities/${activityId}`
    )
    await update(activityRef, {
      title: activity.title,
      content: activity.content,
      date: activity.date.getTime(), // store as ms
      engagement: activity.engagement,
      energy: activity.energy,
      tags: activity.tags ?? [],
    })
    return true
  } catch (error) {
    console.error(`Error updating activity ${activityId}:`, error)
    return false
  }
}

/**
 * Updates an existing Reflection.
 * Writes to: /users/{userId}/reflections/{reflectionId}
 * Dates are stored as milliseconds since epoch.
 */
export const updateReflection = async (
  userId: string,
  reflectionId: string,
  reflection: Omit<Reflection, "id">
): Promise<boolean> => {
  try {
    const reflectionRef = ref(
      database,
      `users/${userId}/reflections/${reflectionId}`
    )
    await update(reflectionRef, {
      title: reflection.title,
      content: reflection.content,
      startDate: reflection.startDate.getTime(), // store as ms
      endDate: reflection.endDate.getTime(), // store as ms
      tags: reflection.tags ?? [],
    })
    return true
  } catch (error) {
    console.error(`Error updating reflection ${reflectionId}:`, error)
    return false
  }
}

/**
 * Deletes an existing Activity.
 * Removes from: /users/{userId}/activities/{activityId}
 */
export const deleteActivity = async (
  userId: string,
  activityId: string
): Promise<boolean> => {
  try {
    const activityRef = ref(
      database,
      `users/${userId}/activities/${activityId}`
    )
    await remove(activityRef)
    return true
  } catch (error) {
    console.error(`Error deleting activity ${activityId}:`, error)
    return false
  }
}

/**
 * Deletes an existing Reflection.
 * Removes from: /users/{userId}/reflections/{reflectionId}
 */
export const deleteReflection = async (
  userId: string,
  reflectionId: string
): Promise<boolean> => {
  try {
    const reflectionRef = ref(
      database,
      `users/${userId}/reflections/${reflectionId}`
    )
    await remove(reflectionRef)
    return true
  } catch (error) {
    console.error(`Error deleting reflection ${reflectionId}:`, error)
    return false
  }
}
