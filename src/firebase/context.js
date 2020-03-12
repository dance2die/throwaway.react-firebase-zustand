import { createContext, useContext, useState, useEffect } from 'react'

const FirebaseContext = createContext()

function useFirebase() {
  const firebase = useContext(FirebaseContext)
  if (firebase === undefined) throw Error('use this under FirebaseContext')
  return firebase
}

function useUser() {
  const { auth } = useFirebase()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser)
    return () => unsubscribe()
  }, [auth])

  return user
}

export { FirebaseContext, useFirebase, useUser }
