import { router } from "expo-router";
import * as Location from "expo-location";
import { MapPin } from "lucide-react-native";
import { useState } from "react";
import { Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import { ScreenContainer } from "@/components/ui/screen-container";
import { DEFAULT_LOCATION } from "@/constants/mock-weather";
import { useWeather } from "@/context/weather-context";

import { color } from "@/design";
import { IconWell } from "@/components/ui/icon-well";

export default function LocationScreen() {
  const { setLocationName } = useWeather();
  const [requesting, setRequesting] = useState(false);

  const handleAllow = async () => {
    setRequesting(true);
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (!permission.granted) {
        router.back();
        return;
      }

      const position = await Location.getCurrentPositionAsync({});
      let label = "Current Location";
      try {
        const [address] = await Location.reverseGeocodeAsync({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        if (address?.city) {
          label = address.region ? `${address.city}, ${address.region}` : address.city;
        }
      } catch {
        // Reverse geocoding isn't available on every platform — fall back to a generic label.
      }

      setLocationName(label);
      router.back();
    } finally {
      setRequesting(false);
    }
  };

  const handleUseDemo = () => {
    setLocationName(DEFAULT_LOCATION);
    router.back();
  };

  return (
    <ScreenContainer>
      <View className="flex-1 items-center justify-center">
        <IconWell size="2xl" round>
          <MapPin size={30} color={color.primary500} />
        </IconWell>
        <Text className="mt-2xl text-center text-h1 font-bold text-text-primary">
          Set your location
        </Text>
        <Text className="mt-sm text-center text-body text-text-muted">
          CheckoutFitt uses your location to check today&apos;s weather and recommend an outfit
          that actually fits the forecast.
        </Text>
      </View>

      <View className="gap-md pb-lg">
        <Button label="Allow Location Access" onPress={handleAllow} loading={requesting} />
        <Button label="Use Demo Location" variant="ghost" onPress={handleUseDemo} />
      </View>
    </ScreenContainer>
  );
}
