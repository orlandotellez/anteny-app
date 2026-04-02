import { THEME } from "@/src/shared/lib/theme"
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { MaterialIcons } from "@expo/vector-icons";

interface FormRegisterProps {
  values: {
    name: string;
    username: string;
    email: string;
    password: string;
  };
  onChange: (field: string, value: string) => void;
  onSubmit: () => void;
  loading?: boolean;
  error?: string | null;
}

export const FormRegister = ({
  values,
  onChange,
  onSubmit,
  loading = false,
  error
}: FormRegisterProps) => {
  return (
    <View style={styles.form}>

      {/* Name */}
      <View style={styles.field}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="John Doe"
          placeholderTextColor={THEME.colors.text_opacity}
          value={values.name}
          onChangeText={(text) => onChange("name", text)}
        />
      </View>

      {/* Username */}
      <View style={styles.field}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          placeholder="jhondoe"
          placeholderTextColor={THEME.colors.text_opacity}
          value={values.username}
          onChangeText={(text) => onChange("username", text)}
        />
      </View>

      {/* Email */}
      <View style={styles.field}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="jhondoe@example.com"
          placeholderTextColor={THEME.colors.text_opacity}
          value={values.email}
          onChangeText={(text) => onChange("email", text)}
        />
      </View>

      {/* Password */}
      <View style={styles.field}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          placeholderTextColor={THEME.colors.text_opacity}
          secureTextEntry
          value={values.password}
          onChangeText={(text) => onChange("password", text)}
        />
      </View>

      {/* Button */}
      <TouchableOpacity style={styles.button} onPress={onSubmit} disabled={loading}>
        <Text style={styles.buttonText}>
          {loading ? "Creating..." : "Create account"}
        </Text>
        <MaterialIcons
          name="arrow-forward"
          size={20}
          color={THEME.colors.primary_opacity}
        />
      </TouchableOpacity>
      {error && (
        <Text style={styles.errorText}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    gap: 16,
    width: "100%",
    maxWidth: 500
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 12,
    color: THEME.colors.text_title,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  input: {
    flex: 1,
    backgroundColor: "#0e0e0e",
    borderRadius: 10,
    paddingHorizontal: 16,
    padding: 12,
    color: "#e5e2e1",
    borderWidth: 1,
    borderColor: "#444748",
  },
  button: {
    height: 54,
    backgroundColor: THEME.colors.primary,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
  buttonText: {
    color: THEME.colors.surface,
    fontWeight: "bold",
    fontSize: 16,
  },
  errorText: {
    color: THEME.colors.danger,
    marginTop: 10,
    textAlign: "center",
  }
})
