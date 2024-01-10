import { getDatabase, ref, push, set, get } from "firebase/database";

const SendMessage = (chatId,senderId,content) => {
    const db = getDatabase();
    
    const chatRef = ref(db, `Chats/${chatId}/messages`);
    const newChatKey = push(chatRef).key;

    const chatContent = {
        senderId: senderId,
        message: content,
        sendAt: getDate()
    };

    set(ref(db, `Chats/${chatId}/messages/${newChatKey}`), chatContent);
};
function getDate() {
    const today = new Date();
    return today.toISOString();
};

export {SendMessage};