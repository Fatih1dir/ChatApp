import { initializeApp } from 'firebase/app';
import { showMessage } from 'react-native-flash-message';
import { app } from '../../firebaseConfig'; // Import the app object

import { getDatabase, ref, runTransaction, get } from "firebase/database";

async function isUsernameEmailUnique(db, username, email) {
  const usersRef = ref(db, 'users');
  const snapshot = await get(usersRef);
  const users = snapshot.val();

  if (users) {
    const isUsernameUnique = !Object.values(users).some(user => user.username === username);
    const isEmailUnique = !Object.values(users).some(user => user.email === email);
    return { isUsernameUnique, isEmailUnique };
  }

  return { isUsernameUnique: true, isEmailUnique: true };
}

async function writeUserData(userId, name, email, imageUrl) {
  const db = getDatabase();
  const { isUsernameUnique, isEmailUnique } = await isUsernameEmailUnique(db, name, email);

  if (isUsernameUnique && isEmailUnique) {
    const userRef = ref(db, 'users/' + userId);
    const userNameRef = ref(db, 'usernames/' + name);

    try {
      await runTransaction(userRef, (userData) => {
        if (!userData) {
          userData = {
            username: name,
            email: email,
          };
        }
        if (imageUrl) {
          userData.profile_picture = imageUrl;
        }
        return userData;
      });

      await runTransaction(userNameRef, (userData) => {
        if (!userData) {
          userData = {
            userid: userId,
            email: email,
          };
        }
        return userData;
      });
      

      showMessage({
        message: 'User data saved successfully',
        type: 'success',
      });
    } catch (error) {
      showMessage({
        message: 'Failed to save user data',
        type: 'danger',
      });
    }
  }
  if(!isUsernameUnique){
    showMessage({
      message: 'Username is already in use',
      type: 'danger',
    });
  }
  if(!isEmailUnique){
    showMessage({
      message: 'Email is already in use',
      type: 'danger',
    });
  }
  if(!isUsernameUnique & isEmailUnique){
    showMessage({
      message: 'Username and email is already in use',
      type: 'danger',
    });
  }
}


export { writeUserData };
