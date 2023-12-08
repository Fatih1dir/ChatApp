import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  FlatList,
} from "react-native";
import Button from "../../Components/Button/Button";
import { StyleSheet, Dimensions } from "react-native";
import { ref, get, child, getDatabase } from "firebase/database";
import { app } from "../../../firebaseConfig";
import { getAuth } from "firebase/auth";
import styles from "./CreateChat.style";
import Icon from "react-native-vector-icons/Ionicons";

const CreateChat = ({navigation}) => {
  const db = getDatabase(app);
  const auth = getAuth(app);
  const [friends, setFriends] = useState([]); // Array to store friends' usernames

  const [selectedUsers, setSelectedUsers] = useState([]);

  const handleToggleSelect = (username) => {
    const isSelected = selectedUsers.includes(username);
    if (isSelected) {
      setSelectedUsers((prevSelected) =>
        prevSelected.filter((user) => user !== username)
        
      );
    } else {
      setSelectedUsers((prevSelected) => [...prevSelected, username]);
    }
    
  };

  React.useEffect(() => {
    // Fetch friends from the database and set them to the state
    const fetchData = async () => {
      try {
        const friendsRef = ref(
          getDatabase(app),
          `users/${auth.currentUser.uid}/friends`
        );
        const friendsSnapshot = await get(friendsRef);

        if (friendsSnapshot.exists()) {
          const friendsData = friendsSnapshot.val();
          const friendsArray = Object.values(friendsData);
          setFriends(friendsArray);
        } else {
          setFriends([]);
        }
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };

    fetchData();
  }, []);

  const renderUsers = (item) => {

    const isSelected = selectedUsers.includes(item);

    return (
      <View style={styles.userView}>
        <Text style={styles.usernameText}>{item}</Text>
        <TouchableOpacity onPress={() => handleToggleSelect(item)}>
          <Icon
            name={isSelected ? "checkmark" : "add"}
            size={30}
            color={isSelected ? "green" : "blue"}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const handleEnterChatDetails=()=>{
    navigation.navigate("EnterChatDetails",{selectedUsers})
  }

  return (
    <View style={styles.container}>
      <Text>Add your friends to chat</Text>
      <FlatList
        data={friends}
        keyExtractor={(item) => item}
        renderItem={({ item }) => renderUsers(item)}
      />
      {selectedUsers.length > 0 && (
        <TouchableOpacity style={styles.floatingButton} onPress={() => handleEnterChatDetails()}>
          <Icon size={40} name="arrow-forward" color={"#82368C"} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default CreateChat;
