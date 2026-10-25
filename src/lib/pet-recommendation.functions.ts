import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { petProfileSchema } from "./pet-profile";

export const recommendPetCare = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => petProfileSchema.parse(input))
  .handler(async ({ data }) => {
    const { suggestPetCare } = await import("./pet-recommendation.server");
    return suggestPetCare(data, getRequest());
  });