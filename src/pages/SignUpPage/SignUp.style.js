import React from "react";
import { StyleSheet } from "react-native";

export default styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    buttonContainer: {
      marginVertical: 10,
      paddingHorizontal:40,
    },
    loginButton: {
      backgroundColor:'#F9B233', // You can change the background color
      borderRadius: 20, // Adjust the border radius as needed for rounded corners
      paddingVertical: 10,
      minHeight: 50, // Set a fixed height for both containers
      minWidth:100,
    },
    loginButtonText: {
      color: 'black', // You can set the text color
      fontWeight: 'bold',
      textAlign: 'center',
    },
    signUpButton: {
      backgroundColor:'#82368C', // You can change the background color
      borderRadius: 20, // Adjust the border radius as needed for rounded corners
      paddingVertical: 10,
      minHeight: 50, // Set a fixed height for both containers
      minWidth:100,
    },
    signUpButtonText: {
      color: 'white', // You can set the text color
      fontWeight: 'bold',
      textAlign: 'center',
    },
  });
  