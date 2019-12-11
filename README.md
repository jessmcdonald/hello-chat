# hello-chat :wave:

## What is hello-chat?
A mobile chat app built with [React Native](https://facebook.github.io/react-native/) using [Expo](https://expo.io/tools)

In addition to sending regular text messages, users can also:

- :camera_flash: upload images from their camera roll & take a picture with their device camera

- :round_pushpin: send their current location

 <image src="https://i.imgur.com/DTCC3BL.png" width="300"/>  <image src="https://i.imgur.com/GzDdyAY.png" width="300"/>
 

## How to get hello-chat up and running
1. Download project files from this repo
2. Navigate to project directory: `cd hello-chat`
2. Download all dependencies as detailed in section below
2. If you do not already have Node.js you will need to download it: https://nodejs.org/en/
2. Install Expo command line tool: `npm install expo-cli --global`
2. Download Expo to your mobile device: search Expo in your device's App Store,
[more info on Expo: https://expo.io/learn]
5. Run the app: `expo start` [Expo will open a new tab in your browser]

## How to preview the app
### On your mobile device
Once Expo is downloaded on your mobile device & and app is running you can preview the app on your mobile device either:
  * by scanning the QR code either from your terminal
  
  *OR*
  
  * from the newly opened Expo tab in browser
  
<image src="https://i.imgur.com/6zx77lH.png" height="400" />   <image src="https://i.imgur.com/KrhBP3E.png" height="400" />

### Using a simulator
Additionally you can preview the app using a mobile device simulator such as the emulator in Android Studio
1. Download Android Studio: https://developer.android.com/studio
2. Follow these instructions to set up Android Studio's tools & create a virtual Android device: https://docs.expo.io/versions/latest/workflow/android-studio-emulator/
3. Run the device by clicking green arrow button
    
    <image src="https://i.imgur.com/ERSd0ZJ.png" width="500" />
4. Select 'Run on Android Device/Emulator' in newly opened Expo tab
    
    <image src="https://i.imgur.com/bUg5Txf.png" width="300" />


## Dependencies & libraries
#### expo
* "expo": "^35.0.0",
* "expo-image-picker": "^7.0.0",
* "expo-location": "^7.0.0",
* "expo-permissions": "^7.0.0",
#### firebase
* "firebase": "^7.5.0",
#### react
* "react": "16.8.3",
* "react-dom": "16.8.3",
* "prop-types": "^15.7.2",
#### react-native
* "react-native": "https://github.com/expo/react-native/archive/sdk-35.0.0.tar.gz",
* "react-native-action-sheet": "^2.2.0",
* "react-native-gesture-handler": "~1.3.0",
* "react-native-gifted-chat": "^0.12.0", see library info >> https://github.com/FaridSafi/react-native-gifted-chat
* "react-native-keyboard-spacer": "^0.4.1",
* "react-native-maps": "^0.26.1",
* "react-native-reanimated": "~1.2.0",
* "react-native-screens": "~1.0.0-alpha.23",
* "react-native-web": "^0.11.7",
* "react-navigation": "^4.0.10",
* "react-navigation-stack": "^1.10.3",
* "@react-native-community/netinfo": "^4.6.1",

To install all dependencies run `npm install` from the project directory

## How to set up the database
Firebase has been used to store app data
1. Go to: https://firebase.google.com/
2. Login with your Google account or create a new account if you do not have a Google account
3. Click **'Go to Console'** in top right corner
4. Click **'Create a project'**
5. Give the project a name, accept the Firebase terms and **'Create Project'** (no need to set up Google Analytics)
6. Click on **'Web'** icon in the **'Add an App'** options
    
    <image src="https://i.imgur.com/k67MntK.png" width="300" />
7. Name the app and register it
8. Copy your Firebase configurations:
    
    <image src="https://i.imgur.com/hUBoNLW.png" width="400" />
9. Paste your configuration details into: `/components/Chat.js` to **replace lines 19-25**
10. Go to Firebase Console in menu on left hand side of page navigate to **Develop > Database**
11. Click **'Create Database'** and select **'Start in test mode'**
12. Select your region and click **'Done'**
13. Now you can create the collection, this will store all the messages
    
    <image src="https://i.imgur.com/KmZYiMr.png" width="400" />











Database configuration (which one, where to put database credentials, etc.)

## User flows & Kanban board
See the user flows & Kanban board I created before building this project, these were based on the project brief:
##### Enter chat & read messages even if offline:
https://whimsical.com/4qpwgc47LGRASRj1YiHo4y
##### Send images:
https://whimsical.com/AsnzYSzzJVv9oEg3HXAczo
##### Send current location:
https://whimsical.com/AsnzYSzzJVv9oEg3HXAczo
##### Kanban board
I created this Kanban board to track open tasks within project, includes Story Points for all tasks
https://trello.com/b/r1OEOnHA/native-mobile-chat-app
 
 



