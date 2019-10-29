import React from "react";
import { StyleSheet, Text, View } from "react-native";
//import {createSwitchNavigator} from 'react-navigation';

export default class DashboardScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Dashboard Screen</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
