import { StyleSheet, Text, View, TouchableOpacity,Image } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomePage } from "./src/pages/HomePage/HomePage";
import { SignUp } from "./src/pages/SignUpPage/SignUp";
import { LoginPage } from "./src/pages/LoginPage/LoginPage";
import { ProfilePage } from "./src/pages/ProfilePage/ProfilePage";
import MessagesPage from "./src/pages/MessagesPage/MessagesPage";
import React, { useCallback,useEffect, useState } from "react";
import FlashMessage from "react-native-flash-message";
import { useAuthentication } from "./src/Controllers/UserAuthController";
import Loading from "./src/Components/Loading/Loading";
import AddFriend from "./src/pages/AddFriendPage/AddFriend";
import CreateChat from "./src/pages/CreateChatPage/CreateChat";
import EnterChatDetails from "./src/pages/CreateChatPage/EnterChatDetails";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import * as SplashScreen from 'expo-splash-screen';
const Stack = createNativeStackNavigator();
SplashScreen.preventAutoHideAsync();


const AuthorizationStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#82368C",
        },
        headerTintColor: "#FFFFFF",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerTitleAlign: "center",
        headerLeft: () => <Image style={{ width: 50, height: 50 , tintColor: "#FFFFFF"}} source={require("./assets/chat.png")}></Image>,
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
        headerTintColor: "#FFFFFF",
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
                {/* <Text style={{ color: "#3C3C3B" }}>Profil</Text> */}
                <Icon name="account"  size={35} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          ),
          headerLeft: () => <Image style={{ width: 50, height: 50 , tintColor: "#FFFFFF"}} source={require("./assets/icon.png")}></Image>,
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
        options={({ route, navigation }) => ({
          title: route.params.name,
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.navigate('Home')}>
              <Icon name="arrow-left" size={25} color="white" />
            </TouchableOpacity>
          ),
        })}
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
  const [appIsReady, setAppIsReady] = useState(false);

  // useEffect(() => {
  //   async function prepare() {
  //     try {
  //       // Pre-load fonts, make any API calls you need to do here
  //       await Font.loadAsync(Entypo.font);
  //     } catch (e) {
  //       console.warn(e);
  //     } finally {
  //       // Tell the application to render
  //       setAppIsReady(true);
  //     }
  //   }

  //   prepare();
  // }, []);

  // const onLayoutRootView = async () => {
  //   if (appIsReady) {
  //     console.log("App is ready");
  //     await SplashScreen.hideAsync();
  //   }
  // }

  if (loading) {
    return <Loading />;
  }

  return (
    <NavigationContainer onReady={async()=> await SplashScreen.hideAsync()}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: "#82368C",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerTitleAlign: "center",
          statusBarColor: "#82368C",
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
