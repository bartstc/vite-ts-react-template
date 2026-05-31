// AIDEV-NOTE: thin re-export of the API-layer request fn (providers/ is the slice data
// gateway). Injected into checkoutMachine as a `fromPromise` actor. See 003.
export { applyCheckout } from "@/lib/api/checkout/apply-checkout-mutation";
