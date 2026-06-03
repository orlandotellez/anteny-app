import { THEME } from "@/src/shared/lib/theme"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"

interface FiltersProps {
  activeFilter: string
  setActiveFilter: (activeFilter: string) => void
  inviteCount: number
}

export const Filters = ({ activeFilter, setActiveFilter, inviteCount }: FiltersProps) => {
  return (
    <>
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterBtn, activeFilter === "all" && styles.filterBtnActive]}
          onPress={() => setActiveFilter("all")}
        >
          <Text style={[styles.filterText, activeFilter === "all" && styles.filterTextActive]}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterBtn, activeFilter === "direct" && styles.filterBtnActive]}
          onPress={() => setActiveFilter("direct")}
        >
          <Text style={[styles.filterText, activeFilter === "direct" && styles.filterTextActive]}>
            Direct
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterBtn, activeFilter === "groups" && styles.filterBtnActive]}
          onPress={() => setActiveFilter("groups")}
        >
          <Text style={[styles.filterText, activeFilter === "groups" && styles.filterTextActive]}>
            Groups
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterBtn, activeFilter === "invites" && styles.filterBtnActive]}
          onPress={() => setActiveFilter("invites")}
        >
          <Text style={[styles.filterText, activeFilter === "invites" && styles.filterTextActive]}>
            Invites ({inviteCount})
          </Text>
        </TouchableOpacity>
      </View>


    </>
  )
}

const styles = StyleSheet.create({

  filterContainer: {
    flexDirection: "row",
    padding: 12,
    gap: 8,
  },
  filterBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: THEME.colors.secondary,
  },
  filterBtnActive: {
    backgroundColor: THEME.colors.primary,
  },
  filterText: {
    color: THEME.colors.text_opacity,
    fontSize: 14,
  },
  filterTextActive: {
    color: "#000",
    fontWeight: "600",
  },
})
