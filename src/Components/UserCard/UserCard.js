import React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import styles from "./UserCard.style";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const UserCard = ({ user }) => {
  const [item, setItem] = React.useState({});
  const [loading, setLoading] = React.useState(true);
  //setItem(user.item);
  // const fetchUserData = async () => {
  //   setLoading(true);
  //   const usernameToFetch = user.item; // Replace with the desired username
  //   // create a foreach loop for each user in user that comes as prop
  //   const userData = await getUserAttributesbyUsername(usernameToFetch);

  //   console.log(userData);
  //   if (userData) {
  //     const parsedUserData = ParseContentData(userData);
  //     setUser(parsedUserData);
  //     setLoading(false);
  //   } else {
  //     console.log("User not found or error occurred.");
  //   }
  // };
  // React.useEffect(() => {
  //   fetchUserData();
  // }, []);
  // if (loading) {
  //   return <Loading></Loading>;
  // }
  React.useEffect(() => {
    setItem(user.item);
  },[user])

  return (
    <View key={item.userid} style={styles.container}>
      <View style={styles.imageContainer}>
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
        
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.username}>{item.username}</Text>
      </View>
    </View>
  );
};

export default UserCard;
