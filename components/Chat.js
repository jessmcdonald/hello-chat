import React, { Component } from "react";
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import { StyleSheet, View, Platform, Text, AsyncStorage } from "react-native";
//Android only - correct screen keyboard display
import KeyboardSpacer from "react-native-keyboard-spacer";
import NetInfo from "@react-native-community/netinfo";
import CustomActions from "./CustomActions";
import MapView from "react-native-maps";

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
      isConnected: false,
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
  /*
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
  };*/

  /*
   * update messages array in state
   * @function onCollectionUpdate
   * @param {string} _id
   * @param {string} text
   * @param {date} createdAt
   * @param {string} image
   * @param {location} location
   * @param {object} user
   */

  onCollectionUpdate = querySnapshot => {
    const messages = [];
    //go through each message document
    querySnapshot.forEach(doc => {
      //push to messages array
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: data.user,
        image: data.image || "",
        location: data.location || null
      });
    });
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
   * @param {string} image url
   * @param {location} location
   */
  addMessage() {
    const message = this.state.messages[0];
    console.log(message);
    this.referenceMessages.add({
      _id: message._id,
      text: message.text || "",
      createdAt: message.createdAt,
      user: this.state.user,
      uid: this.state.uid,
      image: message.image || "",
      location: message.location || null
    });
  }

  //append new messages to messages array in state & database
  onSend(messages = []) {
    try {
      this.setState(
        previousState => ({
          messages: GiftedChat.append(previousState.messages, messages)
        }),
        () => {
          this.addMessage();
          this.saveMessages();
        }
      );
    } catch (error) {
      console.log(error);
    }
  }

  //save messages to async storage
  saveMessages = async () => {
    try {
      await AsyncStorage.setItem(
        "messages",
        JSON.stringify(this.state.messages)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  //for use in development
  deleteMessages = async () => {
    try {
      await AsyncStorage.removeItem("messages");
    } catch (error) {
      console.log(error.message);
    }
  };

  //load all messages from async storage
  async getMessages() {
    let messages = "";
    try {
      //if no item in storage with 'message' key, set message arry to be empty []
      messages = (await AsyncStorage.getItem("messages")) || [];
      this.setState({
        //asyncStorage can only store strings
        messages: JSON.parse(messages)
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  componentDidMount() {
    NetInfo.isConnected.fetch().then(isConnected => {
      if (isConnected) {
        console.log("online");
        this.setState({
          isConnected: true
        });
        this.authUnsubscribe = firebase
          .auth()
          .onAuthStateChanged(async user => {
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
      } else {
        console.log("offline");
        this.setState({
          isConnected: false
        });
        this.getMessages();
      }
    });
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

  //if user is offline do not allow to compose new messages
  renderInputToolbar(props) {
    if (this.state.isConnected == false) {
    } else {
      return <InputToolbar {...props} />;
    }
  }

  renderCustomActions = props => {
    return <CustomActions {...props} />;
  };

  renderCustomView(props) {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          }}
        />
      );
    }
    return null;
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
          renderInputToolbar={this.renderInputToolbar.bind(this)}
          renderActions={this.renderCustomActions.bind(this)}
          renderCustomView={this.renderCustomView.bind(this)}
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
