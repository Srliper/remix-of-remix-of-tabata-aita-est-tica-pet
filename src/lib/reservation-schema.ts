import { z } from 'zod';

export function isOpenDate(date: string) {
  const day = new Date(`${date}T12:00:00Z`).getUTCDay();
  return day >= 2 && day <= 6;
}
export const reservationSchema = z.object({
  tutor: z.string().trim().min(2).max(100), pet: z.string().trim().min(1).max(100),
  tipo: z.enum(['Cachorro', 'Gato']), servico: z.enum(['Banho','Tosa','Banho e Tosa','Estética']),
  data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(isOpenDate, 'Atendemos somente de terça a sábado.'),
  phone: z.string().transform(v => v.replace(/\D/g, '')).refine(v => /^(?:55)?\d{10,11}$/.test(v), 'Informe um WhatsApp válido.'),
  obs: z.string().trim().max(2000),
});
export const meetSchema = z.string().url().refine(value => {
  const url = new URL(value);
  return url.protocol === 'https:' && url.hostname === 'meet.google.com' && /^\/[a-z]{3}-[a-z]{4}-[a-z]{3}$/.test(url.pathname);
}, 'Use um link válido do Google Meet.');
export const confirmSchema = z.object({id:z.string().uuid(), date:z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(isOpenDate), time:z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/), duration:z.number().int().min(5).max(480), generateMeet:z.boolean()});
export function tutorWhatsApp(phone:string) { const normalized = phone.replace(/\D/g,''); return normalized.startsWith('55') && normalized.length>11 ? normalized : `55${normalized}`; }