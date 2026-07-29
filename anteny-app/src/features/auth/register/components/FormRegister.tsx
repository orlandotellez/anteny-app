import { useState } from "react";
import { THEME } from "@/src/shared/lib/theme"
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { MaterialIcons, Ionicons } from "@expo/vector-icons";

interface FormRegisterProps {
  values: {
    displayName: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordsMatch = values.password === values.confirmPassword;
  const showMatchError = values.confirmPassword.length > 0 && !passwordsMatch;

  return (
    <View style={styles.form}>

      {/* Name */}
      <View style={styles.field}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="John Doe"
          placeholderTextColor={THEME.colors.text_opacity}
          value={values.displayName}
          onChangeText={(text) => onChange("displayName", text)}
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
        <View style={{ position: "relative" }}>
          <TextInput
            style={[styles.input, { paddingRight: 44 }]}
            placeholder="••••••••"
            placeholderTextColor={THEME.colors.text_opacity}
            secureTextEntry={!showPassword}
            value={values.password}
            onChangeText={(text) => onChange("password", text)}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: 12,
              top: 0,
              bottom: 0,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={20}
              color={THEME.colors.text_opacity}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Confirm Password */}
      <View style={styles.field}>
        <Text style={styles.label}>Confirm Password</Text>
        <View style={{ position: "relative" }}>
          <TextInput
            style={[
              styles.input,
              { paddingRight: 44 },
              showMatchError && { borderColor: THEME.colors.danger },
            ]}
            placeholder="••••••••"
            placeholderTextColor={THEME.colors.text_opacity}
            secureTextEntry={!showConfirmPassword}
            value={values.confirmPassword}
            onChangeText={(text) => onChange("confirmPassword", text)}
          />
          <TouchableOpacity
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            style={{
              position: "absolute",
              right: 12,
              top: 0,
              bottom: 0,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons
              name={showConfirmPassword ? "eye-off" : "eye"}
              size={20}
              color={THEME.colors.text_opacity}
            />
          </TouchableOpacity>
        </View>
        {showMatchError && (
          <Text style={{ color: THEME.colors.danger, fontSize: 12, marginTop: 2 }}>
            Las contraseñas no coinciden
          </Text>
        )}
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
    borderRadius: 5,
    paddingHorizontal: 16,
    padding: 12,
    color: "#e5e2e1",
    borderWidth: 1,
    borderColor: "#444748",
  },
  button: {
    height: 54,
    backgroundColor: THEME.colors.primary,
    borderRadius: 5,
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
  },
  helperText: {
    color: THEME.colors.text_opacity
  }
})
