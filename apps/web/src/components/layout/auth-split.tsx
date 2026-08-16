import * as React from "react";
import Link from "next/link";

/**
 * Auth split: form on the left, brand panel on the right.
 *
 * The brand side is drawn in CSS rather than photography — there are no image
 * assets yet, and a missing hero would be the first thing anyone sees. Layered
 * warm gradients and a soft grain read as fabric and keep the terracotta
 * palette front and centre. Drop a photo in behind the overlay when art is
 * available. It collapses entirely below lg.
 */
export function AuthSplit({
  children,
  tagline,
  caption,
}: {
  children: React.ReactNode;
  tagline: string;
  caption: string;
}) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      {/* Form side */}
      <div className="flex flex-col px-lg py-4xl sm:px-3xl">
        <Link
          href="/"
          className="w-fit rounded-sm text-body-semibold tracking-[-0.2px] text-primary-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
        >
          CheckoutFitt
        </Link>
        <div className="flex flex-1 items-center justify-center py-4xl">
          <div className="w-full max-w-[420px]">{children}</div>
        </div>
      </div>

      {/* Brand side */}
      <div className="relative hidden overflow-hidden lg:block">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundImage: [
              "radial-gradient(80% 60% at 15% 12%, #e8a878 0%, rgba(232,168,120,0) 60%)",
              "radial-gradient(70% 55% at 85% 25%, #d4783c 0%, rgba(212,120,60,0) 55%)",
              "radial-gradient(90% 70% at 70% 95%, #8a4119 0%, rgba(138,65,25,0) 60%)",
              "linear-gradient(150deg, #c1622d 0%, #a64f21 45%, #6d3414 100%)",
            ].join(","),
          }}
        />
        {/* Fine diagonal weave — suggests fabric without an image. */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.14] mix-blend-overlay"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, #fff 0 1px, transparent 1px 7px), repeating-linear-gradient(-45deg, #fff 0 1px, transparent 1px 7px)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-2/3"
          style={{
            backgroundImage:
              "linear-gradient(to top, rgba(26,25,23,0.55) 0%, rgba(26,25,23,0) 100%)",
          }}
        />

        <div className="relative flex h-full flex-col justify-end p-6xl">
          <p className="text-eyebrow uppercase text-white/70">
            Dress well, effortlessly
          </p>
          <p className="mt-lg max-w-[18ch] text-display text-white text-balance">
            {tagline}
          </p>
          <p className="mt-lg max-w-[42ch] text-body-lg text-white/80">
            {caption}
          </p>
        </div>
      </div>
    </div>
  );
}
