import { addUser, getUser } from "./db"
import { auth } from "./firebaseConfig"
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"

const provider = new GoogleAuthProvider()

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider)
    const firebaseUser = result.user

    let profile = await getUser(firebaseUser.uid)
    if (!profile) {
      await addUser(firebaseUser)
      profile = await getUser(firebaseUser.uid)
    }

    return { ...firebaseUser, ...profile }
  } catch (error) {
    console.error("Error during sign-in:", error)
    return null
  }
}
