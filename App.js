import React from "react";
import Start from "./components/Start";
import Chat from "./components/Chat";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

//navigation prop is passed to every component included in the navigator
const navigator = createStackNavigator({
  Start: { screen: Start },
  Chat: { screen: Chat }
});

const navigatorContainer = createAppContainer(navigator);

export default navigatorContainer;
