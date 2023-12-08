// UserRegistration.js
import { app } from '../../firebaseConfig'; // Import the app object
// Import the Firebase Authentication module
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

import { showMessage} from "react-native-flash-message";

// Create a new user function
const signUserIn = async (email, password , {navigation}) => {
  const auth = getAuth(app);
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    navigation.navigate("Home");
    showMessage({
      message: "Giriş yapıldı",
      type: "success",
    });
  } catch (error) {
    showMessage({
      message: error.code,
      type: "danger",
    });
  }
};

export { signUserIn };