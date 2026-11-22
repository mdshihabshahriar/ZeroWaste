// Nearby donations — Member 1 (Mahir)
import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Screen from "../../common/components/Screen";
import DonationCard from "../../common/components/DonationCard";
import Chip, { ChipRow } from "../../common/components/Chip";
import { Tag } from "../../common/components/StatusBadge";
import {
  Loading,
  ErrorView,
  EmptyView,
} from "../../common/components/StateViews";
import { useAuth } from "../../common/context/AuthContext";
import { useData } from "../../common/hooks/useData";
import { getNearbyDonations } from "../volunteerService";
import { colors } from "../../common/constants/theme";

const RADII = [2, 5, 10];

export default function Nearby() {
  const { user } = useAuth();
  const [radius, setRadius] = useState(5);
  const { data, loading, error, reload } = useData(
    () => getNearbyDonations(radius),
    [radius],
  );

  return (
    <Screen tabs onRefresh={reload}>
      <View>
        <Text style={styles.small}>Your location</Text>
        <View style={styles.locRow}>
          <Ionicons name="location" size={18} color={colors.primary} />
          <Text style={styles.loc}>{user?.area}</Text>
        </View>
      </View>

      {/* Simple map preview — a real map (react-native-maps) can replace this later */}
      <View style={styles.map}>
        <View
          style={[styles.road, { top: 52, transform: [{ rotate: "-8deg" }] }]}
        />
        <View style={[styles.road, { top: 100, height: 8 }]} />
        <View style={styles.me} />
        {(data ?? []).slice(0, 4).map((d, i) => (
          <View
            key={d.id}
            style={[styles.pin, { left: 40 + i * 75, top: i % 2 ? 78 : 22 }]}
          >
            <Text style={styles.pinText}>{d.distanceKm} km</Text>
          </View>
        ))}
      </View>

      <View style={styles.filterRow}>
        <Text style={styles.small}>Within</Text>
        <ChipRow>
          {RADII.map((r) => (
            <Chip
              key={r}
              label={`${r} km`}
              selected={radius === r}
              onPress={() => setRadius(r)}
            />
          ))}
        </ChipRow>
      </View>

      {loading && !data ? (
        <Loading label="Finding food near you…" />
      ) : error ? (
        <ErrorView message={error} onRetry={reload} />
      ) : !data?.length ? (
        <EmptyView
          title="No food nearby right now"
          subtitle="Try a bigger radius or check again later."
          icon="search-outline"
        />
      ) : (
        <>
          <Text style={styles.h2}>{data.length} donations available</Text>
          {data.map((d) => (
            <DonationCard
              key={d.id}
              donation={d}
              showDistance
              onPress={() =>
                router.push({
                  pathname: "/volunteer/donation-detail",
                  params: { id: d.id },
                })
              }
              subtitle={d.donorName}
              right={
                <View style={{ gap: 6, alignItems: "flex-end" }}>
                  <Tag text={`${d.portions} portions`} />
                  <Tag
                    text={`by ${d.collectBy}`}
                    bg={colors.accentSoft}
                    fg={colors.accentText}
                  />
                </View>
              }
            />
          ))}
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  small: { fontSize: 13, fontWeight: "600", color: colors.muted },
  locRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 2 },
  loc: { fontSize: 18, fontWeight: "800", color: colors.ink },
  map: {
    height: 132,
    borderRadius: 22,
    backgroundColor: "#E4EADF",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#D5DAD0",
  },
  road: {
    position: "absolute",
    left: -20,
    right: -20,
    height: 14,
    backgroundColor: colors.white,
  },
  me: {
    position: "absolute",
    left: "45%",
    top: 52,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.blue,
    borderWidth: 4,
    borderColor: colors.white,
  },
  pin: {
    position: "absolute",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: colors.accent,
  },
  pinText: { fontSize: 11, fontWeight: "800", color: colors.white },
  filterRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  h2: { fontSize: 17, fontWeight: "800", color: colors.ink },
});
