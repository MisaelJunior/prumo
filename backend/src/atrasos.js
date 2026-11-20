const MS_POR_DIA = 24 * 60 * 60 * 1000;

function paraUTC(iso) {
    const [ano, mes, dia] = iso.split('-').map(Number);
    return Date.UTC(ano, mes -1, dia);
}

function paraCENT(valor){
    return Math.round(valor * 100);
}

export function diasDeAtraso(vencimento, hoje){
    return Math.round((paraUTC(hoje) - paraUTC(vencimento)) / MS_POR_DIA);
}

export function valorEmAberto(total, pago){
    return (paraCENT(total) - paraCENT(pago)) / 100;
}

export function listarAtrasadas(parcelas, hoje){
    return parcelas
        .filter((p) => paraCENT(p.valor_pago) < paraCENT(p.valor) && p.vencimento < hoje)
        .map((p) => ({
            id: p.id,
            projeto_id: p.projeto_id,
            cliente: p.cliente,
            projeto: p.projeto,
            descricao: p.descricao,
            vencimento: p.vencimento,
            valor_em_aberto: valorEmAberto(p.valor, p.valor_pago),
            dias_atraso: diasDeAtraso(p.vencimento, hoje),
        }))
        .sort((a, b) => a.vencimento.localeCompare(b.vencimento));
}

