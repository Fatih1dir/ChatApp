import { getDatabase, ref, get } from 'firebase/database';
import { app } from '../../firebaseConfig';
import { getAuth } from "firebase/auth";

const auth = getAuth(app);
const getUserAttributesbyId = async (userId) => {
  const db = getDatabase();
  const usersRef = ref(db, `users`);

  try {
    const snapshot = await get(usersRef);
    if (snapshot.exists()) {
      const usersData = snapshot.val();
      
      
      const user = usersData[userId];

      // Return the user object if found, otherwise return null
      return user ? { [userId]: user } : null;
    }

    return null; // Return null if user with the given username is not found
  } catch (error) {
    console.error('Error retrieving user attributes:', error);
    return null; // Return null in case of an error
  }
};
const getUserAttributesbyUsername = async (username) => {
  const db = getDatabase();
  const usersRef = ref(db, `usernames`);

  try {
    const snapshot = await get(usersRef);
    if (snapshot.exists()) {
      const usersData = snapshot.val();
      
      const user = usersData[username];

      // Return the user object if found, otherwise return null
      return user ? { [username]: user } : null;
    }

    return null; // Return null if user with the given username is not found
  } catch (error) {
    console.error('Error retrieving user attributes:', error);
    return null; // Return null in case of an error
  }
}

export {getUserAttributesbyId,getUserAttributesbyUsername};