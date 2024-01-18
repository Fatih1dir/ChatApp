import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { getUserAttributesbyId } from "../../Controllers/User";
import ParseContentData from "../../Controllers/ParseContentData";
import styles from './AddFriendCard.style';

const AddFriendCard = ({ user, onAddFriend }) => {
  const [attributes, setAttributes] = React.useState([]);
  const fetchUserData = async () => {
    try {
      const data = await getUserAttributesbyId(user.userid);
      if (data) {
        const parsedData = ParseContentData(data);
        setAttributes(parsedData[0]);
        console.log(attributes);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  React.useEffect(() => {
    fetchUserData();
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Image style={styles.image} source={{ uri: attributes.profilePic }} />
        <Text style={styles.username}>{user.username}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.addButton} onPress={() => onAddFriend(user)}>
          <Text>Add Friend</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};



export default AddFriendCard;
