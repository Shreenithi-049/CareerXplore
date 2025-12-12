import React, { useState } from "react";
import { Pressable, StyleSheet, Platform } from "react-native";
import colors from "../theme/colors";

/**
 * Shared interaction wrapper that gives consistent hover/press feedback
 * across web and mobile. Use this instead of TouchableOpacity/Pressable
 * wherever possible so all tappable elements feel the same.
 */
export default function InteractiveWrapper({
  children,
  style,
  hoverStyle,
  pressedStyle,
  disabled,
  onPress,
  onLongPress,
  androidRippleColor,
  hitSlop = 6,
  ...rest
}) {
  const [isHovered, setIsHovered] = useState(false);

  const ripple =
    Platform.OS === "android"
      ? {
          android_ripple: {
            color: androidRippleColor || colors.accent + "33",
            foreground: true,
          },
        }
      : {};

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      onLongPress={onLongPress}
      hitSlop={hitSlop}
      style={({ pressed }) => [
        styles.base,
        style,
        isHovered && styles.hovered,
        isHovered && hoverStyle,
        pressed && styles.pressed,
        pressed && pressedStyle,
        disabled && styles.disabled,
      ]}
      {...ripple}
      {...(Platform.OS === "web"
        ? {
            onHoverIn: () => setIsHovered(true),
            onHoverOut: () => setIsHovered(false),
          }
        : {})}
      {...rest}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 10,
    overflow: "visible",
    minHeight: 0,
    justifyContent: "center",
    transitionProperty: "transform, box-shadow",
    transitionDuration: "150ms",
    transitionTimingFunction: "ease",
  },
  hovered: Platform.select({
    web: {
      transform: [{ scale: 1.02 }],
      boxShadow: "0px 8px 22px rgba(0,0,0,0.12)",
    },
    default: {},
  }),
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.5,
  },
});

