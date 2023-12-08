import React from "react";
import { View,Text } from "react-native";

function MessagesPage({route}){
    return(
        <View>
            <Text>
                {route.params}
            </Text>
        </View>
    )
}

export default MessagesPage;