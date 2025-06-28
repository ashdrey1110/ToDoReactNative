import React from "react";
import { StyleSheet, TextInput } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { ExternalLink } from "./ExternalLink";
import { MonoText } from "./StyledText";
import { Text, View } from "./Themed";
import { useEffect, useState } from "react";

import Colors from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";

//have to define the interface for item so that u can use it below
interface Item {
  id: string;
  name: string;
  comments: string;
  completed: boolean;
}

export default function EditScreenInfo({ path }: { path: string }) {
  const [items, setItems] = useState<Item[]>([]);
  const [newItemName, setNewItemName] = useState("Add new item");
  const [updatedComment, setUpdatedComment] = useState("");
  const [completeUpdate, setCompleteUpdate] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:8080/list`)
      .then((res) => res.json())
      .then((data: Item[]) => {
        setItems(data);
      })
      .catch((e) => console.error("Failed to fetch items", e));
  }, []);

  const handleFocus = () => {
    if (newItemName === "Add new item") {
      setNewItemName("");
    }
  };

  const handleNewInput = (textInput: string) => {
    setNewItemName(textInput);
  };

  const handleCompleteToggle = (id: string, completeStatus: boolean) => {
    fetch(`http://localhost:8080/list/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ completed: !completeStatus }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to change item's completion status");
        }
        return res.json();
      })
      .then(() => {
        setItems((prevItems) =>
          prevItems.map((item) =>
            item.id === id ? { ...item, completed: !completeStatus } : item
          )
        );
      });
  };

  const handleAddItem = () => {
    if (newItemName != "" && newItemName != "Add new item") {
      fetch("http://localhost:8080/list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newItemName,
          comments: "",
          completed: false,
        }),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to add new item");
          }
          return res.json();
        })
        .then(() => {
          return fetch(`http://localhost:8080/list`);
        })
        .then((res) => res.json())
        .then((data: Item[]) => {
          setItems(data);
        })
        .then(() => {
          setNewItemName("Add new item");
        });
    } else {
      return;
    }
  };

  return (
    <View>
      <View>
        {items?.map((item, index) => (
          <View key={index}>
            <View style={styles.listItems}>
              {item.completed ? (
                <MaterialIcons
                  name="radio-button-on"
                  size={24}
                  color={Colors.light.tint}
                  onPress={() => handleCompleteToggle(item.id, item.completed)}
                />
              ) : (
                <MaterialIcons
                  name="radio-button-off"
                  size={24}
                  color={Colors.light.tint}
                  onPress={() => handleCompleteToggle(item.id, item.completed)}
                />
              )}
              <Text
                style={styles.getStartedText}
                lightColor="rgba(16, 65, 0, 0.8)"
                darkColor="rgba(255,255,255,0.8)"
              >
                {item.name}
              </Text>
            </View>
            <Text
              style={styles.helpLinkText}
              lightColor="rgba(0,0,0,0.8)"
              darkColor="rgba(255,255,255,0.8)"
            >
              {item.comments || "Add details"}
            </Text>
            <View
              style={styles.separator}
              lightColor="rgb(162, 213, 127)"
              darkColor="rgba(135, 220, 142, 0.79)"
            />
          </View>
        ))}
      </View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View>
          <MaterialIcons
            name="add-circle"
            size={24}
            color={Colors.light.tint}
          />
        </View>
        <View>
          <TextInput
            style={styles.input}
            onChangeText={handleNewInput}
            onFocus={handleFocus}
            value={newItemName}
            onBlur={handleAddItem}
          />
        </View>
      </View>
      <View
        style={styles.separator}
        lightColor="rgb(162, 213, 127)"
        darkColor="rgba(135, 220, 142, 0.79)"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  listItems: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 2,
  },
  separator: {
    marginTop: 10,
    marginBottom: 10,
    height: 1,
    width: "100%",
  },
  input: {
    fontSize: 17,
    marginHorizontal: 5,
    color: "rgb(42, 174, 22)",
  },
  getStartedContainer: {
    marginHorizontal: 10,
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
    marginHorizontal: 5,
  },
  helpContainer: {
    marginTop: 15,
    marginHorizontal: 20,
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    justifyContent: "center",
    marginLeft: 30,
    color: "rgb(136, 186, 115)",
  },
});
