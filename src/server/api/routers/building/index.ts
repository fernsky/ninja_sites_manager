import { createTRPCRouter } from "@/server/api/trpc";
import { assignWardUpdate } from "./procedures/assignWard";
// ...existing imports...

export const buildingRouter = createTRPCRouter({
  // ...existing routes...
  assignWardUpdate,
});
