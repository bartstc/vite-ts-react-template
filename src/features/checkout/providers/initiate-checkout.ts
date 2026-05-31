// AIDEV-NOTE: thin re-export of the API-layer request fn (providers/ is the slice data
// gateway). Injected into checkoutMachine as a `fromPromise` actor by CheckoutActorProvider.
// No cart invalidation here — injected as onConfirmed by the carts-aware dialog. See 003.
export { initiateCheckout } from "@/lib/api/checkout/initiate-checkout-mutation";
