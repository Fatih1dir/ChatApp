import React from "react";
import { View, Text, Image, TouchableOpacity,ScrollView } from "react-native";
import styles from "./UserCard.style";
import { getUserAttributesbyUsername } from "../../Controllers/User";
import Loading from "../Loading/Loading";
import ParseContentData from "../../Controllers/ParseContentData";

const UserCard = ({ user }) => {
  const [UserState, setUser] = React.useState({});
  const [loading, setLoading] = React.useState(true);
  const fetchUserData = async () => {
    setLoading(true);
    const usernameToFetch = user.item; // Replace with the desired username
    const userData = await getUserAttributesbyUsername(usernameToFetch);

    if (userData) {
      const parsedUserData = ParseContentData(userData);
      setUser(parsedUserData);
      setLoading(false);
    } else {
      console.log("User not found or error occurred.");
    }
  };
  React.useEffect(() => {
    fetchUserData();
  }, []);
  if (loading) {
    return <Loading></Loading>;
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={true}>
      {UserState.map((item) => (
        <View key={item.userid} style={styles.container}>
          <View style={styles.imageContainer}>
            <Image style={styles.image} source={{ uri: item.imageUrl }} />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.username}>{item.id}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default UserCard;
