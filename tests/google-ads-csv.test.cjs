const test=require("node:test");
const assert=require("node:assert/strict");
const {parseCSV,parseNumber}=require("../modules/google-ads/csv-core.js");

test("lê BOM, delimitador ponto e vírgula e quebra CRLF",()=>{
 const rows=parseCSV("\uFEFFTermo;Cliques;Custo\r\nconsulta;2;R$ 12,50\r\n");
 assert.deepEqual(rows,[["Termo","Cliques","Custo"],["consulta","2","R$ 12,50"]]);
});
test("preserva delimitador e quebra de linha dentro de campo entre aspas",()=>{
 assert.deepEqual(parseCSV('Termo;Cliques\r\n"consulta; especial";3\r\n'),[["Termo","Cliques"],["consulta; especial","3"]]);
});
test("interpreta aspas escapadas",()=>{
 assert.deepEqual(parseCSV('Termo;Cliques\n"consulta ""premium""";4'),[["Termo","Cliques"],['consulta "premium"',"4"]]);
});
test("rejeita aspas não fechadas",()=>{
 assert.throws(()=>parseCSV('Termo;Cliques\n"consulta;4'),/aspas não fechadas/);
});
test("converte formatos numéricos brasileiro e internacional",()=>{
 assert.equal(parseNumber("R$ 1.234,56"),1234.56);
 assert.equal(parseNumber("1,234.56"),1234.56);
 assert.equal(parseNumber("12,50"),12.5);
 assert.equal(parseNumber("-"),0);
});
test("rejeita números não interpretáveis em vez de converter silenciosamente em zero",()=>{
 assert.throws(()=>parseNumber("abc"),/Valor numérico inválido/);
});
