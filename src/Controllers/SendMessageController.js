import { getDatabase, ref, push, set, get, update } from "firebase/database";
import { getUserAttributesbyId } from "./User";
import ParseContentData from "./ParseContentData";
const SendMessage = async (chatId, senderId, content, isAnonymous) => {
  const db = getDatabase();
  const chatRef = ref(db, `Chats/${chatId}/messages`);
  const userChatsRef = ref(db, `users/${senderId}/chatIds/${chatId}`);
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
      update(ref(db, `users/${senderId}/chatIds/${chatId}`), {
        updateDate: chatContent.sendAt,
      });
    }
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

function getDate() {
  const today = new Date();
  return today.toISOString();
}

export { SendMessage };
