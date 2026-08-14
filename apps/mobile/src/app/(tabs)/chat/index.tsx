import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Crown, Image as ImageIcon, Send, X } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { FlatList, KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ChatBubble } from "@/components/chat/chat-bubble";
import { TypingIndicator } from "@/components/chat/typing-indicator";
import { IconButton } from "@/components/ui/icon-button";
import { generateOutfit } from "@/constants/mock-outfits";
import { imageAcknowledgement, INITIAL_MESSAGES, matchOutfitContext, pickGenericReply, SUGGESTION_CHIPS } from "@/constants/mock-chat";
import { useOutfits } from "@/context/outfits-context";
import type { ChatMessage } from "@/types";

import { color } from "@/design";
import { AppImage } from "@/components/ui/app-image";
import { PressableScale } from "@/components/ui/pressable-scale";

let messageCounter = 0;
function nextMessageId() {
  messageCounter += 1;
  return `msg-${Date.now()}-${messageCounter}`;
}

export default function ChatScreen() {
  const { setLastGenerated } = useOutfits();
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState("");
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [typing, setTyping] = useState(false);
  const listRef = useRef<FlatList<ChatMessage>>(null);

  useEffect(() => {
    const timeout = setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    return () => clearTimeout(timeout);
  }, [messages, typing]);

  const respondTo = (text: string, hadImage: boolean) => {
    setTyping(true);
    const timeout = setTimeout(() => {
      setTyping(false);

      if (hadImage && !text) {
        setMessages((prev) => [
          ...prev,
          { id: nextMessageId(), role: "assistant", text: imageAcknowledgement(), createdAt: Date.now() },
        ]);
        return;
      }

      const context = matchOutfitContext(text);
      if (context) {
        const outfit = generateOutfit(context);
        setLastGenerated([outfit]);
        setMessages((prev) => [
          ...prev,
          {
            id: nextMessageId(),
            role: "assistant",
            text: `Here's a ${context.toLowerCase()} look for you:`,
            outfit,
            createdAt: Date.now(),
          },
        ]);
        return;
      }

      setMessages((prev) => [
        ...prev,
        { id: nextMessageId(), role: "assistant", text: pickGenericReply(), createdAt: Date.now() },
      ]);
    }, 1100 + Math.random() * 500);

    return () => clearTimeout(timeout);
  };

  const handleSend = (promptOverride?: string) => {
    const text = (promptOverride ?? inputText).trim();
    if (!text && !attachedImage) return;

    const userMessage: ChatMessage = {
      id: nextMessageId(),
      role: "user",
      text: text || undefined,
      imageUri: attachedImage ?? undefined,
      createdAt: Date.now(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    const hadImage = !!attachedImage;
    setAttachedImage(null);
    respondTo(text, hadImage);
  };

  const handleAttach = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.6,
    });
    if (!result.canceled && result.assets[0]) {
      setAttachedImage(result.assets[0].uri);
    }
  };

  const canSend = inputText.trim().length > 0 || !!attachedImage;

  return (
    <SafeAreaView edges={["top", "left", "right"]} className="flex-1 bg-canvas">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 8 : 0}
      >
        <View className="flex-row items-center justify-between px-4 pb-2 pt-2">
          <View>
            <Text className="text-lg font-bold text-ink">AI Stylist</Text>
            <Text className="text-xs text-muted">Always here to help you get dressed</Text>
          </View>
          <IconButton className="bg-ink" variant="solid" onPress={() => router.push("/chat/paywall")}>
            <Crown size={18} color={color.primary} />
          </IconButton>
        </View>

        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerClassName="gap-4 py-4"
          renderItem={({ item }) => <ChatBubble message={item} />}
          ListFooterComponent={typing ? <TypingIndicator /> : null}
          showsVerticalScrollIndicator={false}
          initialNumToRender={10}
          maxToRenderPerBatch={8}
          windowSize={9}
          keyboardShouldPersistTaps="handled"
          // Unanimated: an animated scroll fires on every content-size change
          // (including each streamed bubble) and competes with the incoming
          // render, which read as stutter while the assistant was "typing".
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
        />

        {messages.length <= 1 ? (
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={SUGGESTION_CHIPS}
            keyExtractor={(item) => item.label}
            contentContainerClassName="gap-2 px-4 pb-3"
            renderItem={({ item }) => (
              <PressableScale
                onPress={() => (item.pro ? router.push("/chat/paywall") : handleSend(item.prompt))}
                className="flex-row items-center gap-1.5 rounded-full border border-line bg-surface px-4 py-2.5"
              >
                {item.pro ? <Crown size={13} color={color.primary} /> : null}
                <Text className="text-sm font-medium text-ink">{item.label}</Text>
              </PressableScale>
            )}
          />
        ) : null}

        {attachedImage ? (
          <View className="flex-row items-center gap-2 px-4 pb-2">
            <View className="relative">
              <AppImage source={{ uri: attachedImage }} className="h-14 w-14 rounded-xl bg-surface-sunken" />
              <PressableScale
                onPress={() => setAttachedImage(null)}
                className="absolute -right-1.5 -top-1.5 h-5 w-5 items-center justify-center rounded-full bg-ink"
              >
                <X size={12} color={color.canvas} />
              </PressableScale>
            </View>
            <Text className="text-xs text-muted">Attached — add a note or just hit send</Text>
          </View>
        ) : null}

        <View className="flex-row items-center gap-2 border-t border-line px-4 py-3">
          <IconButton onPress={handleAttach}>
            <ImageIcon size={20} color={color.ink} />
          </IconButton>
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask your stylist anything…"
            placeholderTextColor={color.muted}
            className="h-11 flex-1 rounded-full border border-line bg-surface px-4 text-base text-ink"
            multiline={false}
            onSubmitEditing={() => handleSend()}
            returnKeyType="send"
          />
          <PressableScale
            onPress={() => handleSend()}
            disabled={!canSend}
            className={`h-11 w-11 items-center justify-center rounded-full bg-ink ${
              canSend ? "" : "opacity-40"
            }`}
          >
            <Send size={18} color={color.canvas} />
          </PressableScale>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
