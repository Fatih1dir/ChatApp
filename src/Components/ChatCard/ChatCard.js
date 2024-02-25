import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import styles from "../ChatCard/ChatCard.style";
import { format, isToday, isYesterday, parseISO } from 'date-fns';
import tr from "date-fns/locale/tr";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

function ChatCard({
  chatName,
  participants,
  updatedAt,
  lastMessage,
  chatImage,
  onPress,
}) {
  const [formattedDate, setFormattedDate] = React.useState("");
  const [maxLength, setMaxLength] = React.useState(40);

  // Function to truncate the message to a specified length
  const truncateMessage = (message, maxLength) => {
    if (!message) {
      return ""; // Handle the case where message is undefined or null
    }

    const truncatedMessage = message.substring(0, maxLength - 3);
    return truncatedMessage.length < message.length
      ? truncatedMessage + "..."
      : truncatedMessage;
  };



  const dateFormat = (dateToFormat) => {
    const date = parseISO(dateToFormat);

    if (isToday(date)) {
      return format(date, "HH:mm", { locale: tr });
    } else if (isYesterday(date)) {
      return "Dün";
    } else {
      return format(date, "MM/dd/yyyy", { locale: tr });
    }
  };

  const handleOnLongPress=()=>{
    
  }

  React.useEffect(() => {
    setFormattedDate(dateFormat(updatedAt));

    // Check if lastMessage is defined before accessing its properties
    if (lastMessage && lastMessage.message) {
      const screenWidth = Dimensions.get("window").width;
      let newMaxLength = 30;

      if (
        lastMessage.message.length + lastMessage.senderUsername.length > 20 &&
        screenWidth > 0
      ) {
        newMaxLength = Math.floor((screenWidth / 10) * 4);
        setMaxLength(newMaxLength);
      }
    }
  }, [lastMessage, updatedAt]);


  return (
    <TouchableOpacity style={styles.card} onPress={onPress} onLongPress={()=>handleOnLongPress()}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {chatImage ? (
            <Image source={{ uri: chatImage }} style={styles.chatImage} />
          ) : (
            <Icon
              style={styles.blankProfileCircle}
              size={50}
              name="account"
              color="#1ac0c6"
            ></Icon>
          )}
          <View>
            <Text style={styles.chatName}>{truncateMessage(chatName, 20)}</Text>
          </View>
        </View>
        <Text style={styles.updatedAt}>{formattedDate}</Text>
      </View>
      {lastMessage.message ? (
        <View style={styles.lastMessageContainer}>
          {lastMessage.isAnonymous ? (
            <Text style={styles.username}>Anonim:</Text>
          ) : (
            <Text style={styles.username}>{lastMessage.senderUsername}:</Text>
          )}
          <Text style={styles.lastMessage}>
            {truncateMessage(lastMessage.message, 30)}
          </Text>
        </View>
      ) : lastMessage=="No message yet" ? (
        <Text style={{flex:1,alignSelf:"center",color:"#3C3C3B"}}>Henüz mesajınız yok.Bir mesaj gönderin.</Text>
      ): null}
    </TouchableOpacity>
  );
}

export default ChatCard;
