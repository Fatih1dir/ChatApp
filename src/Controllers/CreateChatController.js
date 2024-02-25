import { getDatabase, ref, push, set, get,remove } from "firebase/database";
import React from "react";


async function getUsername(senderId) {
  const db = getDatabase();
  const senderRef = ref(db, `users/${senderId}`);

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

function deleteChat(chatId,participants) {
  const db = getDatabase();
  const chatRef = ref(db, `Chats/${chatId}`);

  remove(chatRef).then(() => {
    console.log("Chat deleted successfully");
  }).catch((error) => {
    console.error("Error deleting chat: ", error);
  });

  participants.forEach((participants) => {
    getUserId(participants.username).then((participantsUID) => {
      //console.log(receiverUserid);
      if (participantsUID) {
        set(ref(db, `users/${participantsUID}/chatIds/${chatId}`), null).then(() => {
          console.log("Receiver's chatId deleted successfully.");
        });
      } else {
        console.log("Receivers userId not found.");
      }
    });
  });
}

function leaveChat(chatId,userid) {
  const db = getDatabase();
  const chatRef = ref(db, `users/${userid}/chatIds/${chatId}`);

  remove(chatRef).then(() => {
    console.log("Chat deleted successfully");
  }).catch((error) => {
    console.error("Error deleting chat: ", error);
  });
}
async function createChat(senderId, chatName, participants, chatImage, navigation) {
  const db = getDatabase();
  const chatRef = ref(db, "Chats");

  // Push a new child to "Chats" and get its key (this will be your chat ID)
  const newChatKey = push(chatRef).key;
  const updateDate = getDate();

  // Get the sender's username
  const senderUsername = await getUsername(senderId);
  participants.push(senderUsername);

  if (senderUsername) {
    const defaultChatName = `${senderUsername.username}'s chat`; // Set your default chat name here

    // Create an object with user IDs as keys and an object containing the username as a property
    const participantsObject = {
      [senderId]: { username: senderUsername.username },
    };

    // Use Promise.all to wait for all user updates to complete
    const updateUserPromises = participants.map(async (receiverUsername) => {
      const receiverUserId = await getUserId(receiverUsername.username);
      if (receiverUserId) {
        participantsObject[receiverUserId] = { username: receiverUsername.username };
        try {
          // Add chatId to the receivers' chatIds
          await set(ref(db, `users/${receiverUserId}/chatIds/${newChatKey}/updateDate`), updateDate);
          console.log(`ChatId added successfully for ${receiverUsername.username}.`);
        } catch (error) {
          console.error(`Error adding chatId to ${receiverUsername.username}'s chatIds: `, error);
        }
      } else {
        console.log(`Receiver's userId not found for ${receiverUsername.username}.`);
      }
    });

    // Wait for all user updates to complete
    await Promise.all(updateUserPromises);

    const chatData = {
      name: chatName || defaultChatName,
      participants: participantsObject,
      chatImage: chatImage,
      createdAt: getDate(),
      updatedAt: getDate(),
    };
    // Wait for the chat creation to complete
    await set(ref(db, `Chats/${newChatKey}`), chatData);

    navigation.navigate("MessagesPage", { chatId: newChatKey, ...chatData});
    console.log("Chat created successfully");
  } else {
    console.log("Sender's username not found.");
  }
}

export { createChat };
