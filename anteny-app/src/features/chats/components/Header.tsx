import { StyleSheet, Text, View, TextInput, TouchableOpacity } from "react-native"
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { THEME } from "@/src/shared/lib/theme";

interface HeaderProps {
  onSearchToggle?: () => void;
  showSearch?: boolean;
  searchQuery?: string;
  onSearchChange?: (text: string) => void;
}

export const Header = ({ onSearchToggle, showSearch, searchQuery, onSearchChange }: HeaderProps) => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Anteny App</Text>
      <View style={styles.headerIcons}>
        <TouchableOpacity onPress={onSearchToggle}>
          <Ionicons name="search" size={22} color={THEME.colors.text_opacity} />
        </TouchableOpacity>
        <MaterialIcons name="more-vert" size={22} color={THEME.colors.text_opacity} />
      </View>
      
      {showSearch && (
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar chats..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={onSearchChange}
            autoFocus
          />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  header: {
    backgroundColor: THEME.colors.secondary,
    padding: 16,
  },
  title: {
    color: THEME.colors.text_title,
    fontSize: 22,
    fontWeight: "bold",
  },
  headerIcons: {
    position: "absolute",
    right: 16,
    top: 16,
    flexDirection: "row",
    gap: 16,
  },
  searchContainer: {
    marginTop: 12,
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  searchInput: {
    color: "#fff",
    fontSize: 16,
    paddingVertical: 10,
  },
})
