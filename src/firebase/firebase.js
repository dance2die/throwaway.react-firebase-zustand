import app from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

import firebaseConfig from '../firebaseConfig'

class Firebase {
  constructor() {
    app.initializeApp(firebaseConfig)

    this.auth = app.auth()
    this.auth.setPersistence(app.auth.Auth.Persistence.LOCAL)

    this.db = app.database()
    this.googleProvider = new app.auth.GoogleAuthProvider()
  }

  signIn = () => this.auth.signInWithPopup(this.googleProvider)
  signOut = () => this.auth.signOut()
}

export default Firebase
