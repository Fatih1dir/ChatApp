import { getDatabase, ref, push, set, get, update } from "firebase/database";
import { getUserAttributesbyId } from "./User";
import ParseContentData from "./ParseContentData";
const SendMessage = async (chatId, senderId, content, isAnonymous,participiants) => {
  const db = getDatabase();
  const chatRef = ref(db, `Chats/${chatId}/messages`);
  const userChatsRef = ref(db, `users/${senderId}/chatIds/${chatId}`);
  //console.log(participiants);
  const newChatKey = push(chatRef).key;


  try {
    // Fetch user data
    const userData = await getUserAttributesbyId(senderId);

    if (userData) {
      const parsedData = ParseContentData(userData);
      const senderUsername = parsedData[0].username;

      const chatContent = {
        senderUsername: senderUsername,
        senderId: senderId,
        message: content,
        sendAt: getDate(),
        isAnonymous: isAnonymous,
      };
      // Save message to Firebase
      set(ref(db, `Chats/${chatId}/messages/${newChatKey}`), chatContent);
      // update(ref(db, `users/${senderId}/chatIds/${chatId}`), {
      //   updateDate: chatContent.sendAt,
      // });

      await Promise.all(participiants.map(async (receiverUsername) => {
        let receiverUserid = await getUserId(receiverUsername.username);
        // console.log("receiverUsername:", receiverUsername.username);
        // console.log("receiverUserid:", receiverUserid);
      
        if (receiverUserid) {
          try {
            await update(ref(db, `users/${receiverUserid}/chatIds/${chatId}`), {
              updateDate: chatContent.sendAt,
            });
            //console.log("Successfully updated updateDate for user:", receiverUserid);
          } catch (error) {
            //console.error("Error updating receiver's chatId:", error);
          }
        } else {
          //console.log("Receiver's userId not found.");
        }
      }));
    }
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

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

export { SendMessage };
