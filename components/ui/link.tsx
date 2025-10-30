"use client";
import { useLoader } from "@/contexts/loader-context";
import NextLink, { LinkProps as NextLinkProps } from "next/link";

type LinkProps = React.PropsWithChildren<NextLinkProps & { className?: string }>;

const Link: React.FC<LinkProps & { children: React.ReactNode }> = ({ children, ...props }) => {
  const { setLoading } = useLoader();

  const handleClick = () => {
    setLoading(true);
  };

  return (
    <NextLink {...props} onClick={handleClick}>
      {children}
    </NextLink>
  );
};

export default Link;
