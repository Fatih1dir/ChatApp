import { getDatabase, ref, push, set, get } from "firebase/database";

async function getUsername(senderId) {
  const db = getDatabase();
  const senderRef = ref(db, `users/${senderId}/username`);

  try {
    const snapshot = await get(senderRef);
    if (snapshot.exists()) {
      const username = snapshot.val();
      return username;
    } else {
      return null; // The senderId was not found in the database
    }
  } catch (error) {
    console.error("Error getting sender's username: ", error);
    return null;
  }
}

function getDate() {
  const today = new Date();
  return today.toISOString();
}

async function getUserId(receiverUsername) {
  const db = getDatabase();
  const receiverRef = ref(db, `usernames/${receiverUsername}/userid`);

  try {
    const snapshot = await get(receiverRef);
    if (snapshot.exists()) {
      const userId = snapshot.val();
      return userId;
    } else {
      return null; // The senderId was not found in the database
    }
  } catch (error) {
    console.error("Error getting receivers userId: ", error);
    return null;
  }
}
function createChat(senderId, chatName, participants,chatImage) {
  const db = getDatabase();
  const chatRef = ref(db, "Chats");

  // Push a new child to "Chats" and get its key (this will be your chat ID)
  const newChatKey = push(chatRef).key;
  const updateDate = getDate();

  // Get the sender's username
  getUsername(senderId).then((senderUsername) => {
    if (senderUsername) {
      // Add chatId to sender's chatIds
      set(ref(db, `users/${senderId}/chatIds/${newChatKey}/updateDate`), updateDate);

      const defaultChatName = `${senderUsername}'s chat`; // Set your default chat name here
      const chatData = {
        name: chatName || defaultChatName, // Use the provided chatName or default chat name
        participants: [senderUsername, ...participants], // Include the sender and other participants
        chatImage: chatImage,
        createdAt: getDate(),
        updatedAt: getDate()
        // Add any other chat metadata
      };
      set(ref(db, `Chats/${newChatKey}`), chatData);
    } else {
      console.log("Sender's username not found.");
    }
  });
  // Add chatId to the receivers' chatIds
  participants.forEach((receiverUsername) => {
    getUserId(receiverUsername).then((receiverUserid) => {
      if (receiverUserid) {
        set(ref(db, `users/${receiverUserid}/chatIds/${newChatKey}/updateDate`), updateDate);
      } else {
        console.log("Receivers userId not found.");
      }
    });
  });
}

export { createChat};
