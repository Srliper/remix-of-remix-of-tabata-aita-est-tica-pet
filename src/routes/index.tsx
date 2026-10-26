import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import hero from "@/assets/hero.jpg";
import cover from "@/assets/pets-cover.jpg";
import bath from "@/assets/pet-bath.jpg";
import grooming from "@/assets/pet-grooming.jpg";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, PawPrint, Menu, X, MessageCircle } from "lucide-react";
import { PetCareAssistant } from "@/components/pet-care-assistant";

const TITLE = "Tabata Aita Estética Pet | Banho e Tosa em São Miguel Arcanjo";
const DESC = "Banho, tosa e cuidados com carinho para seu pet no Jardim Sol Poente, São Miguel Arcanjo - SP.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const ADDRESS = "Rua Olimpio França de Matos, 35 - Jardim Sol Poente, São Miguel Arcanjo - SP, 18232-128";
const WHATSAPP = "5515981183740";
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP}`;
const WHATSAPP_DISPLAY = "(15) 98118-3740";

const HOURS = [
  { day: "Terça a sábado", time: "Somente com hora marcada", open: true },
  { day: "Domingo e segunda", time: "Não abrimos", open: false },
];

const services = [
  { image: bath, icon: "🛁", name: "Banho", desc: "Produtos suaves, secagem cuidadosa e perfume delicado." },
  { image: grooming, icon: "✂️", name: "Tosa", desc: "Tosa higiênica, na máquina ou na tesoura, do jeitinho do seu pet." },
  { image: hero, icon: "💅", name: "Estética", desc: "Hidratação, corte de unhas, limpeza de ouvidos e laços." },
  { image: cover, icon: "🦴", name: "Petshop", desc: "Rações, petiscos, brinquedos e acessórios." },
];

const steps = [
  { icon: "📅", title: "Agende", desc: "Escolha o dia pelo WhatsApp ou pelo formulário aqui do site. A gente confirma rapidinho." },
  { icon: "🛁", title: "Cuidamos", desc: "Seu pet recebe banho, tosa e muito carinho em um ambiente tranquilo." },
  { icon: "💖", title: "Retire feliz", desc: "Você busca um pet cheiroso, lindo e com aquela cara de satisfeito." },
];

const navLinks = [
  { label: "Serviços", href: "#servicos" },
  { label: "Cuidados com IA", href: "#cuidados" },
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Sobre", href: "#sobre" },
  { label: "Agendar", href: "#agendar" },
  { label: "Endereço", href: "#contato" },
];

function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add("is-visible");
            obs.disconnect();
            break;
          }
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${className}`} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>
      {children}
    </div>
  );
}

