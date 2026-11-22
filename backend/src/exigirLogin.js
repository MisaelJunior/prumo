import { verificarToken } from "./auth.js";

export function exigirLogin(req, res, next){
    const cabecalho = req.headers.authorization || '';
    const [tipo, token] = cabecalho.split(' ');
    
    if( tipo !== 'Bearer' || !token){
        return res.status(401).json({erro: 'Faça login para continuar.'});
    }

    try{
        req.usuario = verificarToken(token);
        next();
    } catch{
        res.status(401).json({erro: 'Sessão inválida ou expirada. Entre novamente.'});
    }
}