import React, { useEffect } from 'react'
import styled from 'styled-components'
import create from 'zustand'
import { devtools } from 'zustand/middleware'

import { useFirebase, useUser } from './firebase'

import './App.css'

const [useStore] = create(
  devtools(
    set => ({
      tweets: [],
      addTweet: tweet =>
        set(
          state => ({
            ...state,
            tweets: [tweet, ...state.tweets]
          }),
          // https://github.com/react-spring/zustand/issues/77#issuecomment-551567711
          'addTweet'
        )
    }),
    'tweetStore'
  )
)

const FormContainer = styled.section``
const ListContainer = styled.section``
const NameLabel = styled.label`
  display: block;
`
const TextLabel = styled.label`
  display: block;
`

function TweetForm() {
  const addTweet = useStore(state => state.addTweet)
  const { db } = useFirebase()
  const user = useUser()

  const submitTweet = e => {
    e.preventDefault()
    e.persist()
    const tweet = { name: e.target['name'].value, text: e.target['text'].value }
    console.info(`tweet=>`, tweet)

    db.ref(`/tweets/${user.uid}`)
      .push()
      .set({
        name: tweet.name,
        text: tweet.text
      })
      .then(() => addTweet(tweet))

    // addTweet(tweet)
  }

  return (
    <form onSubmit={submitTweet}>
      <NameLabel>
        Name:
        <input type='text' name='name' />
      </NameLabel>
      <TextLabel>
        Name:
        <textarea rows={3} cols={80} name='text' />
      </TextLabel>
      <button type='submit'>Tweet~</button>
    </form>
  )
}

function TweetList() {
  const tweets = useStore(state => state.tweets)
  const addTweet = useStore(state => state.addTweet)
  const user = useUser()
  const { db } = useFirebase()

  useEffect(() => {
    if (!user) return

    db.ref(`/tweets/${user.uid}`)
      .once('value')
      .then(snapshot => {
        const savedTweets = Object.values(snapshot.val())
        console.info(`savedTweets ==>`, savedTweets)
        savedTweets.map(addTweet)
      })
  }, [addTweet, db, user])

  useEffect(() => {
    console.info(`tweets ===>`, tweets)
  }, [tweets])

  return (
    <ul>
      {tweets.map((tweet, i) => (
        <li key={i}>
          <h4>{tweet.name}</h4>
          <p>{tweet.text}</p>
        </li>
      ))}
    </ul>
  )
}

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

      <FormContainer>
        <TweetForm />
      </FormContainer>
      <ListContainer>
        <TweetList />
      </ListContainer>
    </div>
  )
}

export default App
