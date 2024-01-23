import React from 'react';
import {View, Text, TouchableOpacity,Image} from 'react-native';
import styles from './MessageCard.style';
import {formatDistance, parseISO} from 'date-fns';
import tr from 'date-fns/locale/tr';
import { getDatabase, ref, push, set, get, onValue } from "firebase/database";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";


const MessageCard = ({message, currentUserId}) => {
  const parsedDate = message.sendAt ? parseISO(message.sendAt) : null;
  const [user,setUser] = React.useState({});

  // Use the parsedDate or a fallback (current date) for formatting
  const formattedData = formatDistance(parsedDate || new Date(), new Date(), {
    addSuffix: true,
    locale:tr
  });
  // Check if the message is sent by the current user
  const isCurrentUserMessage = message.senderId === currentUserId;

  const fetchUser = () => {
    const db = getDatabase();
    const userRef = ref(db, `users/${message.senderId}`);
    get(userRef).then((snapshot) => {
      if (snapshot.exists()) {
        const userData = snapshot.val();
        setUser(userData);
      } else {
        console.log('No data available');
      }
    });
  }
  React.useEffect(() => {
    fetchUser();
  },[])

  return (
    <View
      style={[
        styles.container,
        isCurrentUserMessage ? styles.justifyRight : styles.justifyLeft,
      ]}
    >
      
      <View style={styles.inner_container}>
        {message.isAnonymous ? (
          <Text style={styles.user}>Anonim</Text>
        ):<Text style={styles.user}>{user.username}</Text>}
        
        <Text style={styles.date}>{formattedData}</Text>
      </View>
      <Text style={styles.title}>{message.message}</Text>
    </View>
  );
};
export default MessageCard;
