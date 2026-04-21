// eslint-disable-next-line boundaries/dependencies
import { useAuthStore } from "@/features/auth/application/auth-store";
import { generatePath } from "@/lib/router";
import { routes } from "@/lib/router/routes";

import type { NavItem } from "./nav-item";

export const useNavItems = () => {
  const isAuthenticated = useAuthStore((store) => store.isAuthenticated);
  const cartId = useAuthStore((store) => store.user?.cartId);

  const cartItem: NavItem = {
    label: "Cart",
    href: cartId ? generatePath(routes.cart, { cartId }) : routes.cart,
  };

  const navItems: NavItem[] = [...BASE_NAV_ITEMS, cartItem];

  return isAuthenticated ? navItems : navItems.slice(0, navItems.length - 1);
};

// todo: translations
const BASE_NAV_ITEMS: NavItem[] = [
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
      {
        label: "Tailwind UI",
        subLabel: "Prebuilt e-commerce components",
        href: "https://tailwindui.com/components#product-ecommerce",
      },
    ],
  },
  {
    label: "Demo Providers",
    children: [
      {
        label: "Vite.js",
        subLabel: "Next generation Frontend Tooling",
        href: "https://vitejs.dev/",
      },
    ],
  },
  {
    label: "Our Products",
    href: "/products",
  },
];
