import { THEME } from "@/src/shared/lib/theme"
import { Image, StyleSheet, Text, View } from "react-native"
import { MaterialIcons } from "@expo/vector-icons";

export const Conversation = () => {
  return (
    <>
      <Text style={styles.date}>Today</Text>

      {/* Received */}
      <View style={styles.received}>
        <View style={styles.receivedBubble}>
          <Text style={styles.text}>
            Hey! Did you see the new design system update for the monolith
            project? 🌑
          </Text>
          <Text style={styles.time}>10:42 AM</Text>
        </View>
      </View>

      {/* Sent */}
      <View style={styles.sent}>
        <View style={styles.sentBubble}>
          <Text style={styles.text}>
            Yes! The pitch-black foundation looks incredible. 🚀
          </Text>
          <View style={styles.sentMeta}>
            <Text style={styles.time}>10:44 AM</Text>
            <MaterialIcons name="done-all" size={16} color={THEME.colors.primary} />
          </View>
        </View>
      </View>

      {/* Image message */}
      <View style={styles.received}>
        <View style={styles.receivedBubble}>
          <Image
            source={{
              uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAZQHdqDgSI2EUZmDi7TMVsscd_rJhSdM35M_fqiToXA8a7TeFhZvpodIfm8r0b_R_NgwVfrroUWygT61VitMcS3jB4sjbbr-z4aHbQM7mTrMWzLDIr_ast7i0fnp1zswyVb0KyORZ3HFdPovANf0ubsGSOoIDOIOlRdtDrsk4n0QcajwqZh0wk2yffE60wf4fR7gS4BOhrBprLEEoeROLN3TncXpiHmu8bp48R60i_f7Nl_95UtWSp9ouysLo_lV17-Ts_IrXimPg",
            }}
            style={styles.image}
          />
          <Text style={styles.text}>
            This is the reference I was talking about.
          </Text>
          <Text style={styles.time}>10:45 AM</Text>
        </View>
      </View>

      {/* Typing */}
      <View style={styles.typing}>
        <Text style={styles.typingText}>Alex is typing...</Text>
      </View>

    </>
  )
}

const styles = StyleSheet.create({
  date: {
    alignSelf: "center",
    color: THEME.colors.text_opacity,
    backgroundColor: "#1b1b1b",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 10,
    marginVertical: 10,
  },

  received: {
    alignItems: "flex-start",
    marginBottom: 10,
  },
  sent: {
    alignItems: "flex-end",
    marginBottom: 10,
  },

  receivedBubble: {
    backgroundColor: "#2a2a2a",
    padding: 10,
    borderRadius: 12,
    maxWidth: "85%",
  },
  sentBubble: {
    backgroundColor: THEME.colors.secondary,
    padding: 10,
    borderRadius: 12,
    maxWidth: "85%",
  },

  text: {
    color: "#e2e2e2",
  },
  time: {
    fontSize: 10,
    color: THEME.colors.text_opacity,
    marginTop: 4,
    alignSelf: "flex-end",
  },
  sentMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    justifyContent: "flex-end",
    marginTop: 4,
  },

  image: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    marginBottom: 6,
  },

  typing: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
  },
  typingText: {
    color: THEME.colors.text_opacity,
    fontSize: 12,
  },

})
