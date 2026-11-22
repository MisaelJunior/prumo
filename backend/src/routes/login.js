import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { pool } from '../db.js';
import { gerarToken } from '../auth.js';

const router = Router();

router.post('/', async (req, res) => {
    const {usuario, senha} = req.body;
    if(!usuario || !senha){
        return res.status(400).json({erro: 'Informe usuário e senha.'});
    }

    try{
        const {rows} = await pool.query(' SELECT id, usuario, senha_hash FROM usuarios WHERE usuario = $1', [usuario]);
        const encontrado = rows[0];
        const confere = encontrado ? await bcrypt.compare(senha, encontrado.senha_hash) : false;

        if(!confere){
            return res.status(401).json({erro: 'Usuário ou senha inválidos!'});
        }

        res.json({token: gerarToken(encontrado)});
    } catch (err){
        console.error(err);
        res.status(500).json({erro: 'Erro ao fazer login'});
    }
});

export default router;