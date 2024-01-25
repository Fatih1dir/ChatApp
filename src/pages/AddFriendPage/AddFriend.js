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
  const [friends, setFriends] = useState([]); // Array to store friends' usernames
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
  const fetchFriends = async () => {
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
  useEffect(() => {
    fetchData();
    fetchFriends();
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
        message: `${friendUserId.username} artık arkadaşınız.`,
        type: 'success',
      });
    } catch (error) {
      showMessage({
        message: `Arkadaş eklenemedi. Lütfen sonra tekrar deneyin.`,
        type: 'danger',
      });
    }
  };

  return (
    <View>
      <TextInput style={styles.searchInput}
        placeholder="Bir kullanıcı adı girerek arkadaş ekleyin."
        value={searchText}
        onChangeText={(text) => setSearchText(text)}
      />
      {usernames.length>0 && searchText.length>2 && (
        <FlatList
          data={filterUsernames()}
          keyExtractor={(item) => item.userid}
          renderItem={({ item }) => (
            <AddFriendCard user={item} onAddFriend={()=>handleAddFriend(item)} friends={friends}/>
          )}
        />
      )}
    </View>
  );
};

export default AddFriend;
