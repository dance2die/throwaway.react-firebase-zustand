import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback
} from 'react'

const FirebaseContext = createContext()

function useFirebase() {
  const firebase = useContext(FirebaseContext)
  if (firebase === undefined) throw Error('use this under FirebaseContext')
  return firebase
}

function useUser() {
  const { auth, db } = useFirebase()
  const [user, setUser] = useState(null)

  const saveUser = useCallback(
    user => {
      setUser(user)

      if (!user) return
      db.ref(`/users/${user.uid}`).set({
        email: user.email,
        username: user.displayName
      })
    },
    [db]
  )

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(saveUser)
    return () => unsubscribe()
  }, [auth, saveUser])

  return user
}

export { FirebaseContext, useFirebase, useUser }
