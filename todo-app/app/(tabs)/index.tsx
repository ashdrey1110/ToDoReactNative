import { StyleSheet, ScrollView, SafeAreaView } from "react-native";
import Colors from "@/constants/Colors";
import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";

export default function TabOneScreen() {
  return (
    // Use SafeAreaView to avoid content overlapping with notches/status bar
    // Then wrap your content in a ScrollView
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollViewContent} 
        contentContainerStyle={styles.scrollViewContainer} 
      >
        <Text style={styles.title}>Your List</Text>
        
        <EditScreenInfo path="app/(tabs)/index.tsx" />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1, // Make SafeAreaView take full available height
    backgroundColor: Colors.light.background, 
  },
  scrollViewContent: {
    flex: 1, // Allow ScrollView to take available space
  },
  scrollViewContainer: {
    // This style is applied to the content INSIDE the ScrollView,
    // allowing you to set padding, alignment, etc., for the whole scrollable content.
    paddingHorizontal: 20,
    paddingTop: 20,
    // If your content is shorter than the screen, and you want it aligned to top:
    justifyContent: "flex-start",
    // If you want content to fill space even if short:
    // flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
  },
  separator: {
    marginVertical: 10,
    height: 1,
    width: "100%",
  },
});
