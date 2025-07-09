import { RawFamily } from "./types";
import { jsonToPostgres } from "@/lib/utils";
import { sql } from "drizzle-orm";

export async function parseCrops(r: RawFamily, ctx: any) {
  // Parse and insert crops
  if (r.agri?.food) {
    // Food crops
    if (r.agri.food.fcrop_details && r.agri.food.fcrop_details.length > 0) {
      for (const i of r.agri.food.fcrop_details) {
        const crop = {
          id: i.__id,
          family_id: r.__id,
          ward_no: r.id.ward_no,
          crop_type: "food",
          crop_name: i.fcrop,
          crop_area:
            (i.fcrop_area_description.fcrop_bigha ?? 0) * 6772.63 +
            (i.fcrop_area_description.fcrop_kattha ?? 0) * 338.63 +
            (i.fcrop_area_description.fcrop_dhur ?? 0) * 16.93,
          crop_production: i.fp.fcrop_prod,
        };

        try {
          const cropStatement = jsonToPostgres(
            "staging_Kerabari_crop",
            crop,
          );
          if (cropStatement) {
            await ctx.db.execute(sql.raw(cropStatement));
          }
        } catch (error) {
          console.error(`Error inserting food crop:`, error);
        }
      }
    }

    // Pulses
    if (r.agri.food.pulse_details && r.agri.food.pulse_details.length > 0) {
      for (const i of r.agri.food.pulse_details) {
        const crop = {
          id: i.__id,
          family_id: r.__id,
          ward_no: r.id.ward_no,
          crop_type: "pulse",
          crop_name: i.pulse,
          crop_area:
            (i.pulse_area_description.pulse_bigha ?? 0) * 6772.63 +
            (i.pulse_area_description.pulse_kattha ?? 0) * 338.63 +
            (i.pulse_area_description.pulse_dhur ?? 0) * 16.93,
          crop_production: i.pp.pulse_prod,
        };

        try {
          const cropStatement = jsonToPostgres(
            "staging_Kerabari_crop",
            crop,
          );
          if (cropStatement) {
            await ctx.db.execute(sql.raw(cropStatement));
          }
        } catch (error) {
          console.error(`Error inserting pulse crop:`, error);
        }
      }
    }

    // Vegetables
    if (r.agri.food.vtable_details && r.agri.food.vtable_details.length > 0) {
      for (const i of r.agri.food.vtable_details) {
        const crop = {
          id: i.__id,
          family_id: r.__id,
          ward_no: r.id.ward_no,
          crop_type: "vegetable",
          crop_name: i.vtable,
          crop_area:
            (i.vtables_area_description.vtables_bigha ?? 0) * 6772.63 +
            (i.vtables_area_description.vtables_kattha ?? 0) * 338.63 +
            (i.vtables_area_description.vtables_dhur ?? 0) * 16.93,
          crop_production: i.vp.vtable_prod,
        };

        try {
          const cropStatement = jsonToPostgres(
            "staging_Kerabari_crop",
            crop,
          );
          if (cropStatement) {
            await ctx.db.execute(sql.raw(cropStatement));
          }
        } catch (error) {
          console.error(`Error inserting vegetable crop:`, error);
        }
      }
    }
  }

  // Oil seeds
  if (r.agri.food.oseed_details && r.agri.food.oseed_details.length > 0) {
    for (const i of r.agri.food.oseed_details) {
      const crop = {
        id: i.__id,
        family_id: r.__id,
        ward_no: r.id.ward_no,
        crop_type: "oilseed",
        crop_name: i.oseed,
        crop_area:
          (i.oseed_area_description.oseed_bigha ?? 0) * 6772.63 +
          (i.oseed_area_description.oseed_kattha ?? 0) * 338.63 +
          (i.oseed_area_description.oseed_dhur ?? 0) * 16.93,
        crop_production: i.oslp.oseed_prod,
      };

      try {
        const cropStatement = jsonToPostgres("staging_Kerabari_crop", crop);
        if (cropStatement) {
          await ctx.db.execute(sql.raw(cropStatement));
        }
      } catch (error) {
        console.error(`Error inserting oilseed crop:`, error);
      }
    }
  }

  // Fruits
  if (r.agri.food.fruit_details && r.agri.food.fruit_details.length > 0) {
    for (const i of r.agri.food.fruit_details) {
      const crop = {
        id: i.__id,
        family_id: r.__id,
        ward_no: r.id.ward_no,
        crop_type: "fruit",
        crop_name: i.fruit,
        crop_area:
          (i.fruits_area_description.fruits_bigha ?? 0) * 6772.63 +
          (i.fruits_area_description.fruits_kattha ?? 0) * 338.63 +
          (i.fruits_area_description.fruits_dhur ?? 0) * 16.93,
        crop_production: i.frp.fruit_prod,
      };

      try {
        const cropStatement = jsonToPostgres("staging_Kerabari_crop", crop);
        if (cropStatement) {
          await ctx.db.execute(sql.raw(cropStatement));
        }
      } catch (error) {
        console.error(`Error inserting fruit crop:`, error);
      }
    }
  }

  // Spices
  if (r.agri.food.spice_details && r.agri.food.spice_details.length > 0) {
    for (const i of r.agri.food.spice_details) {
      const crop = {
        id: i.__id,
        family_id: r.__id,
        ward_no: r.id.ward_no,
        crop_type: "spice",
        crop_name: i.spice,
        crop_area:
          (i.spice_area_description.spice_bigha ?? 0) * 6772.63 +
          (i.spice_area_description.spice_kattha ?? 0) * 338.63 +
          (i.spice_area_description.spice_dhur ?? 0) * 16.93,
        crop_production: i.sp.spice_prod,
      };

      try {
        const cropStatement = jsonToPostgres("staging_Kerabari_crop", crop);
        if (cropStatement) {
          await ctx.db.execute(sql.raw(cropStatement));
        }
      } catch (error) {
        console.error(`Error inserting spice crop:`, error);
      }
    }
  }

  // Cash crops
  if (r.agri.food.ccrop_details && r.agri.food.ccrop_details.length > 0) {
    for (const i of r.agri.food.ccrop_details) {
      const crop = {
        id: i.__id,
        family_id: r.__id,
        ward_no: r.id.ward_no,
        crop_type: "cash",
        crop_name: i.ccrop,
        crop_area:
          (i.ccrop_area_description.ccrop_bigha ?? 0) * 6772.63 +
          (i.ccrop_area_description.ccrop_kattha ?? 0) * 338.63 +
          (i.ccrop_area_description.ccrop_dhur ?? 0) * 16.93,
        crop_production: i.cp.ccrop_prod,
      };

      try {
        const cropStatement = jsonToPostgres("staging_Kerabari_crop", crop);
        if (cropStatement) {
          await ctx.db.execute(sql.raw(cropStatement));
        }
      } catch (error) {
        console.error(`Error inserting cash crop:`, error);
      }
    }
  }
}
