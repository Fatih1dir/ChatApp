import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from "react-native";
import styles from "../ChatCard/ChatCard.style";
import { formatDistance, parseISO } from "date-fns";
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
  const [maxLength, setMaxLength] = React.useState(40);
  const formattedDate = formatDistance(parseISO(updatedAt), new Date(), {
    addSuffix: true,
    locale: tr,
  });

  // Function to truncate the message to a specified length
  const truncateMessage = (message, maxLength) => {
    const truncatedMessage = message.substring(0, maxLength - 3);
    return truncatedMessage.length < message.length ? truncatedMessage + "..." : truncatedMessage;
  };

  React.useEffect(() => {
    if (lastMessage.message) {
      const screenWidth = Dimensions.get("window").width;

      // Set a default value for the maximum length
      let newMaxLength = 30;

      // You can adjust the logic based on your layout requirements
      if ((lastMessage.message.length + lastMessage.senderUsername.length) > 20 && screenWidth > 0) {
        // Adjust the formula based on your specific requirements
        newMaxLength = Math.floor((screenWidth / 10) * 4);
        setMaxLength(newMaxLength);
      }
    }
  }, [lastMessage.message]);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
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
            <Text style={styles.chatName}>{chatName}</Text>
            {/* <Text style={styles.participants}>
              {"(" + participants.join(", ") + ")"}
            </Text> */}
          </View>
        </View>
        <Text style={styles.updatedAt}>{formattedDate}</Text>
      </View>
      {lastMessage.message ? <View style={styles.lastMessageContainer}>
        {lastMessage.isAnonymous ? (
          <Text style={styles.username}>Anonim:</Text>
        ) : (
          <Text style={styles.username}>{lastMessage.senderUsername}:</Text>
        )}
        <Text style={styles.lastMessage}>
          {truncateMessage(lastMessage.message, 30)}
        </Text>
      </View> : ( 
        <Text style={{}}>
      </Text>
      )}
      
    </TouchableOpacity>
  );
}

export default ChatCard;
