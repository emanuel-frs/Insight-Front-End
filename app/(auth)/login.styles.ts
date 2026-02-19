import { StyleSheet } from "react-native";
import { Theme } from "../../src/constants/theme";

export const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    inner: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 36,
      gap: 12,
    },
    baseControl: {
      width: "100%",
      maxWidth: 400,
      borderRadius: 50,
      paddingVertical: 12,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    inputWrapper: {
      width: "100%",
      maxWidth: 400,
      position: "relative",
      justifyContent: "center",
    },
    input: {
      width: "100%",
      borderWidth: 2,
      borderColor: theme.inputBorder,
      borderRadius: 50,
      paddingVertical: 10,
      paddingHorizontal: 20,
      fontSize: 15,
      color: theme.text,
    },
    eyeIcon: {
      position: "absolute",
      right: 18,
    },
    buttonPrimary: {
      backgroundColor: theme.primary,
      marginTop: 4,
    },
    buttonGoogle: {
      backgroundColor: theme.google,
    },
    buttonApple: {
      backgroundColor: theme.apple,
    },
    buttonPrimaryText: {
      color: theme.primaryText,
      fontWeight: "600",
      fontSize: 16,
    },
    buttonSocialText: {
      color: "#fff",
      fontWeight: "600",
      fontSize: 16,
    },
    btnIcon: {
      marginRight: 10,
    },
    footer: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: 8,
    },
    footerText: {
      color: theme.textMuted,
      fontSize: 14,
    },
    footerLink: {
      color: theme.text,
      fontSize: 14,
      fontWeight: "700",
    },
    logoContainer: {
      alignItems: "center",
      width: "100%",
    },
    logo: {
      width: 300,
      height: 180,
      marginBottom: -10,
    },
  });
