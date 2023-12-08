import React from "react";
import { StyleSheet } from "react-native";

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start", // Change to 'flex-start' to separate the views
    alignItems: "center",
    paddingHorizontal: 5, // Add 5px margin from both sides
  },
  flatListContainer: {
    flex: 1, // To make FlatList take all available space
    width: "100%",
  },
  button: {
    backgroundColor: "grey",
    borderRadius: 20,
    paddingVertical: 10,
    minHeight: 50,
    minWidth: 200,
    marginVertical: 10, // Adjust as needed
  },
  });
  