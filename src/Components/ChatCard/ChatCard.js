import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
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
  const formattedDate = formatDistance(parseISO(updatedAt), new Date(), {
    addSuffix: true,
    locale: tr,
  });

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
      <View style={styles.lastMessageContainer}>
        {lastMessage.isAnonymous ? (
          <Text>Anonim</Text>
        ) : (
          <Text style={styles.username}>{lastMessage.senderUsername}</Text>
        )}
        <Text style={styles.lastMessage}>
          {lastMessage ? lastMessage.message : "No message yet"}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default ChatCard;
