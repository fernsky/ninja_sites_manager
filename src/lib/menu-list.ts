import { PaperPlaneIcon, PersonIcon, QuestionMarkIcon } from "@radix-ui/react-icons";
import {
  LayoutGrid,
  LucideIcon,
  LandPlot,
  UsersRound,
  AreaChart,
  FormInput,
  GitPullRequest,
  Building2,
  ScanBarcode,
  Store,
  User2Icon,
  Paperclip,
  Home,
  PersonStanding,
  Cloud,
  Gauge,
  PlusCircle,
  Clock,
  Send,
  Computer,
  Check
} from "lucide-react";
import { Form } from "react-hook-form";

export type Role = "admin" | "superadmin" | "enumerator";

type Submenu = {
  href: string;
  label: string;
  active?: boolean;
  roles?: Role[];
};

type Menu = {
  href: string;
  label: string;
  active?: boolean;
  icon: LucideIcon;
  roles?: Role[];
  submenus?: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

const menuConfig: Menu[] = [
  {
    href: "/",
    label: "Home",
    icon: LayoutGrid,
    roles: ["admin", "superadmin", "enumerator"],
  },
  {
    href: "/site",
    label: "Sites",
    icon: Computer,
    roles: ["admin", "superadmin"],
    submenus: [],
  },
  {
    href: "/issues",
    label: "Issues",
    icon: QuestionMarkIcon,
    roles: ["admin", "superadmin"],
    submenus: [],
  },
  {
    href: "/buildings",
    label: "Solutions",
    icon: Check,
    roles: ["admin", "superadmin"],
  },
  // {
  //   href: "/businesses",
  //   label: "Businesses",
  //   icon: Store,
  //   roles: ["admin", "superadmin"],
  // },
  // {
  //   href: "/families",
  //   label: "Families",
  //   icon: UsersRound,
  //   roles: ["admin", "superadmin"],
  // },
  // {
  //   href: "/submissions",
  //   label: "Submitted Data",
  //   icon: Paperclip,
  //   roles: ["admin", "superadmin", "enumerator"],
  //   submenus: [],
  // },

  // {
  //   href: "/deaths",
  //   label: "Deaths",
  //   icon: GitPullRequest,
  //   roles: ["admin", "superadmin"],
  // },
  // {
  //   href: "/enumerators",
  //   label: "Enumerators",
  //   icon: UsersRound,
  //   roles: ["admin", "superadmin"],
  //   submenus: [],
  // },
];

export function getMenuList(pathname: string, userRole: Role): Group[] {
  const filteredMenus = menuConfig.filter(
    (menu) => !menu.roles || menu.roles.includes(userRole),
  );

  return [
    {
      groupLabel: "",
      menus: filteredMenus,
    },
  ];
}
