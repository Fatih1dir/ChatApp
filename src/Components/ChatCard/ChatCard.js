import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import styles from "../ChatCard/ChatCard.style";
import { formatDistance, parseISO } from "date-fns";
import tr from "date-fns/locale/tr";

function ChatCard({
  chatName,
  participants,
  updatedAt,
  lastMessage,
  chatImage,
  onPress,
}) {
  const formattedDate = formatDistance(parseISO(updatedAt), new Date(), {
    addSuffix: true,
    locale: tr,
  });

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {chatImage && (
            <Image source={{ uri: chatImage }} style={styles.chatImage} />
          )}
          <View>
            <Text style={styles.chatName}>{chatName}</Text>
            <Text style={styles.participants}>
              {"(" + participants.join(", ") + ")"}
            </Text>
          </View>
        </View>
        <Text style={styles.updatedAt}>{formattedDate}</Text>
      </View>
      <View style={styles.lastMessageContainer}>
        <Text >{lastMessage.senderUsername}</Text>
        <Text style={styles.lastMessage}>{lastMessage ? lastMessage.message : "No message yet"}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default ChatCard;
