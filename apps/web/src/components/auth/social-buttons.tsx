import * as React from "react";
import { Button } from "@/components/ui/button";

/** Brand marks are inlined — the CSP blocks external assets and these are tiny. */
function AppleMark() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-[18px]" fill="currentColor">
      <path d="M16.365 1.43c0 1.14-.42 2.2-1.12 3.02-.85.99-2.24 1.76-3.4 1.67a3.6 3.6 0 0 1-.03-.42c0-1.1.5-2.25 1.2-3.02.84-.94 2.28-1.65 3.31-1.69.02.15.04.3.04.44ZM20.9 17.06c-.55 1.27-.82 1.84-1.53 2.97-.99 1.57-2.39 3.53-4.12 3.54-1.54.02-1.93-1-4.02-.99-2.09.01-2.52 1.01-4.06.99-1.73-.01-3.05-1.78-4.04-3.35C.35 15.83-.02 10.7 2.1 8.03c1.1-1.4 2.83-2.28 4.46-2.28 1.66 0 2.7.99 4.07.99 1.33 0 2.14-.99 4.06-.99 1.45 0 2.99.79 4.08 2.16-3.59 1.97-3 7.1.13 9.15Z" />
    </svg>
  );
}

function GoogleMark() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-[18px]">
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.46a5.52 5.52 0 0 1-2.4 3.62v3.01h3.88c2.27-2.09 3.58-5.17 3.58-8.82Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.08 7.94-2.91l-3.88-3.01c-1.08.72-2.45 1.15-4.06 1.15-3.13 0-5.78-2.11-6.73-4.95H1.26v3.1A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.28a7.2 7.2 0 0 1 0-4.56v-3.1H1.26a12 12 0 0 0 0 10.76l4.01-3.1Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.77c1.76 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.26 6.62l4.01 3.1C6.22 6.88 8.87 4.77 12 4.77Z"
      />
    </svg>
  );
}

export function SocialButtons({ verb = "Continue" }: { verb?: string }) {
  return (
    <div className="grid gap-md sm:grid-cols-2">
      <Button variant="outline" type="button" iconLeft={<AppleMark />} fullWidth>
        {verb} with Apple
      </Button>
      <Button variant="outline" type="button" iconLeft={<GoogleMark />} fullWidth>
        {verb} with Google
      </Button>
    </div>
  );
}
