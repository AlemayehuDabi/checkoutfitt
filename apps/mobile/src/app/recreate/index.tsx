import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { Images, Link2, X } from "lucide-react-native";
import { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { Header } from "@/components/ui/header";
import { Input } from "@/components/ui/input";
import { PageHeading } from "@/components/ui/page-heading";
import { ScreenContainer } from "@/components/ui/screen-container";
import { SectionHeader } from "@/components/ui/section-header";
import { INSPO_SOURCES } from "@/constants/mock-recreation";
import { color } from "@/design";

export default function RecreateInputScreen() {
  const [source, setSource] = useState<string>("Pinterest");
  const [link, setLink] = useState("");
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
      <Header title="Recreate a Look" />

      <PageHeading
        eyebrow="Steal the look"
        title="Rebuild it from your closet"
        subtitle="Drop in an image you've saved and we'll match each piece against what you own."
      />

      <SectionHeader title="Where's it from" index="01" className="mt-8" />
      <View className="flex-row flex-wrap gap-2">
        {INSPO_SOURCES.map((entry) => (
          <Chip
            key={entry}
            label={entry}
            selected={source === entry}
            onPress={() => setSource(entry)}
          />
        ))}
      </View>

      <SectionHeader title="The reference" index="02" className="mt-8" />

      {imageUri ? (
        <View>
          <View className="h-80 w-full overflow-hidden rounded-3xl border border-line">
            <Image source={{ uri: imageUri }} className="h-full w-full" resizeMode="cover" />
          </View>
          <Pressable
            onPress={() => setImageUri(null)}
            hitSlop={8}
            accessibilityLabel="Remove image"
            className="absolute right-3 top-3 h-9 w-9 items-center justify-center rounded-full bg-black/50 active:opacity-70"
          >
            <X size={17} color={color.white} />
          </Pressable>
        </View>
      ) : (
        <Card onPress={pickImage} tone="sunken" className="items-center gap-3 py-10">
          <View className="h-14 w-14 items-center justify-center rounded-3xl bg-surface">
            <Images size={22} color={color.primary} strokeWidth={1.5} />
          </View>
          <Text className="text-body font-semibold text-ink">Upload an image</Text>
          <Text className="px-8 text-center text-caption text-muted">
            A screenshot or saved pin works fine
          </Text>
        </Card>
      )}

      <View className="mt-5 flex-row items-center gap-3">
        <View className="h-px flex-1 bg-line" />
        <Text className="text-micro font-semibold uppercase text-muted">or paste a link</Text>
        <View className="h-px flex-1 bg-line" />
      </View>

      <Input
        label="Image link"
        placeholder="https://pin.it/…"
        value={link}
        onChangeText={setLink}
        keyboardType="url"
        icon={<Link2 size={17} color={color.faint} />}
        containerClassName="mt-5"
      />

      <Button
        label="Find My Version"
        disabled={!canSubmit}
        onPress={() =>
          router.push({
            pathname: "/recreate/analyze",
            params: { uri: imageUri ?? "", source },
          })
        }
        className="mb-2 mt-9"
      />
    </ScreenContainer>
  );
}
