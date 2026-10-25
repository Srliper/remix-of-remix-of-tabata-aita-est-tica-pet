import { describe, it, expect } from "vitest";
import { petProfileSchema, recommendationSchema } from "@/lib/pet-profile";

describe("Pet recommendations", () => {
  const profile = { pet: "Mel", tipo: "Cachorro", porte: "Grande", pelagem: "Dupla", necessidades: "Pelos com nós", preferencias: "Sem perfume" };
  it("accepts size, coat, needs and preferences together", () => {
    expect(petProfileSchema.parse(profile)).toEqual(profile);
  });
  it("rejects a request without described needs", () => {
    expect(petProfileSchema.safeParse({ ...profile, necessidades: "" }).success).toBe(false);
  });
  it("rejects recommendations for services outside the catalog or veterinary referral", () => {
    expect(recommendationSchema.safeParse({ servico: "Cirurgia", motivo: "Teste", cuidados: [], alerta: null }).success).toBe(false);
  });
});