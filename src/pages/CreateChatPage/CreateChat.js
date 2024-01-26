import React, { useState } from "react";
import { View, Image, TouchableOpacity, Text, FlatList } from "react-native";
import Button from "../../Components/Button/Button";
import { StyleSheet, Dimensions } from "react-native";
import { ref, get, child, getDatabase } from "firebase/database";
import { app } from "../../../firebaseConfig";
import { getAuth } from "firebase/auth";
import styles from "./CreateChat.style";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const CreateChat = ({ navigation }) => {
  const db = getDatabase(app);
  const auth = getAuth(app);
  const [friends, setFriends] = useState([]); // Array to store friends' usernames
  const [selectedUsers, setSelectedUsers] = useState([]);

  const handleToggleSelect = (user) => {
    const isSelected = selectedUsers.includes(user);
    if (isSelected) {
      setSelectedUsers((prevSelected) =>
        prevSelected.filter((selUser) => selUser !== user)
      );
    } else {
      setSelectedUsers((prevSelected) => [...prevSelected, user]);
    }
  };

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
  React.useEffect(() => {
    fetchData();
  }, []);

  const renderUsers = (item) => {
    const isSelected = selectedUsers.includes(item);

    return (
      <View style={styles.view}>
        <View style={styles.userView}>
          {item.profilePic ? (
            <Image style={styles.image} source={{ uri: item.profilePic }} />
          ) : (
            <Icon
              style={styles.blankProfileCircle}
              size={50}
              name="account"
              color="#1ac0c6"
            ></Icon>
          )}
          <Text style={styles.usernameText}>{item.username}</Text>
        </View>
        <TouchableOpacity onPress={() => handleToggleSelect(item)}>
          <Icon
            name={isSelected ? "check" : "plus"}
            size={30}
            color={isSelected ? "green" : "blue"}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const handleEnterChatDetails = () => {
    navigation.navigate("EnterChatDetails", { selectedUsers });
  };

  return (
    <View style={styles.container}>
      {friends.length === 0 ? (
        <Text style={styles.text}>
          Henüz arkadaş eklemediniz. Bir önceki sayfaya dönerek sağ alttaki artı
          tuşuna basarak arkadaş ekleyebilirsiniz.
        </Text>
      ) : (
        <Text>Mesaja eklemek istediğiniz arkadaşlarınızı seçin</Text>
      )}
      <FlatList
        data={friends}
        keyExtractor={(item) => item.userid}
        renderItem={({ item }) => renderUsers(item)}
      />
      {selectedUsers.length > 0 && (
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => handleEnterChatDetails()}
        >
          <Icon size={40} name="arrow-right" color={"#82368C"} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default CreateChat;
