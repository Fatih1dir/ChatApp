import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import {
  getUserAttributesbyId,
  getUserAttributesbyUsername,
} from "../../Controllers/User";
import ParseContentData from "../../Controllers/ParseContentData";
import styles from "./AddFriendCard.style";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const AddFriendCard = ({ user, onAddFriend, friends }) => {
  const [attributes, setAttributes] = React.useState([]);
  const [isFriendAdded, setFriendAdded] = React.useState(false);
  const fetchUserData = async () => {
    try {
      const data = await getUserAttributesbyId(user.userid);
      if (data) {
        const parsedData = ParseContentData(data);
        setAttributes(parsedData[0]);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  React.useEffect(() => {
    const friendUsernames = friends.map((friend) => friend.username);

    // Check if the friend is already added before fetching user data
    if (friendUsernames.includes(user.username) && !isFriendAdded) {
      setFriendAdded(true);
    } else {
      // Fetch user data and then check if the friend is added
      fetchUserData();
    }
  }, [friends, isFriendAdded]);
  

  const handleAddFriend = () => {
    onAddFriend(user);
    setFriendAdded(true); // Set the state to indicate that friend is added
  };
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        {attributes.profilePic ? (
          <Image style={styles.image} source={{ uri: attributes.profilePic }} />
        ) : (
          <Icon
            style={styles.blankProfileCircle}
            size={50}
            name="account"
            color="#1ac0c6"
          ></Icon>
        )}

        <Text style={styles.username}>{user.username}</Text>
      </View>
      <View style={styles.buttonContainer}>
        {isFriendAdded || friends.includes(user.username) ? (
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: "#1ac0c6" }]}
            disabled={true} // Disable the button after friend is added
          >
            <Text>Arkadaş</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.addButton} onPress={()=>handleAddFriend()}>
            <Text>Arkadaş Ekle</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default AddFriendCard;
