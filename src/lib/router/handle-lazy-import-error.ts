// References
// https://github.com/remix-run/react-router/discussions/10333
// https://dimaip.github.io/2020/04/25/deploying-apps-with-code-splitting/

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function handleLazyImportError(e: unknown): any {
  // TypeError
  // Error message is different in some browsers:
  // Chrome: Failed to fetch dynamically imported module
  // Firefox/Safari: error loading dynamically imported module
  if (e instanceof Error && e.message.includes("dynamically imported module")) {
    window.location.reload();
  } else {
    throw e;
  }
}
