import React from "react";
import { View, Text, StyleSheet, Image, Platform } from "react-native";
import colors from "../theme/colors";
import { useResponsive } from "../utils/useResponsive";

/**
 * Accenture-style hero/header block with left-aligned text and
 * right-aligned masked image. Reuse across screens to keep headers consistent.
 */
export default function HeaderImageSection({
  title,
  subtitle,
  imageSource,
  compact = false,
  height = 190,
  overlay = false,
  children,
}) {
  const { isMobile } = useResponsive();

  return (
    <View
      style={[
        styles.container,
        { minHeight: height },
        compact && styles.compact,
        isMobile && styles.mobile,
      ]}
    >
      <View style={styles.textBlock}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        {children}
      </View>

      <View style={styles.imageShell}>
        <View style={[styles.imageMask, overlay && styles.imageOverlay]} />
        <Image
          source={imageSource}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 14,
    shadowColor: colors.accent,
    shadowOpacity: 0.14,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  compact: {
    paddingVertical: 12,
  },
  mobile: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  textBlock: {
    flex: 1,
    gap: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.primary,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
  },
  imageShell: {
    width: 140,
    height: 140,
    borderRadius: 90,
    overflow: "hidden",
    backgroundColor: colors.grayLight,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  imageMask: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 90,
    backgroundColor: "rgba(0,0,0,0.06)",
  },
  imageOverlay: {
    backgroundColor: "rgba(0,0,0,0.15)",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});

