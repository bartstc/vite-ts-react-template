import { INavItem } from "./INavItem";

// todo: translations
export const NAV_ITEMS: Array<INavItem> = [
  {
    label: "Inspiration",
    children: [
      {
        label: "Explore Choc UI",
        subLabel: "Set of prebuilt components",
        href: "https://choc-ui.com/",
      },
      {
        label: "Explore Chakra UI Templates",
        subLabel: "Set of opensource prebuilt components",
        href: "https://chakra-templates.dev/",
      },
    ],
  },
  {
    label: "Demo Providers",
    children: [
      {
        label: "Vercel Next.js",
        subLabel: "The React framework for production",
        href: "https://nextjs.org/",
      },
      {
        label: "Fake Store API",
        subLabel: "Free rest API for e-commerce",
        href: "https://fakestoreapi.com/",
      },
    ],
  },
  {
    label: "Our Products",
    href: "/products",
  },
  {
    label: "Cart",
    href: "/cart",
  },
];
