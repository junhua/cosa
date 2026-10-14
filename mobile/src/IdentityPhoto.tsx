import React, { useEffect, useRef, useState } from "react";
import { Image, Platform, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { File, Paths } from "expo-file-system";
import { Button, Fine, Notice, SectionTitle, Select, ui } from "./components";

function release(uri: string) {
  if (Platform.OS === "web") {
    if (uri.startsWith("blob:")) URL.revokeObjectURL(uri);
  } else {
    try {
      if (uri.startsWith(Paths.cache.uri)) new File(uri).delete();
    } catch {
      /* cache may already be evicted */
    }
  }
}
export default function IdentityPhoto({
  onReady,
}: {
  onReady: (ready: boolean) => void;
}) {
  const [kind, setKind] = useState("Passport");
  const [uri, setUri] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const current = useRef("");
  const alive = useRef(true);
  const generation = useRef(0);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      // Cancels pending picker promises; this counter is not a DOM ref.
      // eslint-disable-next-line react-hooks/exhaustive-deps
      generation.current++;
      if (current.current) release(current.current);
    };
  }, []);
  function clear() {
    generation.current++;
    if (current.current) release(current.current);
    current.current = "";
    setUri("");
    onReady(false);
    setError("");
  }
  async function choose(source: "file" | "photos" | "camera") {
    if (busy) return;
    setBusy(true);
    setError("");
    const request = ++generation.current;
    let candidate = "";
    try {
      let mimeType: string | undefined;
      let size: number | undefined;
      if (source === "file") {
        const result = await DocumentPicker.getDocumentAsync({
          type: ["image/jpeg", "image/png", "image/webp"],
          multiple: false,
          copyToCacheDirectory: true,
        });
        if (result.canceled) return;
        const asset = result.assets[0];
        candidate = asset.uri;
        mimeType = asset.mimeType;
        size = asset.file?.size ?? asset.size;
      } else {
        if (source === "camera" && Platform.OS !== "web") {
          const permission = await ImagePicker.requestCameraPermissionsAsync();
          if (!alive.current || request !== generation.current) return;
          if (!permission.granted) {
            setError(
              "Camera access is unavailable. Choose a photo or upload a file instead.",
            );
            return;
          }
        }
        const options: ImagePicker.ImagePickerOptions = {
          mediaTypes: ["images"],
          allowsEditing: false,
          allowsMultipleSelection: false,
          quality: 1,
          exif: false,
          preferredAssetRepresentationMode:
            ImagePicker.UIImagePickerPreferredAssetRepresentationMode
              .Compatible,
        };
        const result =
          source === "camera"
            ? await ImagePicker.launchCameraAsync(options)
            : await ImagePicker.launchImageLibraryAsync(options);
        if (result.canceled) return;
        const asset = result.assets[0];
        candidate = asset.uri;
        mimeType = asset.mimeType;
        size = asset.file?.size ?? asset.fileSize;
        if (Platform.OS !== "web") {
          size ??= new File(candidate).size;
          mimeType ??= "image/jpeg";
        }
      }
      if (!alive.current || request !== generation.current) {
        release(candidate);
        return;
      }
      if (
        !(
          source === "file"
            ? ["image/jpeg", "image/png", "image/webp"]
            : [
                "image/jpeg",
                "image/png",
                "image/webp",
                "image/heic",
                "image/heif",
              ]
        ).includes(mimeType ?? "") ||
        size === undefined ||
        size > 10 * 1024 * 1024 ||
        size === 0
      )
        throw new Error(
          "Choose a readable image up to 10 MB. Files must be JPG, PNG or WebP.",
        );
      await new Promise<void>((resolve, reject) =>
        Image.getSize(
          candidate,
          (w, h) => (w > 0 && h > 0 ? resolve() : reject(new Error())),
          reject,
        ),
      );
      if (!alive.current || request !== generation.current) {
        release(candidate);
        return;
      }
      if (current.current) release(current.current);
      current.current = candidate;
      setUri(candidate);
      onReady(true);
    } catch (e) {
      if (candidate) release(candidate);
      if (alive.current && request === generation.current)
        setError(
          e instanceof Error && e.message.startsWith("Choose")
            ? e.message
            : "This image could not be opened. Please choose another photo.",
        );
    } finally {
      if (alive.current) setBusy(false);
    }
  }
  return (
    <View
      style={[
        ui.card,
        {
          backgroundColor: "transparent",
          borderWidth: 1,
          borderColor: "#d6ded5",
          padding: 18,
        },
      ]}
    >
      <SectionTitle>NRIC / passport photo</SectionTitle>
      <Select
        label="Document type"
        value={kind}
        options={["Passport", "NRIC"]}
        onChange={(value) => {
          setKind(value);
          clear();
        }}
      />
      <Fine>
        {kind === "Passport"
          ? "Choose a clear photo of the passport photo page."
          : "Choose a clear photo of the front of your NRIC."}{" "}
        Keep all corners visible and avoid glare.
      </Fine>
      <Button
        secondary
        disabled={busy}
        onPress={() => choose("file")}
        icon="upload"
      >
        Upload file
      </Button>
      <Button
        secondary
        disabled={busy}
        onPress={() => choose("photos")}
        icon="image"
      >
        Choose from photos
      </Button>
      <Button
        secondary
        disabled={busy}
        onPress={() => choose("camera")}
        icon="camera"
      >
        Take a photo
      </Button>
      <Fine>
        Image files: JPG, PNG or WebP · maximum 10 MB. Replace the preview using
        any option above.
      </Fine>
      {busy && <Fine>Opening image…</Fine>}
      {!!error && <Notice error>{error}</Notice>}
      {!!uri && (
        <>
          <Image
            source={{ uri }}
            accessibilityLabel="Selected identity document preview"
            resizeMode="contain"
            style={{
              width: "100%",
              height: 190,
              borderRadius: 10,
              marginTop: 16,
            }}
          />
          <Notice success>Photo ready</Notice>
          <Button secondary onPress={clear}>
            Remove photo
          </Button>
        </>
      )}
      <Fine>
        Your photo stays on this device and is cleared when you leave this form.
      </Fine>
    </View>
  );
}
