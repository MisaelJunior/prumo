// gera uma sugestao de parcelas mas o usuario ainda pode editar

function somarMeses(iso, meses){
    const [a,m,d] = iso.split('-').map(Number);
    const data = new Date(a, m -1 + meses, 1);
    const ultimo = new Date(data.getFullYear(), data.getMonth() + 1, 0). getDate();
    data.setDate(Math.min(d, ultimo));
    const mm = String(data.getMonth()+1).padStart(2, '0');
    const dd = String(data.getDate()).padStart(2, '0');
    return `${data.getFullYear()}-${mm}-${dd}`;
}

export function gerarParcelas(valorFechado, sinal, numero, primeiro){
    const total = Math.round(Number(valorFechado)*100);
    const sinalCent = Math.round(Number(sinal || 0) * 100);
    const n = Number(numero);
    if (!primeiro || sinalCent < 0 || sinalCent > total) return [];
    const restante = total - sinalCent;
    if (restante > 0 && !(Number.isInteger(n) && n >= 1 && n<= 60)) return [];

    const lista = [];
    if (sinalCent > 0) lista.push({descricao: 'Sinal', cent: sinalCent, vencimento: primeiro});
    if ( restante > 0 ) {
        const base = Math.floor(restante/n);
        const resto = restante - base*n;
        for( let i = 0; i < n; i++){
            lista.push({
                descricao: `Parcela ${i + 1} de ${n}`,
                cent: base + (i === n - 1 ? resto : 0),
                vencimento: somarMeses(primeiro, i + (sinalCent > 0 ? 1 : 0)),
            });
        }
    }
    return lista.map((p) => ({ descricao: p.descricao, valor: (p.cent / 100).toFixed(2), vencimento: p.vencimento }));
}