import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import styles from "../ChatCard/ChatCard.style";
import {formatDistance, parseISO} from 'date-fns'
import tr from "date-fns/locale/tr";


function ChatCard({ chatName, participants, updatedAt, lastMessage, onPress }) {

  const formattedDate = formatDistance(parseISO(updatedAt), new Date(), { addSuffix: true,locale:tr })

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.chatName}>{chatName}</Text>
          <Text style={styles.participants}>{"("+participants.join(", ")+")"}</Text>
        </View>
        <Text style={styles.updatedAt}>{formattedDate}</Text>
      </View>
      <Text style={styles.lastMessage}>{lastMessage}</Text>
    </TouchableOpacity>
  );
}

export default ChatCard;
