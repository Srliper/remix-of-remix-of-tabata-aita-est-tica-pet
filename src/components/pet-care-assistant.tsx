import { useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Sparkles, LoaderCircle, MessageCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { recommendPetCare } from "@/lib/pet-recommendation.functions";
import { petProfileSchema, type PetProfile, type PetRecommendation } from "@/lib/pet-profile";

export function PetCareAssistant() {
  const [profile, setProfile] = useState<PetProfile>({ pet: "", tipo: "Cachorro", porte: "Pequeno", pelagem: "Curta", necessidades: "", preferencias: "" });
  const [result, setResult] = useState<PetRecommendation | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const suggest = useServerFn(recommendPetCare);
  const field = "mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary";
  const update = (key: keyof PetProfile, value: string) => { setProfile((p) => ({ ...p, [key]: value })); setResult(null); setError(""); };
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (loading) return;
    if (!petProfileSchema.safeParse(profile).success) { setError("Descreva as necessidades do pet com pelo menos 10 caracteres."); return; }
    setLoading(true); setResult(null); setError("");
    try {
      const response = await suggest({ data: profile });
      setResult(response.recommendation ?? null); setError(response.error ?? "");
    } catch { setError("Não foi possível obter a sugestão. Seus dados foram mantidos."); }
    finally { setLoading(false); }
  }
  const message = result ? `Olá, Tabata! Gostaria de conversar sobre os cuidados do meu pet.\nPet: ${profile.pet || "Não informado"} (${profile.tipo})\nPorte: ${profile.porte}\nPelagem: ${profile.pelagem}\nNecessidades: ${profile.necessidades}\nPreferências: ${profile.preferencias || "Não informadas"}\nSugestão de IA: ${result.servico}\n${result.motivo}\nCuidados: ${result.cuidados.join("; ")}\n${result.alerta || ""}\nPodemos marcar um horário de terça a sábado?` : "";
  return <section id="cuidados" className="scroll-mt-24 border-y border-border bg-accent/15 py-16">
    <div className="mx-auto max-w-6xl px-6">
      <p className="flex items-center gap-2 text-sm font-bold uppercase text-primary"><Sparkles size={18} /> Cuidados personalizados · IA</p>
      <h2 className="mt-3 font-display text-3xl font-extrabold md:text-4xl">Um cuidado do jeitinho do seu pet</h2>
      <div className="mt-8 grid gap-10 md:grid-cols-2">
        <form onSubmit={submit} className="space-y-5">
          <fieldset disabled={loading} className="space-y-5 disabled:opacity-60">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold">Nome do pet<input className={field} value={profile.pet} maxLength={80} onChange={(e) => update("pet", e.target.value)} /></label>
              <label className="text-sm font-semibold">Tipo de pet<select className={field} value={profile.tipo} onChange={(e) => update("tipo", e.target.value)}><option>Cachorro</option><option>Gato</option></select></label>
              <label className="text-sm font-semibold">Porte<select className={field} value={profile.porte} onChange={(e) => update("porte", e.target.value)}>{["Pequeno", "Médio", "Grande"].map((x) => <option key={x}>{x}</option>)}</select></label>
              <label className="text-sm font-semibold">Pelagem<select className={field} value={profile.pelagem} onChange={(e) => update("pelagem", e.target.value)}>{["Curta", "Longa", "Cacheada", "Dupla", "Sem pelos"].map((x) => <option key={x}>{x}</option>)}</select></label>
            </div>
            <label className="block text-sm font-semibold">Necessidades do pet<textarea required minLength={10} maxLength={2000} rows={4} className={field} placeholder="Ex.: pelos com nós, unhas compridas, fica ansioso no banho…" value={profile.necessidades} onChange={(e) => update("necessidades", e.target.value)} /></label>
            <label className="block text-sm font-semibold">Preferências e sensibilidades<textarea maxLength={1000} rows={3} className={field} placeholder="Ex.: sem perfume, manter o pelo longo, pele sensível…" value={profile.preferencias} onChange={(e) => update("preferencias", e.target.value)} /></label>
          </fieldset>
          <Button disabled={loading} type="submit" className="h-auto min-h-12 w-full whitespace-normal py-3 font-bold">{loading ? <LoaderCircle className="animate-spin motion-reduce:animate-none" /> : <Sparkles />}{loading ? "Preparando os cuidados…" : "Sugerir serviço e cuidados"}</Button>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        </form>
        <div className="min-w-0 border-t border-border pt-6 md:border-l md:border-t-0 md:pl-8 md:pt-0" aria-live="polite" aria-busy={loading}>
          {result ? <div className="space-y-5 break-words">
            <p className="text-sm font-semibold text-primary">Serviço sugerido</p><h3 className="font-display text-3xl font-bold">{result.servico}</h3><p>{result.motivo}</p>
            <h4 className="font-bold">Cuidados para seu pet</h4><ul className="list-disc space-y-3 pl-5 text-muted-foreground">{result.cuidados.map((care, i) => <li key={i}>{care}</li>)}</ul>
            {result.alerta && <p className="border-l-4 border-primary bg-secondary p-4 text-sm">{result.alerta}</p>}
            <Button asChild className="h-auto min-h-12 whitespace-normal py-3"><a target="_blank" rel="noopener noreferrer" href={`https://wa.me/5515981183740?text=${encodeURIComponent(message)}`}><MessageCircle />Conversar com a Tabata</a></Button>
          </div> : <div className="flex min-h-64 flex-col items-start justify-center gap-4"><Sparkles className="text-primary" size={32} /><h3 className="font-display text-2xl font-bold">Cada pet é único</h3><p className="text-muted-foreground">{loading ? "Analisando o perfil do seu pet…" : "Serviço sugerido e cuidados personalizados"}</p></div>}
          <p className="mt-8 flex items-start gap-2 border-t border-border pt-5 text-xs text-muted-foreground"><ShieldCheck size={18} className="shrink-0" />Sugestões de IA não substituem avaliação veterinária. O serviço será confirmado pela Tabata, somente com hora marcada.</p>
        </div>
      </div>
    </div>
  </section>;
}