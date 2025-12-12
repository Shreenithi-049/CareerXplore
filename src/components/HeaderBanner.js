import React from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";
import colors from "../theme/colors";
import { useResponsive } from "../utils/useResponsive";

/**
 * Full-width banner with background image and overlaid text.
 * Text is positioned over the image for a true hero banner layout.
 */
export default function HeaderBanner({
  image,
  title,
  subtitle,
  height,
  overlayOpacity = 0.2,
  textColor = colors.white,
}) {
  const { isMobile } = useResponsive();

  const bannerHeight = height || (isMobile ? 200 : 260);

  return (
    <View style={[styles.container, { height: bannerHeight }]}>
      <ImageBackground
        source={image}
        style={styles.imageBackground}
        resizeMode="cover"
      >
        {/* Dark overlay for text readability */}
        <View
          style={[
            styles.overlay,
            { backgroundColor: `rgba(0,0,0,${overlayOpacity})` },
          ]}
        />

        {/* Text content overlaid on image */}
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: textColor }]}>{title}</Text>
          {subtitle && (
            <Text style={[styles.subtitle, { color: textColor }]}>
              {subtitle}
            </Text>
          )}
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 20,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  imageBackground: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 20,
    zIndex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 8,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 22,
    opacity: 0.95,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});

