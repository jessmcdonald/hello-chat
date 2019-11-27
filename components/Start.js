import React, { Component } from "react";
import { StyleSheet, Text, View, TextInput, Button } from "react-native";

export default class Start extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: "" };
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={{
            height: 40,
            width: 200,
            borderColor: "gray",
            borderWidth: 1
          }}
          onChangeText={name => this.setState({ name })}
          placeholder="Type name here"
          value={this.state.name}
        />
        <Text>Hello {this.state.name}</Text>
        <Button
          title="go to chat"
          onPress={() =>
            this.props.navigation.navigate("Chat", { name: this.state.name })
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "turquoise",
    alignItems: "center",
    justifyContent: "center"
  }
});