function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [form, setForm] = useState({ tutor: "", pet: "", tipo: "Cachorro", servico: "Banho", data: "", obs: "" });

  const todayISO = new Date().toISOString().slice(0, 10);
  const dayOfWeek = form.data ? new Date(`${form.data}T12:00:00`).getDay() : -1;
  const closedDay = dayOfWeek === 0 || dayOfWeek === 1;

  const agendar = (e: React.FormEvent) => {
    e.preventDefault();
    if (closedDay) return;
    const msg = `Olá! Gostaria de agendar:\nTutor: ${form.tutor}\nPet: ${form.pet} (${form.tipo})\nServiço: ${form.servico}\nData: ${form.data}${form.obs ? `\nObs: ${form.obs}` : ""}`;
    window.open(`${WHATSAPP_LINK}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const field = "w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary";
  const chip = (active: boolean) =>
    `rounded-full px-4 py-2 text-sm font-semibold border transition ${
      active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:border-primary/50"
    }`;

  return (
    <main className="font-sans">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="#topo" className="font-display text-xl font-extrabold text-primary">🐾 Tabata Aita</a>
          <nav className="hidden gap-6 text-sm font-semibold lg:flex">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="transition-colors hover:text-primary">{l.label}</a>
            ))}
          </nav>
          <a href="#agendar" className="hidden rounded-full bg-gradient-warm px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-soft transition hover:scale-105 lg:block">
            Agendar horário
          </a>
          <Button variant="outline" size="icon"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
            className="rounded-xl border border-border p-2 lg:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X /> : <Menu />}
          </Button>
        </div>
        {menuOpen && (
          <nav className="border-t border-border/60 bg-background px-6 py-4 lg:hidden">
            <div className="flex flex-col gap-1">
              {navLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl px-4 py-3 font-semibold transition-colors hover:bg-secondary"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </nav>
        )}
      </header>

      <section id="topo" className="pet-cover relative isolate overflow-hidden bg-cover-base text-cover-foreground">
        <img src={cover} alt="Cachorro e gato em retrato ilustrativo da estética pet" width={1536} height={1024} fetchPriority="high" className="absolute inset-0 h-full w-full object-cover object-right" />
        <div className="pet-cover-shade absolute inset-0" />
        <div className="relative mx-auto flex min-h-[570px] max-w-6xl items-center px-6 py-14">
          <div className="pet-cover-copy max-w-lg">
            <p className="mb-6 flex items-center gap-2 text-sm font-bold uppercase"><PawPrint size={18} /> São Miguel Arcanjo · SP</p>
            <h1 className="font-display text-5xl font-extrabold leading-tight md:text-6xl">Tabata Aita<br /><span className="text-cover-accent">Estética Pet</span></h1>
            <p className="mt-5 max-w-sm text-lg leading-relaxed">Banho, tosa e carinho. Um cuidado especial para quem faz parte da sua família.</p>
            <Button asChild size="lg" className="mt-8 h-14 px-7 text-base font-bold"><a href="#agendar">Agendar um cuidado <ArrowUpRight /></a></Button>
            <p className="mt-6 max-w-xs text-sm">Terça a sábado · somente com hora marcada</p>
            <p className="mt-2 text-xs opacity-80">Domingo e segunda não abrimos</p>
          </div>
        </div>
      </section>
      <div className="border-b border-border bg-secondary">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-3 px-6 py-5 text-sm font-semibold"><span>Banho & tosa</span><span>Cuidados personalizados</span><a href="#contato" className="inline-flex items-center gap-2">Jardim Sol Poente <ArrowUpRight size={16} /></a></div>
      </div>

      <section id="servicos" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-16">
        <Reveal>
          <p className="mb-2 text-sm font-bold uppercase tracking-widest text-primary">Serviços</p>
          <h2 className="font-display text-4xl font-extrabold">Nossos serviços</h2>
        </Reveal>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => (
            <Reveal key={s.name} delay={i * 80}>
              <div className="group h-full overflow-hidden rounded-lg border border-border bg-card transition hover:-translate-y-1">
                <img src={s.image} alt={`Imagem ilustrativa de ${s.name.toLowerCase()}`} loading="lazy" width={1024} height={1024} className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-[1.03]" /><div className="p-5">
                <h3 className="mt-4 font-display text-xl font-bold">{s.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p><a href="#agendar" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary">Agendar <ArrowUpRight size={16} /></a></div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <PetCareAssistant />

      <section id="como-funciona" className="bg-secondary scroll-mt-24 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal className="text-center">
            <p className="mb-2 text-sm font-bold uppercase tracking-widest text-primary">Simples assim</p>
            <h2 className="font-display text-4xl font-extrabold">Como funciona</h2>
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {steps.map((st, i) => (
              <Reveal key={st.title} delay={i * 100}>
                <div className="h-full border-t border-border py-7">
                  <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-warm text-2xl">{st.icon}</span>
                    <span className="font-display text-4xl font-extrabold text-primary/20">{i + 1}</span>
                  </div>
                  <h3 className="mt-4 font-display text-xl font-bold">{st.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{st.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="sobre" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-16">
        <Reveal className="text-center">
          <p className="mb-2 text-sm font-bold uppercase tracking-widest text-primary">Quem cuida</p>
          <h2 className="font-display text-4xl font-extrabold">Uma família que ama pets</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Cuidamos de cada pet como se fosse da família. Aqui, ninguém é só mais um banho.
          </p>
        </Reveal>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          <Reveal>
            <div className="flex items-start gap-4 rounded-lg border border-border bg-card p-6">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-warm font-display text-xl font-extrabold text-primary-foreground">T</span>
              <div>
                <h3 className="font-display text-xl font-bold">Tabata Aita</h3>
                <p className="text-sm font-semibold text-primary">Fundadora e dona</p>
                <p className="mt-2 text-sm text-muted-foreground">A mente por trás da estética pet: é ela que deixa cada pet lindo, cheiroso e tranquilo.</p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="flex items-start gap-4 rounded-lg border border-border bg-card p-6">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-secondary font-display text-xl font-extrabold text-primary">E</span>
              <div>
                <h3 className="font-display text-xl font-bold">Emerson</h3>
                <p className="text-sm font-semibold text-primary">Apoio do dia a dia</p>
                <p className="mt-2 text-sm text-muted-foreground">Esposo da Tabata e parceiro de todas as horas: ajuda a manter tudo funcionando com carinho.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="agendar" className="scroll-mt-24 bg-secondary py-16">
        <div className="mx-auto max-w-xl px-6">
          <Reveal className="text-center">
            <p className="mb-2 text-sm font-bold uppercase tracking-widest text-primary">Agendamento</p>
            <h2 className="font-display text-4xl font-extrabold">Agende pelo WhatsApp</h2>
            <p className="mt-3 text-muted-foreground">
              Preencha os dados e a mensagem vai prontinha para o nosso WhatsApp {WHATSAPP_DISPLAY}.
            </p>
            <p className="mt-2 text-sm font-semibold text-primary">Terça a sábado, somente com hora marcada</p>
          </Reveal>
          <Reveal delay={100}>
            <form onSubmit={agendar} className="mt-8 space-y-4 rounded-lg border border-border bg-card p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <input required placeholder="Seu nome" className={field} value={form.tutor} onChange={(e) => setForm({ ...form, tutor: e.target.value })} />
                <input required placeholder="Nome do pet" className={field} value={form.pet} onChange={(e) => setForm({ ...form, pet: e.target.value })} />
              </div>
              <div>
                <p className="mb-2 text-sm font-semibold">Seu pet é:</p>
                <div className="flex gap-2">
                  {["Cachorro", "Gato"].map((t) => (
                    <Button key={t} type="button" onClick={() => setForm({ ...form, tipo: t })} className={chip(form.tipo === t)}>{t}</Button>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-sm font-semibold">Serviço:</p>
                <div className="flex flex-wrap gap-2">
                  {["Banho", "Tosa", "Banho e Tosa", "Estética"].map((s) => (
                    <Button key={s} type="button" onClick={() => setForm({ ...form, servico: s })} className={chip(form.servico === s)}>{s}</Button>
                  ))}
                </div>
              </div>
              <input
                required
                type="date"
                min={todayISO}
                className={field}
                value={form.data}
                onChange={(e) => setForm({ ...form, data: e.target.value })}
                aria-label="Data do agendamento"
              />
              {closedDay && (
                <p className="rounded-xl bg-primary/10 px-4 py-3 text-sm font-semibold text-primary">
                  Domingo e segunda não abrimos. Escolha um dia de terça a sábado. 🐾
                </p>
              )}
              <textarea placeholder="Observações (opcional)" rows={3} className={field} value={form.obs} onChange={(e) => setForm({ ...form, obs: e.target.value })} />
              <Button
                disabled={closedDay}
                className="w-full rounded-full bg-gradient-warm py-4 font-bold text-primary-foreground shadow-soft transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <MessageCircle size={18} /> Enviar pedido
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Atendemos de terça a sábado, somente com hora marcada.<br />
                Domingo e segunda não abrimos.
              </p>
            </form>
          </Reveal>
        </div>
      </section>

      <section id="contato" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-16">
        <Reveal>
          <div className="grid overflow-hidden border-y border-border md:grid-cols-2">
            <div className="p-8">
              <p className="mb-2 text-sm font-bold uppercase tracking-widest text-primary">Visite-nos</p>
              <h2 className="font-display text-3xl font-extrabold">Venha nos visitar</h2>
              <p className="mt-4">📍 Rua Olimpio França de Matos, 35<br />Jardim Sol Poente<br />São Miguel Arcanjo - SP<br />CEP 18232-128</p>
              <div className="mt-6 rounded-2xl bg-secondary p-5">
                <p className="text-sm font-bold uppercase tracking-widest text-primary">Horários</p>
                <ul className="mt-3 space-y-2 text-sm">
                  {HOURS.map((h) => (
                    <li key={h.day} className="flex items-center justify-between gap-4">
                      <span className="font-semibold">{h.day}</span>
                      <span className={h.open ? "font-semibold text-primary" : "font-semibold text-muted-foreground"}>{h.time}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={`${WHATSAPP_LINK}?text=${encodeURIComponent("Olá! Gostaria de agendar um horário para meu pet 🐾")}`}
                  className="rounded-full bg-gradient-warm px-6 py-3 text-sm font-bold text-primary-foreground shadow-soft transition hover:scale-105"
                >
                  WhatsApp {WHATSAPP_DISPLAY}
                </a>
                <a target="_blank" rel="noreferrer" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`} className="font-bold text-primary underline">
                  Abrir no Google Maps
                </a>
              </div>
            </div>
            <iframe title="Mapa" className="h-72 w-full md:h-full" loading="lazy" src={`https://www.google.com/maps?q=${encodeURIComponent(ADDRESS)}&output=embed`} />
          </div>
        </Reveal>
      </section>

      <footer className="border-t border-border/60 py-10 text-center">
        <p className="font-display text-lg font-extrabold text-primary">🐾 Tabata Aita Estética Pet</p>
        <nav className="mt-3 flex flex-wrap justify-center gap-4 text-sm font-semibold">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="text-muted-foreground transition-colors hover:text-primary">{l.label}</a>
          ))}
        </nav>
        <p className="mt-4 text-sm font-semibold text-primary">WhatsApp {WHATSAPP_DISPLAY}</p>
        <p className="mt-1 text-sm text-muted-foreground">Terça a sábado, somente com hora marcada · Domingo e segunda não abrimos</p>
        <p className="mt-4 text-sm text-muted-foreground">© {new Date().getFullYear()} Tabata Aita Estética Pet · São Miguel Arcanjo - SP</p>
      </footer>

      <a
        href={`${WHATSAPP_LINK}?text=${encodeURIComponent("Olá! Gostaria de agendar um horário para meu pet 🐾")}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Agendar pelo WhatsApp"
        className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-warm text-2xl shadow-soft transition hover:scale-110"
      >
        🐾
      </a>
    </main>
  );
}
