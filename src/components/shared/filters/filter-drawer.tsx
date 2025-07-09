import { Drawer } from "vaul";
import { Button } from "@/components/ui/button";
import { FilterIcon, X } from "lucide-react";

interface FilterDrawerProps {
  title: string;
  children: React.ReactNode;
}

export function FilterDrawer({ title, children }: FilterDrawerProps) {
  return (
    <Drawer.Root>
      <Drawer.Trigger asChild>
        <Button variant="outline" size="sm" className="lg:hidden">
          <FilterIcon className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 mt-24 flex h-[90%] flex-col rounded-t-lg bg-white">
          <div className="flex-1 overflow-y-auto rounded-t-lg bg-white p-4">
            <div className="flex items-center justify-between pb-4">
              <Drawer.Title className="text-lg font-semibold">
                {title}
              </Drawer.Title>
              <Drawer.Close asChild>
                <Button variant="ghost" size="icon">
                  <X className="h-4 w-4" />
                </Button>
              </Drawer.Close>
            </div>
            {children}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
