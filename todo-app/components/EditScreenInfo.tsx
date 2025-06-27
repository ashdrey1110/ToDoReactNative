import React from "react";
import { StyleSheet } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ExternalLink } from "./ExternalLink";
import { MonoText } from "./StyledText";
import { Text, View } from "./Themed";
import { useEffect, useState } from "react";

import Colors from "@/constants/Colors";

export default function EditScreenInfo({ path }: { path: string }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8080/list`)
      .then((res) => res.json())
      .then((data) => {
        setItems(data);
      })
      .catch((e) => console.error("Failed to fetch items", e));
  }, []);

  return (
    <View>
      <View style={styles.getStartedContainer}>
        <Text
          style={styles.getStartedText}
          lightColor="rgba(0,0,0,0.8)"
          darkColor="rgba(255,255,255,0.8)"
        >
          Hello
        </Text>

        <View
          style={[styles.codeHighlightContainer, styles.homeScreenFilename]}
          darkColor="rgba(255,255,255,0.05)"
          lightColor="rgba(0,0,0,0.05)"
        >
          <MonoText>{path}</MonoText>
        </View>

        <Text
          style={styles.getStartedText}
          lightColor="rgba(0,0,0,0.8)"
          darkColor="rgba(255,255,255,0.8)"
        >
          Change any of the text, save the file, and your app will automatically
          update.
        </Text>
      </View>

      <View style={styles.helpContainer}>
        <MaterialIcons name="add-circle" size={24} />
        <Text style={styles.helpLinkText} lightColor={Colors.light.tint}>
          Add new item
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  getStartedContainer: {
    marginHorizontal: 25,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightContainer: {
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    lineHeight: 24,
  },
  helpContainer: {
    marginTop: 15,
    marginHorizontal: 20,
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: { flex: 1, justifyContent: "center" },
});
