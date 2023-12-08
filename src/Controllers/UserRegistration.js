// UserRegistration.js
import { app } from '../../firebaseConfig'; // Import the app object

// Import the Firebase Authentication module
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

import { showMessage} from "react-native-flash-message";

import { writeUserData } from './CreateUserInDB';

// Create a new user function
const registerUser = async (email, password, username) => {
  const auth = getAuth(app);

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    try {
      await writeUserData(user.uid,username,email,"");
    } catch (error) {
      console.log(error)
    }
    
    
    console.log('User registered successfully:', user.uid);
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      showMessage({
        message: "Bu e-mail kullanılyor. Başka bir e-mail girin ya da giriş yapın.",
        type: "info",
      });
    }

    if (error.code === 'auth/invalid-email') {
      showMessage({
        message: "Geçersiz e-mail girdiniz.",
        type: "info",
      });
    }
  }
};

export { registerUser };