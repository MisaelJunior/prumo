const MS_POR_DIA = 24 * 60 * 60 * 1000

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

