import { initializeApp } from 'firebase/app';
import { showMessage } from 'react-native-flash-message';
import { app } from '../../firebaseConfig'; // Import the app object

import { getDatabase, ref, runTransaction, get } from "firebase/database";

async function isUsernameEmailUnique(db, username) {
  const usersRef = ref(db, 'users');
  const snapshot = await get(usersRef);
  const users = snapshot.val();

  if (users) {
    const isUsernameUnique = !Object.values(users).some(user => user.username === username);
    return { isUsernameUnique};
  }

  return { isUsernameUnique: true};
}

async function writeUserData(userId, name) {
  const db = getDatabase();
  const { isUsernameUnique} = await isUsernameEmailUnique(db, name);

  if (isUsernameUnique) {
    const userRef = ref(db, 'users/' + userId);
    const userNameRef = ref(db, 'usernames/' + name);

    try {
      await runTransaction(userRef, (userData) => {
        if (!userData) {
          userData = {
            username: name,
          };
        }
        return userData;
      });

      await runTransaction(userNameRef, (userData) => {
        if (!userData) {
          userData = {
            userid: userId,
          };
        }
        return userData;
      });
      

      showMessage({
        message: `Hoşgeldiniz ${name}`,
        type: 'success',
      });
    } catch (error) {
      showMessage({
        message: 'Hata oluştu. Lütfen daha sonra tekrar deneyin.',
        type: 'danger',
      });
    }
  }
  if(!isUsernameUnique){
    showMessage({
      message: 'Kullanıcı adı kullanılıyor. Farklı bir kullanıcı adı deneyin.',
      type: 'danger',
    });
  }
}


export { writeUserData,isUsernameEmailUnique };
