import { createTRPCRouter } from "@/server/api/trpc";
import { enumeratorIdCardProcedures } from "./procedures/idCard";
import { enumeratorPhotoProcedures } from "./procedures/photo";
import { enumeratorFormPhotoProcedures } from "./procedures/formPhoto";

export const enumeratorRouter = createTRPCRouter({
  ...enumeratorIdCardProcedures,
  ...enumeratorPhotoProcedures,
  ...enumeratorFormPhotoProcedures,
});