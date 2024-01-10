import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import styles from "./MessagesPage.style";
import Input from "../../Components/Input/Input";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { getAuth } from "firebase/auth";
import { app } from "../../../firebaseConfig";
import { SendMessage } from "../../Controllers/SendMessageController";
import { getDatabase, ref, push, set, get, onValue } from "firebase/database";
import ParseContentData from "../../Controllers/ParseContentData";
import MessageCard from "../../Components/MessageCard/MessageCard";
function MessagesPage({ route }) {
  const db = getDatabase();
  const messagesId = route.params;
  const auth = getAuth(app);
  const [value, setValue] = React.useState("");
  const [messages, setMessages] = React.useState({});

  const onType = (text) => {
    setValue(text);
  };

  const handleMessageSend = (messagesId, senderId, content) => {
    setValue("");
    SendMessage(messagesId, senderId, content);
  };

  const getMessages = () => {
    onValue(ref(db, `Chats/${messagesId}/messages`), (messageSnapshot) => {
      if (messageSnapshot.exists()) {
        const messageData = messageSnapshot.val();
        const parsedChat = ParseContentData(messageData);
        setMessages(parsedChat);
      }
    });
  };

  React.useEffect(() => {
    getMessages();
  }, []);

  return (
    <View style={styles.container}>
      <View>
        {messages.length > 0 && (
          <FlatList
            data={messages}
            renderItem={({ item }) => <MessageCard message={item} currentUserId={auth.currentUser.uid} />}
            keyExtractor={(item) => item.sendAt}
          ></FlatList>
        )}
      </View>

      <View style={styles.inputContainer}>
        <View style={styles.inputTextcontainer}>
          <TextInput
            style={styles.input}
            placeholder={"Bir mesaj gönderin"}
            onChangeText={onType}
            value={value}
          />
          <TouchableOpacity
            onPress={() =>
              handleMessageSend(messagesId, auth.currentUser.uid, value)
            }
          >
            <Icon name={"send"} size={25} color="#1ac0c6" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default MessagesPage;
