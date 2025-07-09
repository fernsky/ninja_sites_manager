import { ModeToggle } from "@/components/mode-toggle";
import { UserNav } from "@/components/admin-panel/user-nav";
import { SheetMenu } from "@/components/admin-panel/sheet-menu";

interface NavbarProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function Navbar({ title, subtitle, actions }: NavbarProps) {
  return (
    <div className="sticky top-0  w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-[10]">
      <div className="mx-4 flex h-14 items-center justify-between sm:mx-8">
        <div className="flex items-center space-x-4">
          <SheetMenu />
          <div>
            <h1 className="font-semibold">{title}</h1>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {actions && (
            <div className="hidden sm:flex items-center gap-2">{actions}</div>
          )}
          <ModeToggle />
          <UserNav />
        </div>
      </div>

      {/* Mobile Actions Bar */}
      {actions && (
        <div className="sm:hidden border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 py-2">
          <div className="flex items-center gap-2 justify-end">{actions}</div>
        </div>
      )}
    </div>
  );
}
