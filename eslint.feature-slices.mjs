// ESLint rules that enforce feature-slice architecture.
// See docs/architecture.md for the rules this enforces.

import boundaries from "eslint-plugin-boundaries";

const featureLayers = ["components", "application", "providers", "models"];
const subFeatureLayers = [
  "sub-components",
  "sub-application",
  "sub-providers",
  "sub-models",
];

// AIDEV-NOTE: Path patterns map files to element types. Captures (feature, sub)
// flow into rule selectors via {{from.feature}}/{{from.sub}} — they're what
// prevents cross-feature and cross-sub-feature imports without enumerating
// feature lists. Order matters: more specific patterns must come first
// (sub-feature before feature, lib/api before lib).
const elements = [
  { type: "lib-api", pattern: "src/lib/api" },
  { type: "lib", pattern: "src/lib" },

  {
    type: "sub-components",
    pattern: "src/features/*/*/components",
    capture: ["feature", "sub"],
  },
  {
    type: "sub-application",
    pattern: "src/features/*/*/application",
    capture: ["feature", "sub"],
  },
  {
    type: "sub-providers",
    pattern: "src/features/*/*/providers",
    capture: ["feature", "sub"],
  },
  {
    type: "sub-models",
    pattern: "src/features/*/*/models",
    capture: ["feature", "sub"],
  },

  {
    type: "components",
    pattern: "src/features/*/components",
    capture: ["feature"],
  },
  {
    type: "application",
    pattern: "src/features/*/application",
    capture: ["feature"],
  },
  {
    type: "providers",
    pattern: "src/features/*/providers",
    capture: ["feature"],
  },
  {
    type: "models",
    pattern: "src/features/*/models",
    capture: ["feature"],
  },

  { type: "pages", pattern: "src/pages" },
];

// AIDEV-NOTE: auth/authv2 are cross-slice primitives (identity, permissions,
// auth state). Any feature layer may import from them.
const authCrossCut = {
  to: {
    type: featureLayers,
    captured: { feature: ["auth", "authv2"] },
  },
};

const sameFeature = (type) => ({
  to: { type, captured: { feature: "{{from.feature}}" } },
});

const sameSub = (type) => ({
  to: {
    type,
    captured: { feature: "{{from.feature}}", sub: "{{from.sub}}" },
  },
});

const typeRules = [
  {
    from: { type: "components" },
    allow: [
      sameFeature(["application", "providers", "models"]),
      authCrossCut,
      { to: { type: "lib" } },
    ],
  },
  {
    from: { type: "application" },
    allow: [
      sameFeature(["providers", "models"]),
      authCrossCut,
      { to: { type: "lib" } },
    ],
  },
  {
    from: { type: "providers" },
    allow: [
      sameFeature("models"),
      authCrossCut,
      { to: { type: ["lib", "lib-api"] } },
    ],
  },
  {
    from: { type: "models" },
    allow: [authCrossCut, { to: { type: ["lib", "lib-api"] } }],
  },

  {
    from: { type: "sub-components" },
    allow: [
      sameSub(["sub-application", "sub-providers", "sub-models"]),
      sameFeature(featureLayers),
      authCrossCut,
      { to: { type: "lib" } },
    ],
  },
  {
    from: { type: "sub-application" },
    allow: [
      sameSub(["sub-providers", "sub-models"]),
      sameFeature(["application", "providers", "models"]),
      authCrossCut,
      { to: { type: "lib" } },
    ],
  },
  {
    from: { type: "sub-providers" },
    allow: [
      sameSub("sub-models"),
      sameFeature(["providers", "models"]),
      authCrossCut,
      { to: { type: ["lib", "lib-api"] } },
    ],
  },
  {
    from: { type: "sub-models" },
    allow: [
      sameFeature("models"),
      authCrossCut,
      { to: { type: ["lib", "lib-api"] } },
    ],
  },

  {
    from: { type: "pages" },
    allow: [
      { to: { type: [...featureLayers, ...subFeatureLayers, "lib", "pages"] } },
    ],
  },

  {
    from: { type: "lib" },
    allow: [{ to: { type: ["lib", "lib-api"] } }],
  },
  {
    from: { type: "lib-api" },
    allow: [{ to: { type: ["lib", "lib-api"] } }],
  },
];

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
      files: ["src/**/*.{ts,tsx}"],
      plugins: { boundaries },
      settings: {
        "boundaries/elements": elements,
      },
      rules: {
        "boundaries/dependencies": [
          "error",
          { default: "disallow", rules: typeRules },
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
  ];
}
