import { createServerFn } from '@tanstack/react-start';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import { reservationSchema, confirmSchema, meetSchema } from './reservation-schema';
import { z } from 'zod';

export const submitReservation = createServerFn({method:'POST'}).inputValidator((input:unknown)=>reservationSchema.parse(input)).handler(async({data})=>{
  const today = new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo'}).format(new Date());
  if(data.data < today) throw new Error('Escolha uma data futura.');
  const {supabaseAdmin}=await import('@/integrations/supabase/client.server');
  const {error}=await supabaseAdmin.from('reservations').insert({tutor:data.tutor,pet:data.pet,tipo:data.tipo,servico:data.servico,requested_date:data.data,phone:data.phone,notes:data.obs});
  if(error) { console.error('Reservation insert',error); throw new Error('Não foi possível enviar o pedido. Tente novamente.'); }
  return {ok:true};
});

export const getReservations = createServerFn({method:'GET'}).middleware([requireSupabaseAuth]).handler(async({context})=>{
  const {data:admin,error:roleError}=await context.supabase.rpc('has_role',{_user_id:context.userId,_role:'admin'});
  if(roleError || !admin) return {allowed:false,rows:[],profile:null};
  const {data:rows,error}=await context.supabase.from('reservations').select('*').order('requested_date').order('created_at');
  if(error) throw new Error('Não foi possível carregar as reservas.');
  const {data:profile}=await context.supabase.from('profiles').select('display_name,avatar_url').eq('id',context.userId).maybeSingle();
  return {allowed:true,rows:rows??[],profile};
});

export const updateReservation = createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator((input:unknown)=>z.discriminatedUnion('action',[
  confirmSchema.extend({action:z.literal('confirm')}),
  z.object({action:z.literal('cancel'),id:z.string().uuid()}),
  z.object({action:z.literal('meet'),id:z.string().uuid(),url:meetSchema}),
]).parse(input)).handler(async({context,data})=>{
  const {data:admin}=await context.supabase.rpc('has_role',{_user_id:context.userId,_role:'admin'});
  if(!admin) throw new Error('Acesso restrito à administração.');
  const {supabaseAdmin}=await import('@/integrations/supabase/client.server');
  const {data:row,error}=await supabaseAdmin.from('reservations').select('*').eq('id',data.id).single();
  if(error || !row) throw new Error('Reserva não encontrada.');
  if(data.action==='meet') {
    if(row.status!=='confirmed') throw new Error('Confirme a reserva antes de salvar o link.');
    const {error:saveError}=await context.supabase.from('reservations').update({meet_url:data.url}).eq('id',data.id).eq('status','confirmed');
    if(saveError) throw new Error('Não foi possível salvar o link.');
    return {ok:true};
  }
  const {data:claimed,error:claimError}=await supabaseAdmin.from('reservations').update({processing:true}).eq('id',data.id).eq('processing',false).eq('status',data.action==='confirm'?'pending':row.status).select('id').maybeSingle();
  if(claimError || !claimed) throw new Error('A reserva foi alterada ou está sendo processada. Atualize a lista.');
  try {
    const key=process.env['GOOGLE_CALENDAR_API_KEY']; const apiKey=process.env['LOVABLE_API_KEY'];
    const gateway=async(path:string,method:string,body?:object)=>{
      if(!key || !apiKey) throw new Error('A Google Agenda precisa ser conectada.');
      const response=await fetch(`https://connector-gateway.lovable.dev/google_calendar/calendar/v3${path}`,{method,headers:{Authorization:`Bearer ${apiKey}`,'X-Connection-Api-Key':key,'Content-Type':'application/json'},body:body?JSON.stringify(body):undefined});
      if(!response.ok){const detail=await response.text();console.error(`Calendar [${response.status}] ${detail}`);throw new Error(`Google Agenda [${response.status}]: ${detail}`);}
      return response.status===204 ? null : response.json();
    };
    if(data.action==='cancel') {
      if(row.calendar_event_id) await gateway(`/calendars/primary/events/${row.calendar_event_id}?sendUpdates=all`,'DELETE');
      const {error:cancelError}=await supabaseAdmin.from('reservations').update({status:'cancelled',processing:false}).eq('id',data.id);
      if(cancelError) throw new Error('Não foi possível cancelar.');
    } else {
      const start=new Date(`${data.date}T${data.time}:00-03:00`); const end=new Date(start.getTime()+data.duration*60000);
      if(start<=new Date()) throw new Error('Escolha um horário futuro.');
      const {data:overlaps}=await context.supabase.from('reservations').select('starts_at,duration_minutes').eq('status','confirmed').neq('id',data.id);
      if((overlaps??[]).some(r=>r.starts_at && new Date(r.starts_at)<end && new Date(new Date(r.starts_at).getTime()+(r.duration_minutes??0)*60000)>start)) throw new Error('Esse horário já tem uma reserva confirmada.');
      let meetUrl:string|null=null; let eventId:string|null=null;
      if(data.generateMeet){
        eventId=`pet${data.id.replace(/-/g,'')}`;
        let event=await gateway(`/calendars/primary/events/${eventId}`,'GET').catch(()=>null);
        if(!event) event=await gateway('/calendars/primary/events?conferenceDataVersion=1','POST',{id:eventId,summary:`${row.servico} · ${row.pet}`,start:{dateTime:start.toISOString(),timeZone:'America/Sao_Paulo'},end:{dateTime:end.toISOString(),timeZone:'America/Sao_Paulo'},conferenceData:{createRequest:{requestId:data.id,conferenceSolutionKey:{type:'hangoutsMeet'}}}});
        meetUrl=event?.hangoutLink??event?.conferenceData?.entryPoints?.find((e:{entryPointType:string})=>e.entryPointType==='video')?.uri??null;
        if(!meetUrl) { for(let i=0;i<3&&!meetUrl;i++){await new Promise(resolve=>setTimeout(resolve,1000));event=await gateway(`/calendars/primary/events/${eventId}`,'GET');meetUrl=event?.hangoutLink??null;} }
      }
      const {error:confirmError}=await supabaseAdmin.from('reservations').update({status:'confirmed',requested_date:data.date,starts_at:start.toISOString(),duration_minutes:data.duration,meet_url:meetUrl,calendar_event_id:eventId,processing:false}).eq('id',data.id);
      if(confirmError) throw new Error('Não foi possível confirmar; atualize a lista antes de tentar novamente.');
    }
    return {ok:true};
  } catch(error){ await supabaseAdmin.from('reservations').update({processing:false}).eq('id',data.id);throw error; }
});