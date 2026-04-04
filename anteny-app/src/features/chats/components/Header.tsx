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
      <View style={styles.headerTop}>
        <Text style={styles.title}>Anteny App</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={onSearchToggle}>
            <Ionicons name="search" size={22} color={THEME.colors.text_opacity} />
          </TouchableOpacity>
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
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: THEME.colors.secondary,
    padding: 16,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    color: THEME.colors.text_title,
    fontSize: 22,
    fontWeight: "bold",
  },
  headerIcons: {
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
