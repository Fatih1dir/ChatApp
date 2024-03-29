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
import { showMessage } from "react-native-flash-message";

function MessagesPage({ route }) {
  const participants = route.params.participants;
  const participantsNum = Object.keys(participants).length;
  const messagesId = route.params.chatId;
  const db = getDatabase();
  const auth = getAuth(app);
  const [value, setValue] = React.useState("");
  const [messages, setMessages] = React.useState({});
  const [isAnonymous, setIsAnonymous] = React.useState(false);

  const onType = (text) => {
    setValue(text);
  };

  const handleMessageSend = (messagesId, senderId, content) => {
    setValue("");
    SendMessage(messagesId, senderId, content, isAnonymous,participants);
  };

  const getMessages = () => {
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setDate(twentyFourHoursAgo.getDate() - 1);
  
    onValue(ref(db, `Chats/${messagesId}/messages`), (messageSnapshot) => {
      if (messageSnapshot.exists()) {
        const messageData = messageSnapshot.val();
        
        // Filter messages sent in the last 24 hours
        const filteredMessages = Object.values(messageData).filter((message) => {
          const messageSendAt = new Date(message.sendAt);
          return messageSendAt > twentyFourHoursAgo;
        });
  
        const parsedChat = ParseContentData(filteredMessages, "sendAt", false);
        setMessages(parsedChat);
      }
    });
  };

  const toggleAnonymousMode = () => {
    if (participantsNum > 2) {
      setIsAnonymous(!isAnonymous);
      if (!isAnonymous) {
        showMessage({
          message: "Anonim mesaj moduna geçtiniz. Kullanıcılar mesajı sizin gönderdiğinizi bilmeyecek.",
          type: "info",
          icon: "info",
          duration: 3000,
        });
      }
      else{
        showMessage({
          message: "Anonim mesaj modundan çıktınız.",
          type: "info",
          icon: "info",
          duration: 3000,
        });
      }
    }
  };

  React.useEffect(() => {
    if(participantsNum > 2) {
      showMessage({
        message: "Gönder butonuna uzun basarak anonim mesaj gönderebilirsiniz",
        type: "info",
        icon: "info",
        duration: 3000,
      });
    }
    
    getMessages();
  }, []);

  return (
    <View style={[isAnonymous ? styles.anonymousContainer : styles.container]}>
      <View style={styles.messagesContainer}>
        {messages.length > 0 && (
          <FlatList
            data={messages}
            renderItem={({ item }) => (
              <MessageCard
                message={item}
                currentUserId={auth.currentUser.uid}
              />
            )}
            keyExtractor={(item) => item.sendAt}
            ref={(ref) => (this.flatList = ref)}
            onContentSizeChange={() =>
              this.flatList.scrollToEnd({ animated: false })
            }
            onLayout={() => this.flatList.scrollToEnd({ animated: false })}
          />
        )}
      </View>

      <View style={styles.inputContainer}>
        <View style={[isAnonymous ? styles.anonymousInputContainer : styles.inputTextcontainer]}>
          <TextInput
            style={[isAnonymous ? styles.anonymousInput : styles.input]}
            placeholder={"Bir mesaj gönderin"}
            onChangeText={onType}
            value={value}
            multiline
            numberOfLines={3}
            placeholderTextColor={isAnonymous ? "white" : "grey"}
          />
          <TouchableOpacity
            onPress={() => {
              if (value.length > 0)
                handleMessageSend(messagesId, auth.currentUser.uid, value);
            }}
            onLongPress={() => {
              toggleAnonymousMode();
            }}
          >
            {isAnonymous ? (
              <Icon name={"send"} size={25} color="black" />
            ) : (
              <Icon name={"send"} size={25} color="#1ac0c6" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default MessagesPage;
