import React, { Component } from "react";
import { StyleSheet, Text, View, TextInput } from "react-native";

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.state.params.name
    };
  };

  render() {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: this.props.navigation.state.params.backgroundColor
          }
        ]}
      >
        <Text>
          Hello {this.props.navigation.state.params.name}, this is your chat
          screen.
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    color: "#fff"
  }
});
