import React, { Component } from "react";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import { StyleSheet, Text, View, TextInput, Platform } from "react-native";
//Android only - correct screen keyboard display
import KeyboardSpacer from "react-native-keyboard-spacer";

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
  }
  //set state to be array of messages
  state = {
    messages: []
  };

  componentDidMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: "Hello developer",
          createdAt: new Date(),
          user: {
            _id: 2,
            name: "React Native",
            avatar: "https://placeimg.com/140/140/any"
          }
        },
        {
          _id: 2,
          text:
            this.props.navigation.state.params.name + " has joined the chat.",
          createdAt: new Date(),
          system: true
        }
      ]
    });
  }

  //append new messages to messages array in state
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages)
    }));
  }

  //customise appearance of message speech bubbles
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#00909e"
          }
        }}
      />
    );
  }

  //add username to navigation title
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
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: 1
          }}
        />
        {Platform.OS === "android" ? <KeyboardSpacer /> : null}
      </View>
    );
  }
}

//set wrapper view to fill whole screen
const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
