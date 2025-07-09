import Link from "next/link";
import { UserDropdown } from "./user-dropdown";
import { validateRequest } from "@/lib/auth/validate-request";

export const Header = async () => {
  const { user } = await validateRequest();

  return (
    <header className="sticky top-0 z-10 border-b bg-background py-2">
      <div className="container flex items-center gap-2 px-2 py-2 lg:px-4">
        <Link
          className="flex items-center justify-center text-xl font-medium"
          href="/"
        >
          Dashboard
        </Link>
        {user ? (
          <UserDropdown email={user.userName} className="ml-auto" />
        ) : null}
      </div>
    </header>
  );
};
