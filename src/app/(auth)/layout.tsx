import type { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return <div className="grid min-h-screen place-items-center">{children}</div>;
};

export default AuthLayout;
