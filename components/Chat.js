import React, { Component } from "react";
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import { StyleSheet, View, Platform, Text, AsyncStorage } from "react-native";
//Android only - correct screen keyboard display
import KeyboardSpacer from "react-native-keyboard-spacer";
import NetInfo from "@react-native-community/netinfo";
import CustomActions from "./CustomActions";
import MapView from "react-native-maps";
//establish firebase connection
import firebase from "firebase";
import "firebase/firestore";

/**
 * @class Chat screen component for hello-chat
 * @requires react
 * @requires react-native
 * @requires react-native-gifted-chat
 * @requires react-native-keyboard-spacer
 * @requires react-native-community/netinfo
 * @requires CustomActions from './CustomActions'
 * @requires react-native-maps
 * @requires firebaseap
 * @requires firebase/firestore
 */

export default class Chat extends React.Component {
  constructor() {
    super();
    /**
     * initialising firebase with config info provided at firestore setup
     * @param {string} apiKey
     * @param {string} authDomain
     * @param {string} databaseURL
     * @param {string} projectId
     * @param {string} storageBucket
     * @param {string} messagingSenderId
     * @param {string} appId
     */
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

  /**
   * takes snapshot on collection update + updates messages array in state
   * @function onCollectionUpdate
   * @param {string} _id message ID
   * @param {string} text message text
   * @param {date} createdAt timestamp of when message created
   * @param {string} image image URL
   * @param {location} location user's current location
   * @param {object} user user object
   * @returns {array} messages array added to state
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
    //update messages array in state
    this.setState({
      messages
    });
  };

  /**
   * adds message to firebase database
   * @function addMessage
   * @param {number} _id message ID
   * @param {string} text message text
   * @param {date} createdAt timestamp of when message created
   * @param {object} user user object
   * @param {string} uid user ID
   * @param {string} image image URL
   * @param {location} location user's current location
   */
  addMessage() {
    const message = this.state.messages[0];
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

  /**
   * appends new messages to messages array in state & database
   * @function
   * @param {ObjectArray} messages in previousState
   * @returns {ObjectArray} messages with new message appended assigned to state & added to database
   */
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

  /**
   * saves all messages to Async storage
   * @async
   * @function saveMessages
   * @returns {Promise<string>} message data to add to storage
   */
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

  /**
   * deletes messages from Async storage
   * for use in development only
   * @async
   * @function deleteMessages
   */
  deleteMessages = async () => {
    try {
      await AsyncStorage.removeItem("messages");
    } catch (error) {
      console.log(error.message);
    }
  };

  /**
   * loads all messages from AsyncStorage
   * @async
   * @function getMessages
   * @returns {Promise<string>} The data from the storage
   */
  getMessages = async () => {
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
  };

  /**
   * check if user is online
   * sign in & authenticate anonymously
   * set state to current user
   * get messages from firebase & listen for new messages
   * if user is offline get messages from local storage
   * @function componentDidMount
   */
  componentDidMount() {
    NetInfo.isConnected.fetch().then(isConnected => {
      //check if user is online
      if (isConnected) {
        console.log("online");
        this.setState({
          isConnected: true
        });
        //if no user logged in, sign in anonymously
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
        //get messages from firebase DB & listen for new messages
        this.referenceUser = firebase
          .firestore()
          .collection("messages")
          .orderBy("createdAt", "desc");
        this.unsubscribeUser = this.referenceUser.onSnapshot(
          this.onCollectionUpdate
        );
        //if user is offline, load messages from local storage
      } else {
        console.log("offline");
        this.setState({
          isConnected: false
        });
        this.getMessages();
      }
    });
  }

  /**
   * stop listening for new messages
   * @function componentWillUnmount
   */
  componentWillUnmount() {
    this.unsubscribeUser();
    this.authUnsubscribe();
  }

  /**
   * @function renderBubble
   * @param {*} props
   * @returns {Component}
   */
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

  /**
   * if user is offline do not allow to compose new messages
   * @function renderInputToolbar
   * @param {*} props
   */
  renderInputToolbar(props) {
    if (this.state.isConnected == false) {
    } else {
      return <InputToolbar {...props} />;
    }
  }

  /**
   * render CustomActions toolbar, show options to add location/image to message
   * @function renderCustomActions
   * @param {*} props
   * @returns {Component}
   */
  renderCustomActions = props => {
    return <CustomActions {...props} />;
  };

  /**
   * render location bubble using user's current location
   * @function renderCustomView
   * @param {*} props
   * @returns {Component}
   */
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

  /*
   * render Chat screen
   * use background color chosen by user in start screen
   * bind functions to actions in GiftedChat
   * Android only - display keyboard so it does not hide screen when typing
   */
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
