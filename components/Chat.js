import React, { Component } from "react";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import { StyleSheet, Text, View, TextInput, Platform } from "react-native";
//Android only - correct screen keyboard display
import KeyboardSpacer from "react-native-keyboard-spacer";

//establish firebase connection
const firebase = require("firebase");
require("firebase/firestore");

export default class Chat extends React.Component {
  constructor() {
    super();
    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: "AIzaSyBvmNRw4RtZNTZcqesOpBZO6rLd690fnEI",
        authDomain: "hello-chat-cb7a5.firebaseapp.com",
        databaseURL: "https://hello-chat-cb7a5.firebaseio.com",
        projectId: "hello-chat-cb7a5",
        storageBucket: "hello-chat-cb7a5.appspot.com",
        messagingSenderId: "973755903581",
        appId: "1:973755903581:web:cfe5b4377b70e7a3ac27b4"
      });
    }

    //create reference to firestore collection
    this.referenceUser = null;
    this.referenceMessages = firebase.firestore().collection("messages");

    //set state to be array of messages
    this.state = {
      messages: [],
      uid: "",
      loggedInText: "Please wait while we log you in",
      user: {
        _id: "",
        name: "",
        avatar: ""
      }
    };
  }

  //add username to navigation title
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.state.params.name
    };
  };

  setUser = (
    _id,
    name = "Guest User",
    avatar = "https://placeimg.com/140/140/any"
  ) => {
    this.setState({
      user: {
        _id: _id,
        name: name,
        avatar: avatar
      }
    });
  };
  /*
   * update messages array in state
   * @function onCollectionUpdate
   * @param {string} _id
   * @param {string} text
   * @param {date} createdAt
   * @param {object} user
   */

  onCollectionUpdate = querySnapshot => {
    const messages = [];
    //go through each message document
    querySnapshot.forEach(doc => {
      //get QuerySnapshot data
      let data = doc.data();
      //push to messages array
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: data.user
      });
    });
    //set messages array as state
    this.setState({
      messages
    });
  };

  /*
   * add message to firebase database
   * @function addMessage
   * @param {number} _id
   * @param {string} text
   * @param {date} createdAt
   * @param {object} user
   */
  addMessage() {
    const message = this.state.messages[0];
    this.referenceMessages.add({
      _id: message._id,
      text: message.text,
      createdAt: message.createdAt,
      user: this.state.user,
      uid: this.state.uid
    });
  }

  //append new messages to messages array in state & database
  onSend(messages = []) {
    this.setState(
      previousState => ({
        messages: GiftedChat.append(previousState.messages, messages)
      }),
      () => {
        this.addMessage();
      }
    );
  }

  componentDidMount() {
    this.authUnsubscribe = firebase.auth().onAuthStateChanged(async user => {
      if (!user) {
        await firebase.auth().signInAnonymously();
      }
      //update user state with currently active user data
      this.setState({
        uid: user.uid,
        loggedInText: "Hey there",
        user: {
          _id: user.uid,
          name: this.props.navigation.state.params.name
        }
      });
    });
    this.referenceUser = firebase
      .firestore()
      .collection("messages")
      .orderBy("createdAt", "desc");
    this.unsubscribeUser = this.referenceUser.onSnapshot(
      this.onCollectionUpdate
    );
  }

  componentWillUnmount() {
    this.unsubscribeUser();
    this.authUnsubscribe();
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
          user={this.state.user}
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
