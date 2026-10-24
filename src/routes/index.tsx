import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import hero from "@/assets/hero.jpg";

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

const services = [
  { icon: "🛁", name: "Banho", desc: "Produtos suaves, secagem cuidadosa e perfume delicado." },
  { icon: "✂️", name: "Tosa", desc: "Tosa higiênica, na máquina ou na tesoura, do jeitinho do seu pet." },
  { icon: "💅", name: "Estética", desc: "Hidratação, corte de unhas, limpeza de ouvidos e laços." },
  { icon: "🦴", name: "Petshop", desc: "Rações, petiscos, brinquedos e acessórios." },
];

function Index() {
  const [form, setForm] = useState({ tutor: "", pet: "", servico: "Banho", data: "" });
  const agendar = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `Olá! Gostaria de agendar:\nTutor: ${form.tutor}\nPet: ${form.pet}\nServiço: ${form.servico}\nData: ${form.data}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  };
  const field = "w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary";

  return (
    <main className="font-sans">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <span className="font-display text-xl font-extrabold text-primary">🐾 Tabata Aita</span>
        <nav className="hidden gap-6 text-sm font-semibold sm:flex">
          <a href="#servicos">Serviços</a><a href="#sobre">Sobre</a><a href="#agendar">Agendar</a><a href="#contato">Endereço</a>
        </nav>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-10 md:grid-cols-2">
        <div>
          <p className="mb-3 inline-block rounded-full bg-secondary px-4 py-1 text-sm font-semibold">São Miguel Arcanjo · SP</p>
          <h1 className="font-display text-5xl font-extrabold leading-tight md:text-6xl">
            Tabata Aita <span className="text-primary">Estética Pet</span>
          </h1>
          <p className="mt-5 text-lg text-muted-foreground">Seu melhor amigo cheiroso, lindo e feliz. Banho e tosa feitos com amor e muito cuidado.</p>
          <a href="#agendar" className="mt-8 inline-block rounded-full bg-gradient-warm px-8 py-4 font-bold text-primary-foreground shadow-soft transition hover:scale-105">Agendar horário</a>
        </div>
        <img src={hero} alt="Cachorrinho após banho e tosa" width={1280} height={960} className="rounded-[2rem] shadow-soft" />
      </section>

      <section id="servicos" className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="font-display text-4xl font-extrabold">Nossos serviços</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <div key={s.name} className="rounded-3xl bg-card p-6 shadow-soft transition hover:-translate-y-1">
              <div className="text-4xl">{s.icon}</div>
              <h3 className="mt-4 font-display text-xl font-bold">{s.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="sobre" className="bg-secondary py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display text-4xl font-extrabold">Uma família que ama pets</h2>
          <p className="mt-5 text-lg text-secondary-foreground">
            A <strong>Tabata Aita</strong> é a fundadora e dona do espaço, e conta com o apoio do esposo <strong>Emerson</strong> no dia a dia.
            Juntos, cuidam de cada pet como se fosse da família.
          </p>
        </div>
      </section>

      <section id="agendar" className="mx-auto max-w-xl px-6 py-16">
        <h2 className="text-center font-display text-4xl font-extrabold">Agende pelo WhatsApp</h2>
        <form onSubmit={agendar} className="mt-8 space-y-4 rounded-3xl bg-card p-6 shadow-soft">
          <input required placeholder="Seu nome" className={field} value={form.tutor} onChange={(e) => setForm({ ...form, tutor: e.target.value })} />
          <input required placeholder="Nome do pet" className={field} value={form.pet} onChange={(e) => setForm({ ...form, pet: e.target.value })} />
          <select className={field} value={form.servico} onChange={(e) => setForm({ ...form, servico: e.target.value })}>
            {services.map((s) => <option key={s.name}>{s.name}</option>)}
            <option>Banho e Tosa</option>
          </select>
          <input required type="date" className={field} value={form.data} onChange={(e) => setForm({ ...form, data: e.target.value })} />
          <button className="w-full rounded-full bg-gradient-warm py-4 font-bold text-primary-foreground shadow-soft">Enviar pedido</button>
        </form>
      </section>

      <section id="contato" className="mx-auto max-w-6xl px-6 pb-16">
        <div className="grid overflow-hidden rounded-3xl bg-card shadow-soft md:grid-cols-2">
          <div className="p-8">
            <h2 className="font-display text-3xl font-extrabold">Venha nos visitar</h2>
            <p className="mt-4">📍 Rua Olimpio França de Matos, 35<br />Jardim Sol Poente<br />São Miguel Arcanjo - SP<br />CEP 18232-128</p>
            <a target="_blank" rel="noreferrer" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`} className="mt-6 inline-block font-bold text-primary underline">Abrir no Google Maps</a>
          </div>
          <iframe title="Mapa" className="h-72 w-full md:h-full" loading="lazy" src={`https://www.google.com/maps?q=${encodeURIComponent(ADDRESS)}&output=embed`} />
        </div>
      </section>

      <footer className="py-8 text-center text-sm text-muted-foreground">© {new Date().getFullYear()} Tabata Aita Estética Pet · São Miguel Arcanjo - SP</footer>
    </main>
  );
}
