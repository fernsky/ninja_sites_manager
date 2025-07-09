export interface AreaAction {
  id: string;
  wardNumber: number;
  code: number;
  areaStatus: string;
  assignedTo: {
    id: string;
    name: string;
  } | null;
  geometry: any | null;
  centroid: any | null;
}

export interface BaseAreaProps {
  data: Array<{
    id: string;
    wardNumber: number;
    code: number;
    assignedTo: { id: string; name: string } | null;
    areaStatus?: string;
  }>;
}

export interface ActionHandlerProps extends BaseAreaProps {
  onAction: (
    areaId: string,
    type: string,
    action: "approve" | "reject",
  ) => void;
}
