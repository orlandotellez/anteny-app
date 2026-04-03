import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { MaterialIcons } from "@expo/vector-icons";
import { THEME } from "@/src/shared/lib/theme";

interface FormLoginProps {
  values: {
    username: string;
    password: string;
  };
  onChange: (field: string, value: string) => void;
  onSubmit: () => void;
  loading?: boolean;
  error?: string | null;
}

export const FormLogin = ({
  values,
  onChange,
  onSubmit,
  loading = false,
  error
}: FormLoginProps) => {
  return (
    <>
      <View style={styles.form}>
        {/* Username */}
        <View style={styles.field}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            placeholder="jhondoe"
            placeholderTextColor={THEME.colors.text_opacity}
            value={values.username}
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={(text) => {
              const clean = text
                .toLowerCase()
                .replace(/\s/g, "") // quita espacios
                .replace(/[^a-z0-9_]/g, ""); // solo letras/números/_

              onChange("username", clean);
            }}
          />
          <Text style={styles.helperText}>
            Only lowercase letters, numbers and underscores
          </Text>

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
            {loading ? "Proccess" : "Next"}
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
    </>
  )
}

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
    height: 56,
    backgroundColor: THEME.colors.primary,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
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
  },
  helperText: {
    color: THEME.colors.text_opacity
  }
})
