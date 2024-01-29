// UserRegistration.js
import { app } from '../../firebaseConfig'; // Import the app object
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { showMessage } from "react-native-flash-message";
import { writeUserData } from './CreateUserInDB';

// Create a new user function
const registerUser = async (username, password) => {
  const auth = getAuth(app);
  const email = username + "@chatapp.com";

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    try {
      await writeUserData(user.uid, username);
    } catch (error) {
      console.log('Error writing user data:', error);
    }

    console.log('User registered successfully:', user.uid);
  } catch (error) {
    // Handle specific error cases
    switch (error.code) {
      case 'auth/email-already-in-use':
        showMessage({
          message: 'Bu kullanıcı adı kullanılıyor. Farklı bir kullanıcı adı deneyin.',
          type: 'danger',
        });
        break;
      case 'auth/invalid-email':
        showMessage({
          message: 'Yanlış formatta kullanıcı adı girdiniz. Lütfen tekrar deneyin.',
          type: 'danger',
        });
        break;
      case 'auth/operation-not-allowed':
        showMessage({
          message: 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.',
          type: 'danger',
        });
        break;
      case 'auth/weak-password':
        showMessage({
          message: 'Zayıf sifre girdiniz. Lütfen daha güçlü sifre deneyin.',
          type: 'danger',
        });
        break;
      default:
        console.log('Error registering user:', error);
        break;
    }
  }
};

export { registerUser };
