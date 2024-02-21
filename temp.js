import React from "react";
import { Text, View, SafeAreaView, FlatList } from "react-native";
import styles from "./HomePage.style";
import { app } from "../../../firebaseConfig";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, get, onValue, update } from "firebase/database";
import Button from "../../Components/Button/Button";
import CreateChatModal from "../../Components/Modal/CreateChatModal/CreateChatModal";
import { createChat } from "../../Controllers/CreateChatController";
import ChatCard from "../../Components/ChatCard/ChatCard";
import { FloatingAction } from "react-native-floating-action";
import Loading from "../../Components/Loading/Loading";
import ParseContentData from "../../Controllers/ParseContentData";
import {sendNotification} from "../../Controllers/usePushNotification";

const auth = getAuth(app);

const HomePage = ({ navigation }) => {
  const [loading, setLoading] = React.useState(false);
  const [chats, setChats] = React.useState([]);
  const chatDataArray = [];

  const currentUserId = auth.currentUser.uid;
  const db = getDatabase();
  const userChatIdsRef = ref(db, `users/${currentUserId}/chatIds`);

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
    // Handle button press based on the name
    if (name === "add_chat") {
      //handleModalToggle();
      navigation.navigate("CreateChat");
    } else if (name === "add_friend") {
      navigation.navigate("AddFriend");
    }
  };

  const handleChatCardPress = (pressedChat) => {
    navigation.navigate("MessagesPage", pressedChat);
  };

  const handleChatData = (chatId, chatSnapshot) => {
    if (chatSnapshot.exists()) {
      const chatData = { chatId, ...chatSnapshot.val() };
      chatDataArray.push(chatData);
    }
  };


  const handleUserChatIdsSnapshot = (snapshot) => {
    if (snapshot.exists()) {
      const chatIds = Object.keys(snapshot.val());
      // Clear the array before fetching new data
      chatDataArray.length = 0;

      chatIds.forEach((chatId) => {
        const chatRef = ref(db, `Chats/${chatId}`);
        onValue(chatRef, (chatSnapshot) => {
          handleChatData(chatId, chatSnapshot);
          // Update the state only once, after processing all chat data
          if (chatDataArray.length === chatIds.length) {
            const parsedChatData = ParseContentData(
              chatDataArray,
              "updatedAt",
              true
            );

            const chatsWithLastMessage = parsedChatData.map((chat) => {
              let lastMessage;

              if (!chat.messages || chat.messages.length === 0) {
                lastMessage = "No message yet";
              } else {
                lastMessage = ParseContentData(
                  chat.messages,
                  "sendAt",
                  true
                )[0];
                // Update the chats updateAt field
                update(ref(db, `Chats/${chat.chatId}`), {
                  updatedAt: lastMessage.sendAt,
                }).then(() => {
                  console.log(chats);
                });
              }
              return {
                ...chat,
                lastMessage,
              };
            });

            setChats(chatsWithLastMessage);
            setLoading(false);
          }
        });
      });
    } else {
      setChats([]);
      setLoading(false);
    }
  };

  const fetchChatData = () => {
    setLoading(true);

    onValue(userChatIdsRef, handleUserChatIdsSnapshot);
  };

  React.useEffect(() => {
    fetchChatData();
  }, []);
  React.useEffect(() => {
    console.log("yeni mesaj geldi");
  }, [chats]);

  // Handle loading state
  if (loading) {
    return <Loading></Loading>;
  }
  return (
    <View style={styles.container}>
      {chats.length > 0 ? (
        <FlatList
          data={chats}
          keyExtractor={(item) => item.chatId}
          style={styles.flatListContainer}
          renderItem={({ item }) => (
            <ChatCard
              chatName={item.name}
              chatImage={item.chatImage}
              participants={item.participants}
              updatedAt={item.updatedAt}
              lastMessage={item.lastMessage}
              onPress={() => handleChatCardPress(item)}
            />
          )}
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