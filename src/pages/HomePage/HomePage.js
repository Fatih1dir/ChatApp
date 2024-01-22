import React from "react";
import { Text, View, SafeAreaView, FlatList } from "react-native";
import styles from "./HomePage.style";
import { app } from "../../../firebaseConfig";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, get, onValue,update } from "firebase/database";
import Button from "../../Components/Button/Button";
import CreateChatModal from "../../Components/Modal/CreateChatModal/CreateChatModal";
import { createChat } from "../../Controllers/CreateChatController";
import ChatCard from "../../Components/ChatCard/ChatCard";
import { FloatingAction } from 'react-native-floating-action';
import Loading from "../../Components/Loading/Loading";
import ParseContentData from "../../Controllers/ParseContentData";

const auth = getAuth(app);

const HomePage = ({ navigation }) => {
  const [loading,setLoading]  = React.useState(false);
  const [chatModalVisible, setChatModalVisible] = React.useState(false);
  const [chats, setChats] = React.useState([]);
  const chatDataArray = [];
  
  const currentUserId = auth.currentUser.uid;
  const db = getDatabase();
  const userChatIdsRef = ref(db, `users/${currentUserId}/chatIds`);

  const actions = [
    {
      icon:require("../../../assets/add_chat_Icon.png"),
      text: 'Mesaj oluştur',
      name: 'add_chat',
      position: 1,
      color:"#82368C"
    },
    {
      icon:require("../../../assets/add_friend_Icon.png"),
      text: 'Arkadaş ekle',
      name: 'add_friend',
      position: 2,
      color:"#82368C"
    },
  ];

  const handlePress = (name) => {
    // Handle button press based on the name
    if (name === 'add_chat') {
      //handleModalToggle();
      navigation.navigate("CreateChat");
    } 
    else if (name === 'add_friend') {
      navigation.navigate("AddFriend");
    }
  };

  const handleChatCardPress=(pressedChatId)=>{
    navigation.navigate("MessagesPage",pressedChatId);
  }

  const handleModalSend = (username, chatname) => {
    setChatModalVisible(!chatModalVisible);
    createChat(currentUserId, chatname, username);
  };

  const handleModalToggle = () => {
    setChatModalVisible(!chatModalVisible);
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
            const parsedChatData = ParseContentData(chatDataArray,"updatedAt",true);

            const chatsWithLastMessage = parsedChatData.map((chat) => {
              let lastMessage;
            
              if (!chat.messages || chat.messages.length === 0) {
                lastMessage = "No message yet";
              } else {
                lastMessage = ParseContentData(chat.messages, "sendAt", true)[0];
                // Update the chats updateAt field
                update(ref(db, `Chats/${chat.chatId}`), {
                  updatedAt: lastMessage.sendAt,
                }).then(() => {
                  console.log("Chat updated successfully");
                })
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

  // Handle loading state
  if (loading) {
    return (
      <Loading></Loading>
    );
  }
  return (
    <View style={styles.container}>
      {chats.length > 0 ? (
        <FlatList
          data={chats}
          keyExtractor={(item) => item.chatId}
          renderItem={({ item }) => (
            <ChatCard
              chatName={item.name}
              chatImage={item.chatImage}
              participants={item.participants}
              updatedAt={item.updatedAt}
              lastMessage={item.lastMessage}
              onPress={()=>handleChatCardPress(item.chatId)}
            />
          )}
          style={styles.flatListContainer}
        />
      ) : (
        <Text>You have no chat</Text>
      )}
      <CreateChatModal
        visible={chatModalVisible}
        onSend={handleModalSend}
        onClose={handleModalToggle}
      />
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