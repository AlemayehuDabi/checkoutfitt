/**
 * `InsightCallout` is the original name for what the design spec calls the
 * suggestion/callout card. The implementation now lives in `callout-card.tsx`
 * under the spec's name; this alias keeps every existing call site — and its
 * props — working unchanged.
 */
export { CalloutCard as InsightCallout } from "./callout-card";
