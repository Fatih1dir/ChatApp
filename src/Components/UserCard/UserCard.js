import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import styles from './UserCard.style';

const UserCard = ({ user, onAddFriend }) => {

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {/* <Image style={styles.image} source={{ uri: imageUrl }} /> */}
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.username}>{user.username}</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => onAddFriend(user)}>
          <Text>Add Friend</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};



export default UserCard;
