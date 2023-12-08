import React from "react";
import { Text, View, SafeAreaView, FlatList } from "react-native";
import styles from "./HomePage.style";
import { app } from "../../../firebaseConfig";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, get, onValue } from "firebase/database";
import Button from "../../Components/Button/Button";
import CreateChatModal from "../../Components/Modal/CreateChatModal/CreateChatModal";
import { createChat } from "../../Controllers/CreateChatController";
import ChatCard from "../../Components/ChatCard/ChatCard";
import { FloatingAction } from 'react-native-floating-action';
import Loading from "../../Components/Loading/Loading";

const auth = getAuth(app);

const HomePage = ({ navigation }) => {
  const [loading,setLoading]  = React.useState(false);
  const [chatModalVisible, setChatModalVisible] = React.useState(false);
  const [chats, setChats] = React.useState([]);
  const currentUserId = auth.currentUser.uid;
  const db = getDatabase();
  const userChatIdsRef = ref(db, `users/${currentUserId}/chatIds`);

  const actions = [
    {
      icon:null,
      text: 'Add Chat',
      name: 'add_chat',
      position: 1,
    },
    {
      icon:null,
      text: 'Add Friend',
      name: 'add_friend',
      position: 2,
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

  const fetchChatData = () => {
    setLoading(true);
    const chatDataArray = [];

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
              setChats(chatDataArray);
              setLoading(false);
            }
          });
        });
      } else {
        setChats([]);
        setLoading(false);
      }
    };

    onValue(userChatIdsRef, handleUserChatIdsSnapshot);
  };

  React.useEffect(() => {
    fetchChatData();
  }, []);

  // const fetchChatData = async () => {
  //   try {
  //     const snapshot = await get(userChatIdsRef);

  //     if (snapshot.exists()) {
  //       const chatIds = Object.keys(snapshot.val());

  //       const chatDataArray = await Promise.all(
  //         chatIds.map(async (chatId) => {
  //           const chatRef = ref(db, `Chats/${chatId}`);
  //           const chatSnapshot = await get(chatRef);

  //           if (chatSnapshot.exists()) {
  //             return { chatId, ...chatSnapshot.val() };
  //           }

  //           return null; // Handle non-existent chat data
  //         })
  //       );

  //       setChats(chatDataArray.filter((chat) => chat !== null));
  //     } else {
  //       setChats([]); // No chat IDs found
  //     }
  //   } catch (error) {
  //     console.error("Error fetching chat data:", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchChatData(); // Fetch chat data when the component mounts
  // }, []);

  

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
              participants={item.participants}
              updatedAt={item.updatedAt}
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
      {/* <Button
        text={"Add new chat"}
        onPress={handleModalToggle}
        style={styles.button}
      /> */}
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
