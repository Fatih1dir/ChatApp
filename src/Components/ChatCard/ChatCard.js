import React from "react";
import { View, Text, TouchableOpacity, StyleSheet,Image } from "react-native";
import styles from "../ChatCard/ChatCard.style";
import {formatDistance, parseISO} from 'date-fns'
import tr from "date-fns/locale/tr";


function ChatCard({ chatName, participants, updatedAt, lastMessage,chatImage, onPress }) {

  const formattedDate = formatDistance(parseISO(updatedAt), new Date(), { addSuffix: true,locale:tr })

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {chatImage && (
            <Image
              source={{ uri: chatImage }} // Assuming you pass the chatImage as a URL
              style={styles.chatImage} // Define a style for the chat image, e.g., { width: 40, height: 40, borderRadius: 20 }
            />
          )}
          <View>
            <Text style={styles.chatName}>{chatName}</Text>
            <Text style={styles.participants}>{"(" + participants.join(", ") + ")"}</Text>
          </View>
        </View>
        <Text style={styles.updatedAt}>{formattedDate}</Text>
      </View>
      <Text style={styles.lastMessage}>{lastMessage}</Text>
    </TouchableOpacity>
  );

}

export default ChatCard;
