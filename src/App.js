import React, { useEffect } from 'react'

import { useFirebase, useUser } from './firebase'

import logo from './logo.svg'
import './App.css'

function App() {
  const { signIn, signOut, db } = useFirebase()
  const user = useUser()

  useEffect(() => {
    console.info(`user ===>`, user)
  }, [user])

  useEffect(() => {
    if (!user) return

    const usersRef = db.ref(`/users/${user.uid}`)
    usersRef.on('value', snapshot => {
      console.log(`usersRef snapshot`, snapshot.val())
    })

    return () => usersRef.off()
  })

  return (
    <div className='App'>
      <button onClick={signIn}>Sign IN</button>
      <button onClick={signOut}>Sign OUT</button>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className='App-link'
          href='https://reactjs.org'
          target='_blank'
          rel='noopener noreferrer'
        >
          Learn React
        </a>
      </header>
    </div>
  )
}

export default App
