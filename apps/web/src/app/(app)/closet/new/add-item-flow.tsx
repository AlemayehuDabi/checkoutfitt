"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CalloutCard } from "@/components/ui/callout-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { ItemForm, type ItemFormValues } from "@/components/closet/item-form";
import {
  UploadZone,
  type PendingFile,
} from "@/components/closet/upload-zone";

type Stage = "upload" | "analyzing" | "confirm";

/** Stands in for what VisionService returns after detection. */
const DETECTED: ItemFormValues = {
  type: "TOP",
  category: "Oxford shirt",
  color: "White",
  tags: ["cotton", "crisp", "smart"],
};

export function AddItemFlow() {
  const router = useRouter();
  const { toast } = useToast();
  const [stage, setStage] = React.useState<Stage>("upload");
  const [files, setFiles] = React.useState<PendingFile[]>([]);
  const [saving, setSaving] = React.useState(false);

  // Object URLs leak if they outlive the component.
  React.useEffect(() => {
    return () => files.forEach((f) => URL.revokeObjectURL(f.preview));
  }, [files]);

  function addFiles(list: FileList) {
    const next = Array.from(list).map((file) => ({
      id: `${file.name}-${file.size}-${crypto.randomUUID()}`,
      name: file.name,
      preview: URL.createObjectURL(file),
    }));
    setFiles((current) => [...current, ...next]);
  }

  function removeFile(id: string) {
    setFiles((current) => {
      const target = current.find((f) => f.id === id);
      if (target) URL.revokeObjectURL(target.preview);
      return current.filter((f) => f.id !== id);
    });
  }

  function startAnalyzing() {
    setStage("analyzing");
    // Detection is a queued job in the real app, so the wait is expected.
    window.setTimeout(() => setStage("confirm"), 2200);
  }

  function save(values: ItemFormValues) {
    setSaving(true);
    window.setTimeout(() => {
      setSaving(false);
      toast({
        kind: "success",
        title: "Added to your closet",
        description: `${values.category} is ready to wear.`,
      });
      router.push("/closet");
    }, 700);
  }

  return (
    <div className="mx-auto max-w-[720px] py-2xl">
      <Link
        href="/closet"
        className="mb-xl inline-flex items-center gap-sm rounded-sm text-sm text-text-muted transition-colors hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
      >
        <ArrowLeft aria-hidden className="size-4" />
        Back to closet
      </Link>

      <AnimatePresence mode="wait">
        {stage === "upload" && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <h2 className="text-h1 text-text-primary text-balance">
              Add to your closet
            </h2>
            <p className="mt-sm text-body-lg text-text-secondary">
              Photograph pieces on their own, against a plain background if you
              can — it makes them easier to identify.
            </p>

            <div className="mt-3xl">
              <UploadZone files={files} onAdd={addFiles} onRemove={removeFile} />
            </div>

            <div className="mt-2xl flex flex-wrap items-center gap-md">
              <Button
                size="lg"
                disabled={files.length === 0}
                onClick={startAnalyzing}
                iconLeft={<Sparkles className="size-4" />}
              >
                Analyze {files.length > 0 && `${files.length} `}
                {files.length === 1 ? "photo" : "photos"}
              </Button>
              {files.length === 0 && (
                <p className="text-caption text-text-muted">
                  Add at least one photo to continue.
                </p>
              )}
            </div>
          </motion.div>
        )}

        {stage === "analyzing" && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <h2 className="text-h1 text-text-primary">Analyzing your items…</h2>
            <p className="mt-sm text-body-lg text-text-secondary">
              Identifying the garment, colour and fabric in each photo. This
              takes a few seconds.
            </p>

            {/* Skeleton mirrors the confirm screen it becomes. */}
            <div className="mt-3xl grid gap-2xl sm:grid-cols-[200px_1fr]">
              <Skeleton className="aspect-square w-full rounded-xl" />
              <div className="flex flex-col gap-lg">
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-3.5 w-16 rounded-sm" />
                  <Skeleton className="h-11 w-full rounded-md" />
                </div>
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-3.5 w-20 rounded-sm" />
                  <Skeleton className="h-11 w-full rounded-md" />
                </div>
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-3.5 w-14 rounded-sm" />
                  <Skeleton className="h-11 w-full rounded-md" />
                </div>
                <div className="flex gap-sm">
                  <Skeleton className="h-9 w-24 rounded-full" />
                  <Skeleton className="h-9 w-20 rounded-full" />
                  <Skeleton className="h-9 w-28 rounded-full" />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {stage === "confirm" && (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <h2 className="text-h1 text-text-primary text-balance">
              Does this look right?
            </h2>
            <p className="mt-sm text-body-lg text-text-secondary">
              We filled these in from the photo. Correct anything that&apos;s off.
            </p>

            <CalloutCard icon={<Sparkles />} className="mt-xl">
              Detected a <strong>{DETECTED.category.toLowerCase()}</strong> in{" "}
              <strong>{DETECTED.color.toLowerCase()}</strong>. Edits you make
              here teach us nothing yet — but they&apos;re saved with the item.
            </CalloutCard>

            <div className="mt-3xl grid gap-2xl sm:grid-cols-[200px_1fr]">
              {files[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={files[0].preview}
                  alt={files[0].name}
                  className="aspect-square w-full rounded-xl border border-border object-cover"
                />
              ) : (
                <div className="aspect-square w-full rounded-xl bg-surface-secondary" />
              )}

              <ItemForm
                initial={DETECTED}
                submitLabel="Add to closet"
                submitting={saving}
                onSubmit={save}
                onCancel={() => setStage("upload")}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
