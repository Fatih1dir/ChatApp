import React, { useState, useEffect } from "react";
import { Text, View, TextInput, TouchableOpacity, FlatList } from "react-native";
import { getDatabase, ref, get,set } from "firebase/database";
import AddFriendCard from "../../Components/AddFriendCard/AddFriendCard";
import styles from "./AddFriend.style";
import { getAuth } from "firebase/auth";
import { app } from "../../../firebaseConfig";
import { showMessage } from 'react-native-flash-message';


const AddFriend = () => {
  const [searchText, setSearchText] = useState("");
  const [usernames, setUsernames] = useState([]);
  const auth = getAuth(app);
  const db = getDatabase();
  const usernamesRef = ref(db, "usernames");

  // Fetch usernames from your database and set them to the state
  const fetchData = async () => {
    try {
      const snapshot = await get(usernamesRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        
        if (data) {
          // Extract usernames from the objects and filter out non-strings
          const usernamesArray = Object.keys(data).map(key=>{
              return{
                  username:key,
                  ...data[key],
              }
          })
          setUsernames(usernamesArray);
        } else {
          // Handle the case when there are no usernames
          setUsernames([]);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const filterUsernames = () => {
    return usernames.filter((username) =>
      username.username.toLowerCase().includes(searchText.toLowerCase()) && username.userid !== auth.currentUser.uid
    );
  };

  const handleAddFriend = async (friendUserId) => {
    try {
      // Update the current user's data with the friend's userid
      await set(ref(db,`users/${auth.currentUser.uid}/friends/${friendUserId.userid}`), friendUserId.username);

      // Handle success (you can show a success message or navigate to a different screen)
      showMessage({
        message: `${friendUserId.username} added as friend.`,
        type: 'success',
      });
    } catch (error) {
      showMessage({
        message: `Friend couldn't added. Try again later.`,
        type: 'danger',
      });
    }
  };

  return (
    <View>
      <TextInput style={styles.searchInput}
        placeholder="Enter a username to search"
        value={searchText}
        onChangeText={(text) => setSearchText(text)}
      />
      {usernames.length>0 && searchText.length>2 && (
        <FlatList
          data={filterUsernames()}
          keyExtractor={(item) => item.userid}
          renderItem={({ item }) => (
            <AddFriendCard user={item} onAddFriend={()=>handleAddFriend(item)}/>
          )}
        />
      )}
    </View>
  );
};

export default AddFriend;
