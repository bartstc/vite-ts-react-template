import { type LucideIcon, type LucideProps } from "lucide-react";

export interface IconProps extends Omit<LucideProps, "ref"> {
  icon: LucideIcon;
  size?: string | number;
}

const Icon = ({ icon: IconComponent, size = 20, ...props }: IconProps) => {
  const numSize = typeof size === "string" ? parseInt(size, 10) : size;
  return <IconComponent size={numSize} {...props} />;
};

export { Icon };
