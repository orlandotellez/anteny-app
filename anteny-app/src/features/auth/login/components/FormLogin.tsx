import { Text, TextInput, TouchableOpacity, View } from "react-native"
import { MaterialIcons } from "@expo/vector-icons";
import { THEME } from "@/src/shared/lib/theme";
import { styles } from "./FormLogin.styles";

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
