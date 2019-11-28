import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  ImageBackground,
  TouchableOpacity,
  TouchableHighlight
} from "react-native";

export default class Start extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: "", backgroundColor: "" };
  }

  render() {
    return (
      <ImageBackground
        source={require("../assets/backgroundImage.png")}
        style={styles.background}
      >
        <Text style={styles.appTitle}>hello-chat</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            onChangeText={name => this.setState({ name })}
            placeholder="Your Name"
            value={this.state.name}
          />
          <View>
            <Text style={styles.chooseBackground}>
              Choose background colour:
            </Text>
            <View style={styles.colorSelection}>
              <TouchableOpacity
                style={[styles.backgroundColor1, styles.backgroundColors]}
                onPress={() => this.setState({ backgroundColor: "#090C08" })}
              />
              <TouchableOpacity
                style={[styles.backgroundColor2, styles.backgroundColors]}
                onPress={() => this.setState({ backgroundColor: "#474056" })}
              />
              <TouchableOpacity
                style={[styles.backgroundColor3, styles.backgroundColors]}
                onPress={() => this.setState({ backgroundColor: "#8A95A5" })}
              />
              <TouchableOpacity
                style={[styles.backgroundColor4, styles.backgroundColors]}
                onPress={() => this.setState({ backgroundColor: "#B9C6AE" })}
              />
            </View>
          </View>
          <View style={styles.button}>
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate("Chat", {
                  name: this.state.name,
                  backgroundColor: this.state.backgroundColor
                })
              }
            >
              <Text style={styles.buttonText}>Start Chatting</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    height: "100%",
    justifyContent: "center"
  },

  inputContainer: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "space-around",
    height: "44%",
    width: "88%",
    backgroundColor: "#fff",
    marginBottom: 25
  },

  appTitle: {
    flex: 1,
    fontSize: 45,
    color: "#fff",
    fontWeight: "600",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80
  },
  textInput: {
    height: 45,
    width: "88%",
    borderColor: "gray",
    borderWidth: 1,
    fontSize: 16,
    fontWeight: "300",
    color: "#757083",
    opacity: 0.5,
    paddingLeft: 10,
    marginTop: 20
  },
  chooseBackground: {
    fontSize: 16,
    fontWeight: "300",
    color: "#757083"
  },
  button: {
    alignItems: "center",
    backgroundColor: "#757083",
    marginBottom: 12,
    width: "88%",
    padding: 10
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff"
  },
  backgroundColors: {
    height: 40,
    width: 40,
    borderRadius: 20,
    margin: 10
  },
  colorSelection: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10
  },
  backgroundColor1: {
    backgroundColor: "#090C08"
  },
  backgroundColor2: {
    backgroundColor: "#474056"
  },
  backgroundColor3: {
    backgroundColor: "#8A95A5"
  },
  backgroundColor4: {
    backgroundColor: "#B9C6AE"
  }
});