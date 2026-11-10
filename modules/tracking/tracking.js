const checklist=[
["IDs e ambientes","IDs de GTM, GA4 e Ads correspondem ao cliente e ambiente corretos; sem mistura entre clientes."],
["Consentimento","Banner e configuração de consentimento respeitam escolhas e requisitos aplicáveis."],
["Tag base","Tag do GTM/GA4 dispara nas páginas previstas, sem instalação duplicada."],
["Page view","Visualização de página ocorre uma vez por carregamento/rota esperada."],
["Eventos de contato","Clique em WhatsApp e envio de formulário são eventos distintos."],
["Formulário","Envio válido dispara apenas após sucesso confirmado; erros não contam como lead."],
["WhatsApp","Clique/handoff é separado de conversa recebida; não presumir mensagem enviada."],
["Parâmetros","Parâmetros não contêm nome, telefone, e-mail, diagnóstico ou dado sensível."],
["Deduplicação","Mesmo evento não é contado duas vezes por tags, triggers ou importações duplicadas."],
["Conversões Ads","Ações primárias e secundárias têm definição, origem e janela documentadas."],
["Teste de ponta a ponta","Ação de teste é observada no Preview/DebugView e reconciliada com evidência comercial."],
["Produção e reversão","Publicação tem autorização, versão registrada e plano de reversão."]
];
const events=[
["page_view","Página carregada/visualizada; evidência: evento recebido uma vez na rota esperada.","Diagnóstico"],
["view_service","Visualização de conteúdo de serviço; evidência: página/serviço identificável sem dado sensível.","Diagnóstico"],
["form_start","Primeira interação com formulário; não é lead.","Microconversão"],
["form_submit","Formulário submetido; só considerar lead após confirmação de sucesso no backend/destino.","Secundário até validar"],
["whatsapp_click","Clique no link/botão do WhatsApp; não prova abertura, mensagem ou conversa.","Microconversão"],
["whatsapp_handoff","Redirecionamento/abertura do canal; não prova que a mensagem foi enviada ou recebida.","Secundário"],
["lead_received","Contato efetivamente recebido no canal/CRM; evidência no registro comercial.","Conversão candidata"],
["qualified_lead","Lead que atende critérios comerciais definidos; evidência no CRM/planilha controlada.","Conversão qualificada"],
["appointment_scheduled","Agendamento registrado e confirmado; evidência no sistema comercial.","Conversão qualificada"],
["appointment_attended","Comparecimento registrado; evidência operacional.","Resultado offline"],
["purchase","Venda efetivada; evidência no sistema comercial/financeiro.","Conversão de negócio"],
["revenue_received","Receita efetivamente recebida; conciliação financeira agregada.","Resultado financeiro"]
];
const body=document.querySelector("#checks"),eventBody=document.querySelector("#events");
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
body.innerHTML=checklist.map((x,i)=>'<tr><td><strong>'+esc(x[0])+'</strong></td><td>'+esc(x[1])+'</td><td><select data-status="'+i+'"><option value="Pendente">Pendente</option><option value="Validado">Validado</option><option value="Falha">Falha</option><option value="N/A">N/A</option></select></td><td><input type="text" data-note="'+i+'" placeholder="Referência da evidência (sem dados pessoais)"></td></tr>').join("");
eventBody.innerHTML=events.map(x=>'<tr><td><code>'+esc(x[0])+'</code></td><td>'+esc(x[1])+'</td><td>'+esc(x[2])+'</td></tr>').join("");
const meta=()=>({client:document.querySelector("#client").value,domain:document.querySelector("#domain").value,owner:document.querySelector("#owner").value,date:document.querySelector("#audit-date").value});
const rows=()=>checklist.map((x,i)=>({controle:x[0],criterio:x[1],status:document.querySelector('[data-status="'+i+'"]').value,evidencia:document.querySelector('[data-note="'+i+'"]').value}));
const csv=v=>'"'+String(v??"").replace(/"/g,'""')+'"';
function save(name,headers,data){const text="\uFEFF"+[headers,...data.map(o=>headers.map(h=>o[h]??""))].map(r=>r.map(csv).join(";")).join("\r\n");const a=document.createElement("a"),u=URL.createObjectURL(new Blob([text],{type:"text/csv;charset=utf-8"}));a.href=u;a.download=name+".csv";a.click();URL.revokeObjectURL(u);}
function update(){const r=rows(),counts={};r.forEach(x=>counts[x.status]=(counts[x.status]||0)+1);document.querySelector("#summary").innerHTML=[["Validado",counts.Validado||0],["Pendente",counts.Pendente||0],["Falha",counts.Falha||0],["Não aplicável",counts["N/A"]||0]].map(x=>'<article class="metric"><span>'+x[0]+'</span><strong>'+x[1]+'</strong><small>controles</small></article>').join("");const issues=[];if((counts.Falha||0)>0)issues.push("Há controles com falha: corrigir e repetir os testes antes de publicar.");if((counts.Pendente||0)>0)issues.push("Existem controles pendentes; auditoria ainda não concluída.");if((counts.Falha||0)===0&&(counts.Pendente||0)===0)issues.push("Checklist concluído. Isso documenta a revisão manual, mas não constitui certificação automática nem prova independente dos dados.");document.querySelector("#warnings").innerHTML=issues.map(x=>"<p>"+esc(x)+"</p>").join("");}
body.addEventListener("change",update);body.addEventListener("input",update);
document.querySelector("#reset").addEventListener("click",()=>{body.querySelectorAll("select").forEach(x=>x.value="Pendente");body.querySelectorAll("input").forEach(x=>x.value="");update();});
document.querySelector("#export-checks").addEventListener("click",()=>{const m=meta(),data=rows().map(x=>({...m,...x}));save("ekoads-auditoria-tracking",["client","domain","owner","date","controle","criterio","status","evidencia"],data);});
document.querySelector("#export-events").addEventListener("click",()=>save("ekoads-matriz-eventos",["evento","significado_evidencia","tipo_recomendado"],events.map(x=>({evento:x[0],significado_evidencia:x[1],tipo_recomendado:x[2]}))));
document.querySelector("#audit-date").value=new Date().toISOString().slice(0,10);update();
