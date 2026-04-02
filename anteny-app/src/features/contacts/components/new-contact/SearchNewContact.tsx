import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native"
import { Feather } from "@expo/vector-icons";
import { THEME } from "@/src/shared/lib/theme";

export const SearchNewContact = () => {
  return (
    <>
      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color="#aaa" />

        <TextInput
          placeholder="Buscar usuario..."
          placeholderTextColor="#888"
          style={styles.searchInput}
        />

        <TouchableOpacity style={styles.btnSearch}>
          <Feather name="arrow-right" size={22} color="#000" />
        </TouchableOpacity>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    margin: 14,
    backgroundColor: THEME.colors.secondary,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    color: "#fff",
  },
  btnSearch: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: THEME.colors.primary,
  },
})
