import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomePage } from "./src/pages/HomePage/HomePage";
import { SignUp } from "./src/pages/SignUpPage/SignUp";
import { LoginPage } from "./src/pages/LoginPage/LoginPage";
import { ProfilePage } from "./src/pages/ProfilePage/ProfilePage";
import MessagesPage from "./src/pages/MessagesPage/MessagesPage";
import React, { useEffect, useState } from "react";
import FlashMessage from "react-native-flash-message";
import { useAuthentication } from "./src/Controllers/UserAuthController";
import Loading from "./src/Components/Loading/Loading";
import AddFriend from "./src/pages/AddFriendPage/AddFriend";
import CreateChat from "./src/pages/CreateChatPage/CreateChat";
import EnterChatDetails from "./src/pages/CreateChatPage/EnterChatDetails";

const Stack = createNativeStackNavigator();

const AuthorizationStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#82368C",
        },
        headerTintColor: "#3C3C3B",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="LoginPage"
        component={LoginPage}
        options={{ title: "Giriş Yap" }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={{ title: "Kayıt" }}
      />
    </Stack.Navigator>
  );
};

const UserStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#82368C",
        },
        headerTintColor: "#3C3C3B",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomePage}
        options={({ navigation }) => ({
          title: "Mesajlar",
          headerRight: () => (
            <View>
              <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
                <Text style={{ color: "#3C3C3B" }}>Profil</Text>
              </TouchableOpacity>
            </View>
          ),
        })}
      />
      <Stack.Screen
        name="Profile"
        component={ProfilePage}
        options={{ title: "Profil" }}
      />
      <Stack.Screen
        name="MessagesPage"
        component={MessagesPage}
        options={{ title: "Mesajlar" }}
      />
      <Stack.Screen
        name="AddFriend"
        component={AddFriend}
        options={{ title: "Arkadaş ekle" }}
      />
      <Stack.Screen
        name="CreateChat"
        component={CreateChat}
        options={{ title: "Mesaj oluştur" }}
      />
      <Stack.Screen
        name="EnterChatDetails"
        component={EnterChatDetails}
        options={{ title: "Mesaj detayları" }}
      />
    </Stack.Navigator>
  );
};

export default function App() {
  const { user, loading } = useAuthentication();

  if (loading) {
    return (
      <Loading></Loading>
    );
  }

  // if(loading)
  //   return <Loading/>
  // const [userSession, setUserSession] = useState(null); // Initialize as null

  // useEffect(() => {
  //   const auth = getAuth(app); // Get the authentication instance

  //   // Use onAuthStateChanged to listen for authentication state changes
  //   const unsubscribe = onAuthStateChanged(auth, (user) => {
  //     setUserSession(user); // Set user session state
  //   });

  //   // Clean up the listener when the component unmounts
  //   return () => unsubscribe();
  // }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: "#610C9F",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerTitleAlign: "center",
        }}
      >
        {user ? (
          <Stack.Screen
            name="UserStack"
            component={UserStack}
            options={{ headerShown: false }}
          />
        ) : (
          <Stack.Screen
            name="AuthorizationStack"
            component={AuthorizationStack}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
      <FlashMessage position="top" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
