import { StyleSheet, Text, View } from "react-native"

interface UserInfoField {
  id: string;
  icon: string;
  label: string;
  value: string;
}

export const Info = ({ userId }: { userId: string }) => {
  const fields: UserInfoField[] = [
    {
      id: "1",
      icon: "at",
      label: "Matrix ID",
      value: userId,
    },
  ];

  return (
    <>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Info</Text>
        {fields.map((field) => (
          <View key={field.id} style={styles.fieldRow}>
            <View style={styles.fieldContent}>
              <View style={styles.fieldText}>
                <Text style={styles.fieldLabel}>{field.label}</Text>
                <Text style={styles.fieldValue}>{field.value}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

    </>
  )
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    color: "#aaa",
    fontSize: 16,
    marginBottom: 10,
  },
  fieldRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  fieldContent: {
    flexDirection: "row",
    flex: 1,
  },
  fieldText: {
    marginLeft: 10,
  },
  fieldLabel: {
    color: "#aaa",
    fontSize: 12,
  },
  fieldValue: {
    color: "#fff",
    fontSize: 16,
  },


})
