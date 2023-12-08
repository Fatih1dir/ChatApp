import React, { useState } from "react";
import { Text, View, SafeAreaView, TouchableOpacity, TextInput, Image, Button as RNButton } from "react-native";
import { app } from "../../../firebaseConfig";
import { getAuth } from "firebase/auth";
// import { ref, get, set } from "firebase/database";
// import storage from 'firebase/storage'; // Import storage from Firebase
// import * as ImagePicker from 'expo-image-picker'; // Import ImagePicker for selecting images
import Button from "../../Components/Button/Button";

const auth = getAuth(app);
//const db = app.database();
//const storageRef = app.storage().ref();

    const ProfilePage = ({ navigation }) => {
//   const [user] = useState(auth.currentUser);
//   const [email, setEmail] = useState("");
//   const [username, setUsername] = useState("");
//   const [dateOfBirth, setDateOfBirth] = useState("");
//   const [sex, setSex] = useState("");
//   const [profilePic, setProfilePic] = useState(null); // Profile picture state
//   const [isEditing, setIsEditing] = useState(false);

//   const onImagePickPress = async () => {
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 1,
//     });

//     if (!result.cancelled) {
//       setProfilePic(result.uri);
//     }
//   };

//   const onSaveChanges = async () => {
//     const userId = user.uid;
//     const userRef = ref(db, `users/${userId}`);
//     const userData = {
//       email,
//       username,
//       dateOfBirth,
//       sex,
//       profilePic: profilePic, // Save the profile picture URL
//     };

//     if (profilePic) {
//       // Upload the profile picture to Firebase Storage
//       const profilePicRef = storageRef.child(`profile_pics/${userId}`);
//       await profilePicRef.putFile(profilePic);
//       const downloadURL = await profilePicRef.getDownloadURL();
//       userData.profilePic = downloadURL;
//     }

//     set(userRef, userData)
//       .then(() => {
//         setIsEditing(false);
//       })
//       .catch((error) => {
//         console.error("Error updating user data:", error);
//       });
//   };

  const onLogOutPress = () => {
    auth.signOut().then(() => console.log("User signed out!"));
  };

  return (
    <SafeAreaView>
      <Button text="Logout" onPress={onLogOutPress} />

      {/* {user && (
        <View>
          <Text>Email: {email}</Text>
          <Text>Username: {username}</Text>
          <Text>Date of Birth: {dateOfBirth}</Text>
          <Text>Sex: {sex}</Text>
          {profilePic && <Image source={{ uri: profilePic }} style={{ width: 100, height: 100 }} />}

          {isEditing && (
            <View>
              <TextInput
                placeholder="Email"
                value={email}
                onChangeText={(text) => setEmail(text)}
              />
              <TextInput
                placeholder="Username"
                value={username}
                onChangeText={(text) => setUsername(text)}
              />
              <TextInput
                placeholder="Date of Birth"
                value={dateOfBirth}
                onChangeText={(text) => setDateOfBirth(text)}
              />
              <TextInput
                placeholder="Sex"
                value={sex}
                onChangeText={(text) => setSex(text)}
              />
              <RNButton title="Pick Profile Picture" onPress={onImagePickPress} />
              <Button text="Save Changes" onPress={onSaveChanges} />
            </View>
          )}
        </View>
      )} */}
    </SafeAreaView>
  );
};

export { ProfilePage };
