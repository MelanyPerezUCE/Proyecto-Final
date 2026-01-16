import { StyleSheet } from "react-native";

export const getStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      backgroundColor: isDark ? "#000" : "#F4F5F6",
      flex: 1,
    },
    h1: {
      fontSize: 28,
      fontWeight: "bold",
      marginBottom: 8,
      color: isDark ? "#fff" : "#000",
      textAlign: "center",
      marginTop: 35,
    },
    h3: {
      fontSize: 20,
      fontWeight: "600",
      marginTop: 24,
      marginBottom: 12,
      color: isDark ? "#fff" : "#333",
      textAlign: "left",
      marginLeft: 20,
    },
    p: {
      fontSize: 16,
      color: isDark ? "#ccc" : "#666",
      marginBottom: 20,
      textAlign: "center",
      marginLeft: 20,
    },
  });
