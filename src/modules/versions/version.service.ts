import { ClientSession } from "mongoose";
import { TVersion } from "./version.interface";
import { Version } from "./version.model";

const createAVersion = async (
  version: Partial<TVersion>,
  options?: { session?: ClientSession },
) => {
  try {
    const result = await Version.create([version], {
      session: options?.session,
    });
    return result[0];
  } catch (error: any) {
    console.error("CreateAVersion error:", error);
    throw new Error(error.message || "Error while creating a new version");
  }
}

export const VersionService = { createAVersion };
