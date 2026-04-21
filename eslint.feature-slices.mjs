// ESLint rules that enforce feature-slice architecture.
// See docs/architecture.md for the architectural rules this enforces.

// AIDEV-NOTE: import/no-restricted-paths uses path.relative() for matching — glob wildcards
// in target/from are NOT supported. All zone lists must be generated per-feature.
const featureSlices = ["carts", "marketing", "products"];
const allFeatureSlices = [
  "auth",
  "authv2",
  "carts",
  "demo",
  "marketing",
  "products",
];

// AIDEV-NOTE: sub-feature slices nested under a parent feature.
// Keys are parent feature names; values are arrays of sub-feature slice names.
const subFeatureSlices = {
  marketing: ["rating"],
};

// AIDEV-NOTE: `auth` and `authv2` are cross-slice primitives (identity, permissions,
// auth state). Any feature may import from them. See docs/architecture.md
const featureToFeatureZones = featureSlices.map((feature) => ({
  target: `./src/features/${feature}`,
  from: "./src/features",
  except: [`./${feature}`, "./auth", "./authv2"],
  message: "Avoid importing from other features.",
}));

const featureLayerZones = allFeatureSlices.flatMap((feature) => [
  // application/ ← components/ (forbidden)
  {
    target: `./src/features/${feature}/application`,
    from: `./src/features/${feature}/components`,
    message: "application/ must not depend on components/.",
  },
  // providers/ ← application/ or components/ (forbidden)
  {
    target: `./src/features/${feature}/providers`,
    from: `./src/features/${feature}/application`,
    message: "providers/ must not depend on application/.",
  },
  {
    target: `./src/features/${feature}/providers`,
    from: `./src/features/${feature}/components`,
    message: "providers/ must not depend on components/.",
  },
  // models/ ← any feature layer (forbidden)
  {
    target: `./src/features/${feature}/models`,
    from: `./src/features/${feature}/application`,
    message: "models/ must not depend on application/.",
  },
  {
    target: `./src/features/${feature}/models`,
    from: `./src/features/${feature}/components`,
    message: "models/ must not depend on components/.",
  },
  {
    target: `./src/features/${feature}/models`,
    from: `./src/features/${feature}/providers`,
    message: "models/ must not depend on providers/.",
  },
]);

// Prevents lib/api/ from leaking beyond providers/ and models/.
const apiLayerIsolationZones = allFeatureSlices.flatMap((feature) => [
  {
    target: `./src/features/${feature}/components`,
    from: "./src/lib/api",
    message:
      "src/lib/api/ must not be imported in components/. Use providers/ for data queries and mutations and models/ for types.",
  },
  {
    target: `./src/features/${feature}/application`,
    from: "./src/lib/api",
    message:
      "src/lib/api/ must not be imported in application/. Use providers/ for data queries and mutations and models/ for types.",
  },
]);

const subFeatureLayerZones = Object.entries(subFeatureSlices).flatMap(
  ([feature, subFeatures]) =>
    subFeatures.flatMap((sub) => [
      {
        target: `./src/features/${feature}/${sub}/application`,
        from: `./src/features/${feature}/${sub}/components`,
        message: "application/ must not depend on components/.",
      },
      {
        target: `./src/features/${feature}/${sub}/providers`,
        from: `./src/features/${feature}/${sub}/application`,
        message: "providers/ must not depend on application/.",
      },
      {
        target: `./src/features/${feature}/${sub}/providers`,
        from: `./src/features/${feature}/${sub}/components`,
        message: "providers/ must not depend on components/.",
      },
      {
        target: `./src/features/${feature}/${sub}/models`,
        from: `./src/features/${feature}/${sub}/application`,
        message: "models/ must not depend on application/.",
      },
      {
        target: `./src/features/${feature}/${sub}/models`,
        from: `./src/features/${feature}/${sub}/components`,
        message: "models/ must not depend on components/.",
      },
      {
        target: `./src/features/${feature}/${sub}/models`,
        from: `./src/features/${feature}/${sub}/providers`,
        message: "models/ must not depend on providers/.",
      },
    ])
);

// AIDEV-NOTE: each sub-feature may import from its parent's same/lower layers,
// but must not import from sibling sub-feature slices.
const subFeatureSiblingZones = Object.entries(subFeatureSlices).flatMap(
  ([feature, subFeatures]) =>
    subFeatures.map((sub) => ({
      target: `./src/features/${feature}/${sub}`,
      from: `./src/features/${feature}`,
      except: [
        `./${sub}`,
        "./components",
        "./application",
        "./providers",
        "./models",
      ],
      message:
        "Sub-feature slices may not import from sibling sub-feature slices.",
    }))
);

const subFeatureApiIsolationZones = Object.entries(subFeatureSlices).flatMap(
  ([feature, subFeatures]) =>
    subFeatures.flatMap((sub) => [
      {
        target: `./src/features/${feature}/${sub}/components`,
        from: "./src/lib/api",
        message:
          "src/lib/api/ must not be imported in components/. Use providers/ for data queries and mutations and models/ for types.",
      },
      {
        target: `./src/features/${feature}/${sub}/application`,
        from: "./src/lib/api",
        message:
          "src/lib/api/ must not be imported in application/. Use providers/ for data queries and mutations and models/ for types.",
      },
    ])
);

const reactQueryHooksRestriction = {
  name: "@tanstack/react-query",
  importNames: [
    "useQuery",
    "useMutation",
    "useSuspenseQuery",
    "useQueries",
    "useSuspenseQueries",
    "useQueryClient",
  ],
  message: "React Query hooks belong in providers/, not here.",
};

export function featureSliceConfig({ baseNoRestrictedImports }) {
  return [
    {
      files: ["./src/features/**"],
      rules: {
        "import/no-restricted-paths": [
          "error",
          {
            zones: [
              ...featureToFeatureZones,
              ...featureLayerZones,
              ...apiLayerIsolationZones,
              ...subFeatureLayerZones,
              ...subFeatureSiblingZones,
              ...subFeatureApiIsolationZones,
            ],
          },
        ],
      },
    },
    {
      files: [
        "./src/features/*/components/**",
        "./src/features/*/application/**",
        "./src/features/*/*/components/**",
        "./src/features/*/*/application/**",
      ],
      rules: {
        "no-restricted-imports": [
          "error",
          {
            ...baseNoRestrictedImports,
            paths: [
              ...baseNoRestrictedImports.paths,
              reactQueryHooksRestriction,
            ],
          },
        ],
      },
    },
    {
      files: ["./src/pages/**"],
      rules: {
        "import/no-restricted-paths": [
          "error",
          {
            zones: [
              {
                target: "./src/pages",
                from: "./src/lib/api",
                message:
                  "src/lib/api/ must not be imported in pages/. Use features/*/providers/ for data and features/*/models/ for types.",
              },
            ],
          },
        ],
      },
    },
    {
      files: ["./src/lib/**"],
      rules: {
        "import/no-restricted-paths": [
          "error",
          {
            zones: [
              {
                target: "./src/lib",
                from: "./src/features",
                message: "Lib should not depend on features.",
              },
            ],
          },
        ],
      },
    },
  ];
}
