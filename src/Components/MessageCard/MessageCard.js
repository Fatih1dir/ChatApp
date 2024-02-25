import React from "react";
import { View, Text, Image, SafeAreaView } from "react-native";
import styles from "./MessageCard.style";
import { format, isToday, isYesterday, parseISO } from "date-fns";
import tr from "date-fns/locale/tr";
import { getDatabase, ref, get } from "firebase/database";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ChatBubble from "react-native-chat-bubble";

const MessageCard = ({ message, currentUserId }) => {
  const parsedDate = message.sendAt ? parseISO(message.sendAt) : null;
  const [user, setUser] = React.useState({});
  const [formattedDate, setFormattedDate] = React.useState("");

  const isCurrentUserMessage = message.senderId === currentUserId;

  const dateFormat = (dateToFormat) => {
    const date = parseISO(dateToFormat);

    if (isToday(dateToFormat)) {
      return format(dateToFormat, "HH:mm", { locale: tr });
    } else if (isYesterday(dateToFormat)) {
      return `Dün ${format(dateToFormat, "HH:mm", { locale: tr })}`;
    } else {
      return format(dateToFormat, "MM/dd/yyyy", { locale: tr });
    }
  };

  const fetchUser = () => {
    const db = getDatabase();
    const userRef = ref(db, `users/${message.senderId}`);
    get(userRef).then((snapshot) => {
      if (snapshot.exists()) {
        const userData = snapshot.val();
        setUser(userData);
      } else {
        console.log("No data available");
      }
    });
  };

  React.useEffect(() => {
    setFormattedDate(dateFormat(parsedDate));
    fetchUser();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.leftContainer}>
        {/* Left side: Profile Image for the current user */}
        {!isCurrentUserMessage && user.profilePic && (
          <Image style={styles.userImage} source={{ uri: user.profilePic }} />
        )}
        {!isCurrentUserMessage && !user.profilePic && (
          <Icon
            name="account"
            size={30}
            color="#1084ff"
            style={styles.blankProfileCircle}
          />
        )}
      </View>

      <View style={styles.chatBubbleContainer}>
        <ChatBubble
          isOwnMessage={isCurrentUserMessage}
          {...(isCurrentUserMessage
            ? { bubbleColor: "#1084ff" }
            : { bubbleColor: "#8fbff2" })}
          {...(isCurrentUserMessage
            ? { tailColor: "#1084ff" }
            : { tailColor: "#8fbff2" })}
          withTail={true}
        >
          {message.isAnonymous ? (
            <Text style={styles.user}>Anonim</Text>
          ) : (
            <Text style={styles.user}>{user.username}</Text>
          )}
          <Text style={styles.message}>{message.message}</Text>
          <Text
            style={[
              styles.container,
              isCurrentUserMessage ? styles.justifyRight : styles.justifyLeft,
            ]}
          >
            {formattedDate}
          </Text>
        </ChatBubble>
      </View>

      <View style={styles.rightContainer}>
        {/* Right side: Profile Image for the other user */}
        {isCurrentUserMessage && user.profilePic && (
          <Image style={styles.userImage} source={{ uri: user.profilePic }} />
        )}
        {isCurrentUserMessage && !user.profilePic && (
          <Icon
            name="account"
            size={30}
            color="#1084ff"
            style={styles.blankProfileCircle}
          />
        )}
      </View>
    </SafeAreaView>
  );
};
export default MessageCard;
