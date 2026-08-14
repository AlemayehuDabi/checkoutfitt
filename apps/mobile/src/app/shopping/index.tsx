import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { Camera, Images, Link2, X } from "lucide-react-native";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/ui/header";
import { Input } from "@/components/ui/input";
import { PageHeading } from "@/components/ui/page-heading";
import { ScreenContainer } from "@/components/ui/screen-container";
import { SectionHeader } from "@/components/ui/section-header";
import { color } from "@/design";
import { AppImage } from "@/components/ui/app-image";
import { IconWell } from "@/components/ui/icon-well";

export default function ShoppingInputScreen() {
  const [link, setLink] = useState("");
  const [price, setPrice] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]?.uri) {
      setImageUri(result.assets[0].uri);
    }
  };

  const canSubmit = Boolean(link.trim() || imageUri);

  return (
    <ScreenContainer scroll keyboardAware>
      <Header title="Shopping Assistant" />

      <PageHeading
        eyebrow="Before you buy"
        title="Is it worth it?"
        subtitle="Paste a link or add a photo and we'll check it against what you already own."
      />

      <SectionHeader title="The item" index="01" className="mt-8" />

      <Input
        label="Product link"
        placeholder="https://…"
        value={link}
        onChangeText={setLink}
        keyboardType="url"
        icon={<Link2 size={17} color={color.faint} />}
      />

      <View className="mt-4 flex-row items-center gap-3">
        <View className="h-px flex-1 bg-line" />
        <Text className="text-micro font-semibold uppercase text-muted">or</Text>
        <View className="h-px flex-1 bg-line" />
      </View>

      {imageUri ? (
        <View className="mt-4">
          <View className="h-56 w-full overflow-hidden rounded-3xl border border-line">
            <AppImage source={{ uri: imageUri }} className="h-full w-full" contentFit="cover" />
          </View>
          <Pressable
            onPress={() => setImageUri(null)}
            hitSlop={8}
            accessibilityLabel="Remove photo"
            className="absolute right-3 top-3 h-9 w-9 items-center justify-center rounded-full bg-black/50 active:opacity-70"
          >
            <X size={17} color={color.white} />
          </Pressable>
        </View>
      ) : (
        <View className="mt-4 flex-row gap-2.5">
          <Card onPress={pickImage} className="flex-1 items-center gap-2.5 p-5">
            <IconWell size="md"><Images size={19} color={color.primary} strokeWidth={1.75} /></IconWell>
            <Text className="text-body-sm font-semibold text-ink">From Library</Text>
          </Card>
          <Card onPress={pickImage} className="flex-1 items-center gap-2.5 p-5">
            <IconWell size="md"><Camera size={19} color={color.primary} strokeWidth={1.75} /></IconWell>
            <Text className="text-body-sm font-semibold text-ink">Take a Photo</Text>
          </Card>
        </View>
      )}

      <SectionHeader title="The price" index="02" className="mt-9" />
      <Input
        label="What does it cost?"
        placeholder="128"
        value={price}
        onChangeText={setPrice}
        keyboardType="number-pad"
        hint="Used to work out cost per wear against your closet."
      />

      <Button
        label="Check It"
        disabled={!canSubmit}
        onPress={() =>
          router.push({
            pathname: "/shopping/analyze",
            params: { price: price || "128", uri: imageUri ?? "" },
          })
        }
        className="mb-2 mt-9"
      />
    </ScreenContainer>
  );
}
