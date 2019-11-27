import React, { Component } from "react";
import { StyleSheet, Text, View, TextInput } from "react-native";

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: "" };
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.state.params.name
    };
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>Hello {this.props.navigation.state.params.name}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "pink",
    alignItems: "center",
    justifyContent: "center"
  }
});
