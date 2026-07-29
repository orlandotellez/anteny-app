import React, { useEffect, useRef, useCallback } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  BackHandler,
  Dimensions,
} from 'react-native';
import { THEME } from '@/src/shared/lib/theme';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  destructive?: boolean;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Sí, continuar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
  destructive = false,
}: ConfirmDialogProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;

  // Animate in/out
  useEffect(() => {
    if (open) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          damping: 20,
          stiffness: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.92);
    }
  }, [open, fadeAnim, scaleAnim]);

  // Android back button closes dialog
  useEffect(() => {
    if (!open) return;
    const onBackPress = () => {
      onCancel();
      return true;
    };
    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [open, onCancel]);

  const handleOverlayPress = useCallback(() => {
    onCancel();
  }, [onCancel]);

  return (
    <Modal
      visible={open}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onCancel}
    >
      <Animated.View
        style={[
          styles.overlay,
          { opacity: fadeAnim },
        ]}
      >
        <Pressable style={styles.overlayTouch} onPress={handleOverlayPress} />
      </Animated.View>

      <View style={styles.centeredContainer} pointerEvents="box-none">
        <Animated.View
          style={[
            styles.dialog,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Title */}
          <Text style={styles.title}>{title}</Text>

          {/* Message */}
          <Text style={styles.message}>{message}</Text>

          {/* Actions */}
          <View style={styles.actions}>
            <Pressable
              style={({ pressed }) => [
                styles.cancelBtn,
                pressed && styles.cancelBtnPressed,
              ]}
              onPress={onCancel}
            >
              <Text style={styles.cancelText}>{cancelLabel}</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.confirmBtn,
                destructive && styles.confirmBtnDestructive,
                pressed && styles.confirmBtnPressed,
              ]}
              onPress={onConfirm}
            >
              <Text
                style={[
                  styles.confirmText,
                  destructive && styles.confirmTextDestructive,
                ]}
              >
                {confirmLabel}
              </Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const { width: screenWidth } = Dimensions.get('window');
const DIALOG_MAX_WIDTH = 320;

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  overlayTouch: {
    flex: 1,
  },
  centeredContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialog: {
    width: Math.min(screenWidth - 24 * 2, DIALOG_MAX_WIDTH),
    backgroundColor: THEME.colors.secondary,
    borderRadius: 5,
    paddingVertical: 28,
    paddingHorizontal: 24,
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME.colors.text_title,
    textAlign: 'center',
    marginBottom: 10,
  },
  message: {
    fontSize: 14,
    color: THEME.colors.text_opacity,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 28,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  cancelBtn: {
    flex: 1,
    minHeight: 48,
    borderRadius: 5,
    backgroundColor: THEME.colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  cancelBtnPressed: {
    backgroundColor: THEME.colors.muted,
  },
  cancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: THEME.colors.text_opacity,
  },
  confirmBtn: {
    flex: 1,
    minHeight: 48,
    borderRadius: 5,
    backgroundColor: THEME.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  confirmBtnDestructive: {
    backgroundColor: THEME.colors.danger,
  },
  confirmBtnPressed: {
    opacity: 0.85,
  },
  confirmText: {
    fontSize: 15,
    fontWeight: '600',
    color: THEME.colors.surface,
  },
  confirmTextDestructive: {
    color: '#FFFFFF',
  },
});
