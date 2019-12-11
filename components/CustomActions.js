import React, { Component } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import MapView from "react-native-maps";
//establish firebase connection
import firebase from "firebase";
import "firebase/firestore";

export default class CustomActions extends React.Component {
  //allow user to select image from CAMERA_ROLL to add to message
  pickImage = async () => {
    try {
      //ask permission to access device CAMERA_ROLL
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      //if access granted launch ImagePicker.launchImageLibrary to select image
      if (status === "granted") {
        const result = await ImagePicker.launchImageLibraryAsync({
          //only allow images
          mediaTypes: ImagePicker.MediaTypeOptions.Images
        }).catch(error => console.log(error));
        //if user does not click cancel, get ImageUrl + add ImageUrl to message props + send message
        if (!result.cancelled) {
          const imageUrl = await this.uploadImageFetch(result.uri);
          this.props.onSend({ image: imageUrl });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  //allow user to take photo using device CAMERA to add to message
  takePhoto = async () => {
    try {
      //ask permission to access CAMERA & CAMERA_ROLL
      const { status } = await Permissions.askAsync(
        Permissions.CAMERA_ROLL,
        Permissions.CAMERA
      );
      //if access granted launch ImagePicker.launchCamera to take photo
      if (status === "granted") {
        let result = await ImagePicker.launchCameraAsync({
          //only allow images
          mediaTypes: ImagePicker.MediaTypeOptions.Images
        }).catch(error => console.log(error));
        //if user does not click cancel, get ImageUrl + add ImageUrl to message props + send message
        if (!result.cancelled) {
          const imageUrl = await this.uploadImageFetch(result.uri);
          this.props.onSend({ image: imageUrl });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  //allow user to send current location as message
  getLocation = async () => {
    try {
      //ask permission to access device current location
      const { status } = await Permissions.askAsync(Permissions.LOCATION);
      //if access granted launch Location.getCurrentPosition & assign result to 'result'
      if (status === "granted") {
        let result = await Location.getCurrentPositionAsync({}).catch(error =>
          console.log(error)
        );
        //get latitude & longitude from result
        const longitude = JSON.stringify(result.coords.longitude);
        const latitude = JSON.stringify(result.coords.latitude);
        //once result has been defined send message with lat & long as message props
        if (result) {
          this.props.onSend({
            location: {
              longitude: result.coords.longitude,
              latitude: result.coords.latitude
            }
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * called during pickImage & takePhoto functions
   * upload image to firestoreDB
   * convert to blob
   * get image URL
   */
  uploadImageFetch = async uri => {
    try {
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function() {
          resolve(xhr.response);
        };
        xhr.onerror = function(e) {
          console.log(e);
          reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", uri, true);
        xhr.send(null);
      });
      const imageNameBefore = uri.split("/");
      const imageName = imageNameBefore[imageNameBefore.length - 1];
      const ref = firebase
        .storage()
        .ref()
        .child(`images/${imageName}`);
      const snapshot = await ref.put(blob);
      blob.close();
      return snapshot.ref.getDownloadURL();
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * called by pressing + button
   * opens actionSheet menu & assigns functions to menu options
   */
  onActionPress = () => {
    const options = [
      "Choose From Library",
      "Take Picture",
      "Send Location",
      "Cancel"
    ];
    const cancelButtonIndex = options.length - 1;
    this.context.actionSheet().showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex
      },
      async buttonIndex => {
        switch (buttonIndex) {
          case 0:
            console.log("user wants to pick an image");
            return this.pickImage();
          case 1:
            console.log("user wants to take a photo");
            return this.takePhoto();
          case 2:
            console.log("user wants to get their location");
            return this.getLocation();
        }
      }
    );
  };

  //render '+' button> onPress shows actionSheet menu
  render() {
    return (
      <TouchableOpacity
        style={[styles.container]}
        onPress={this.onActionPress}
        accessible={true}
        accessibilityLabel="open menu of communication features"
        accessibilityRole="button"
      >
        <View style={[styles.wrapper, this.props.wrapperStyle]}>
          <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
        </View>
      </TouchableOpacity>
    );
  }
}
//styles for '+' button
const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10
  },
  wrapper: {
    borderRadius: 13,
    borderColor: "#b2b2b2",
    borderWidth: 2,
    flex: 1
  },
  iconText: {
    color: "#b2b2b2",
    fontWeight: "bold",
    fontSize: 16,
    backgroundColor: "transparent",
    textAlign: "center"
  }
});

CustomActions.contextTypes = {
  actionSheet: PropTypes.func
};
