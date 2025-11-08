import React from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import { WebView } from "react-native-webview";

interface ContractModalProps {
  visible: boolean;
  onClose: () => void;
  htmlContent: string;
}

export const ContractModal: React.FC<ContractModalProps> = ({ visible, onClose, htmlContent }) => {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Hợp đồng thuê xe</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>Đóng</Text>
          </TouchableOpacity>
        </View>
        <WebView
          source={{ html: htmlContent }}
          originWhitelist={["*"]}
          style={styles.webview}
        />
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#1a1a1a",
    backgroundColor: "#111",
  },
  title: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  closeButton: {
    backgroundColor: "#4169E1",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  closeText: {
    color: "#fff",
    fontWeight: "600",
  },
  webview: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
