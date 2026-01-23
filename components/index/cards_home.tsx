import { Colors } from "@/constants/theme";
import { useTheme } from "@/context/theme-context";
import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface CardProps {
  title: string;
  subtitle: string;
  price: string;
  time: string;
  icon?: string;
  iconColor?: string;
  onPress?: () => void;
}

function hexToRgba(hex: string, alpha = 1) {
  const h = hex.replace("#", "");
  const bigint = parseInt(
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h,
    16
  );
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function CardHome({
  title,
  subtitle,
  price,
  time,
  icon = "local-shipping",
  iconColor,
  onPress,
}: CardProps) {
  const { isDark } = useTheme();
  const colors = Colors[isDark ? "dark" : "light"];
  const resolvedIconColor = iconColor ?? colors.tint;
  const iconBg = hexToRgba(resolvedIconColor, 0.12);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.card, { borderWidth: 1,backgroundColor: isDark ? "#141414" : "#ffff", borderColor: isDark ? "#2C2C2C" : "#eee" }]}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View style={[styles.iconWrapper, { backgroundColor: iconBg }]}>
            <MaterialIcons
              name={icon as any}
              size={20}
              color={resolvedIconColor}
            />
          </View>

          <View style={styles.textContainer}>
            <Text
              style={[styles.title, { color: colors.text }]}
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text
              style={[styles.subtitle, { color: colors.icon }]}
              numberOfLines={1}
            >
              {subtitle}
            </Text>
          </View>
        </View>

        <View style={styles.priceContainer}>
          <Text style={[styles.price, { color: colors.text }]}>{price}</Text>
          <Text style={[styles.time, { color: colors.icon }]}>{time}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,    
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
  },
  priceContainer: {
    alignItems: "flex-end",
  },
  price: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  time: {
    fontSize: 11,
  },
});
