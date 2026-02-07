export interface NavItem {
  label: string;
  subLabel?: string;
  children?: NavItem[];
  href?: string;
}
