import RequestedAreas from "@/components/area/area-requests";
import HandleActions from "@/components/area/area-action-handler";
import { AreaList } from "@/components/dashboard/area-list";

const tabs = [
  { component: <AreaList /> },
  { component: <RequestedAreas /> },
  { component: <HandleActions /> },
];

export const AreaTabs = ({ activeTab }: { activeTab: number }) => {
  return <div>{tabs[activeTab].component}</div>;
};
