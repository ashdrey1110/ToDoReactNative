import React from "react";
import { StyleSheet, TextInput } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { View } from "./Themed";
import { useEffect, useState } from "react";

import Colors from "@/constants/Colors";

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
  const [updatedComment, setUpdatedComment] = useState({
    id: "",
    comments: "",
  });
  const [updatedItem, setUpdatedItem] = useState({ id: "", name: "" });

  useEffect(() => {
    fetch(`http://localhost:8080/list`)
      .then((res) => res.json())
      .then((data: Item[]) => {
        setItems(data);
      })
      .catch((e) => console.error("Failed to fetch items", e));
  }, []);

  // Functions below for editing a current item name

  const handleEditItem = (id: string, textInput: string) => {
    setUpdatedItem({
      id: id,
      name: textInput,
    });
  };

  const getItemName = (id: string) => {
    if (updatedItem.id == id) {
      return updatedItem.name;
    } else {
      let currItem = items.find((item) => item.id == id);
      return currItem?.name;
    }
  };

  const handleUpdateItem = (id: string) => {
    if (updatedItem.name.length > 0) {
      fetch(`http://localhost:8080/list/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: updatedItem.name }),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to update item name");
          }
          return res.json();
        })
        .then(() => {
          setItems((prevItems) =>
            prevItems.map((item) =>
              item.id === id ? { ...item, name: updatedItem.name } : item
            )
          );
          setUpdatedItem({ id: "", name: "" });
        });
    } else {
      fetch(`http://localhost:8080/list/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to delete item");
          }
          return res.json();
        })
        .then(() => {
          setItems((prevItems) => prevItems.filter((item) => item.id !== id));
          setUpdatedItem({ id: "", name: "" });
        });
    }
  };

  // Functions below for updating comments

  const handleCommentFocus = (id: string, comment: string) => {
    if (comment == "") {
      setUpdatedComment({ id: id, comments: "" });
    }
  };

  const handleEditComments = (id: string, textInput: string) => {
    setUpdatedComment({
      id: id,
      comments: textInput,
    });
  };

  const getItemComments = (id: string) => {
    if (updatedComment.id == id) {
      return updatedComment.comments;
    } else {
      let currItem = items.find((item) => item.id == id);
      return currItem?.comments || "Add details";
    }
  };

  const handleUpdateComments = (id: string) => {
    if (updatedComment.comments.length > 0) {
      fetch(`http://localhost:8080/list/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comments: updatedComment.comments }),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to update item comments");
          }
          return res.json();
        })
        .then(() => {
          setItems((prevItems) =>
            prevItems.map((item) =>
              item.id === id
                ? { ...item, comments: updatedComment.comments }
                : item
            )
          );
          setUpdatedComment({ id: "", comments: "" });
        });
    }
  };

  // Functions below for adding a new item
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
                  color={"rgba(16, 65, 0, 0.8)"}
                  onPress={() => handleCompleteToggle(item.id, item.completed)}
                />
              ) : (
                <MaterialIcons
                  name="radio-button-off"
                  size={24}
                  color={"rgba(16, 65, 0, 0.8)"}
                  onPress={() => handleCompleteToggle(item.id, item.completed)}
                />
              )}
              <TextInput
                style={styles.itemName}
                onChangeText={(textInput) => handleEditItem(item.id, textInput)}
                value={getItemName(item.id)}
                onBlur={() => handleUpdateItem(item.id)}
              />
            </View>
            <TextInput
              style={styles.itemComments}
              onFocus={() => handleCommentFocus(item.id, item.comments)}
              onChangeText={(textInput) =>
                handleEditComments(item.id, textInput)
              }
              value={getItemComments(item.id)}
              onBlur={() => handleUpdateComments(item.id)}
            />
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
    marginLeft: 35,
    height: 1,
    width: "90%",
  },
  input: {
    fontSize: 17,
    marginHorizontal: 15,
    color: "rgb(42, 174, 22)",
  },
  itemName: {
    fontSize: 17,
    marginHorizontal: 10,
    marginRight: 30,
    color: "rgba(16, 65, 0, 0.8)",
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
    color: "rgba(16, 65, 0, 0.8)",
  },
  helpContainer: {
    marginTop: 15,
    marginHorizontal: 20,
  },
  helpLink: {
    paddingVertical: 15,
  },
  itemComments: {
    justifyContent: "center",
    marginLeft: 35,
    color: "rgb(136, 186, 115)",
  },
});
