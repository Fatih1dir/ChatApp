import React, { useEffect } from "react";
import { Text, View, SafeAreaView, FlatList } from "react-native";
import styles from "./HomePage.style";
import { app } from "../../../firebaseConfig";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, get, onValue, update } from "firebase/database";
import ChatCard from "../../Components/ChatCard/ChatCard";
import { FloatingAction } from "react-native-floating-action";
import Loading from "../../Components/Loading/Loading";
import ParseContentData from "../../Controllers/ParseContentData";
import { usePushNotifications } from "../../Controllers/usePushNotification";

const auth = getAuth(app);

const HomePage = ({ navigation }) => {
  const [loading, setLoading] = React.useState(false);
  const [chats, setChats] = React.useState([]);
  const chatDataArray = [];
  const currentUserId = auth.currentUser.uid;
  const db = getDatabase();
  const userChatIdsRef = ref(db, `users/${currentUserId}/chatIds`);

  const { expoPushToken, sendNotification } = usePushNotifications(); // Ensure expoPushToken is used

  const actions = [
    {
      icon: require("../../../assets/add_chat_Icon.png"),
      text: "Mesaj oluştur",
      name: "add_chat",
      position: 1,
      color: "#82368C",
    },
    {
      icon: require("../../../assets/add_friend_Icon.png"),
      text: "Arkadaş ekle",
      name: "add_friend",
      position: 2,
      color: "#82368C",
    },
  ];

  const handlePress = (name) => {
    if (name === "add_chat") {
      navigation.navigate("CreateChat");
    } else if (name === "add_friend") {
      navigation.navigate("AddFriend");
    }
  };

  const handleChatCardPress = (pressedChat) => {
    navigation.navigate("MessagesPage", pressedChat);
  };

  const handleLongPressChatCard = (pressedChat) => {
    console.log(pressedChat.chatId, pressedChat.participants);
  };

  const getLastMessages = (chatDataArray, chatIds, token) => {
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setDate(twentyFourHoursAgo.getDate() - 1);
    if (chatDataArray.length === chatIds.length) {
      const parsedChatData = ParseContentData(chatDataArray, "updatedAt", true);

      const chatsWithLastMessage = parsedChatData.map((chat) => {
        let lastMessage;

        const filteredMessages = Object.values(chat.messages || {}).filter(
          (message) => {
            const messageSendAt = new Date(message.sendAt);
            const currentTime = new Date();

            // Check if the message was sent within the last 24 hours
            return currentTime - messageSendAt <= 24 * 60 * 60 * 1000;
          }
        );

        if (!chat.messages || chat.messages.length === 0) {
          lastMessage = "No message yet";
        }
        else if(filteredMessages.length == 0){
          lastMessage = "No message yet";
        } else {
          lastMessage = ParseContentData(chat.messages, "sendAt", true)[0];

          // Update the chats updatedAt field
          update(ref(db, `Chats/${chat.chatId}`), {
            updatedAt: lastMessage.sendAt,
          });

          // Check if the last message was sent within the last minute
          const currentTime = new Date();
          const lastMessageTime = new Date(lastMessage.sendAt);

          if (
            lastMessage.senderId != auth.currentUser.uid &&
            currentTime - lastMessageTime <= 30000 &&
            token
          ) {
            // Send a notification here
            sendNotification(lastMessage.senderUsername, lastMessage.message);
            console.log("Notified");
          }
        }
        return {
          ...chat,
          lastMessage,
        };
      });
      setChats(chatsWithLastMessage);
      setLoading(false);
    }
  };

  const handleRenderChatCard = (chat) => {
    return (
      <ChatCard
        chatName={chat.name}
        chatImage={chat.chatImage}
        participants={chat.participants}
        updatedAt={
          chat.lastMessage
            ? chat.lastMessage.sendAt || chat.updatedAt
            : chat.updatedAt
        }
        lastMessage={chat.lastMessage}
        onPress={() => handleChatCardPress(chat)}
      />
    );
  };

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onValue(userChatIdsRef, (snapshot) => {
      if (snapshot.exists()) {
        const chatIds = Object.keys(snapshot.val());
        const chatDataArray = [];

        chatIds.forEach((chatId) => {
          const chatRef = ref(db, `Chats/${chatId}`);
          onValue(chatRef, (chatSnapshot) => {
            const chatData = { chatId, ...chatSnapshot.val() };
            chatDataArray.push(chatData);
            getLastMessages(chatDataArray, chatIds, expoPushToken);
            //console.log(chats);
          });
        });
      } else {
        setChats([]);
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [currentUserId, expoPushToken]);

  if (loading) {
    return <Loading/>;
  }
  return (
    <View style={styles.container}>
      {chats.length > 0 ? (
        <FlatList
          data={chats}
          keyExtractor={(item) => item.chatId}
          style={styles.flatListContainer}
          renderItem={({ item }) => handleRenderChatCard(item)}
        />
      ) : (
        <>
          <Text style={styles.text}>Henüz kimseyle mesajlaşmadın</Text>
          <Text style={styles.text}>
            Sağ alttaki artı butonuna basarak arkadaş ekleyebilir sonra da mesaj
            oluşturabilirsin
          </Text>
        </>
      )}
      <FloatingAction
        actions={actions}
        onPressItem={(name) => handlePress(name)}
        color="#82368C" // Customize the button color
        overlayColor="rgba(0, 0, 0, 0.5)" // Customize the overlay color
      />
    </View>
  );
};

export { HomePage };
