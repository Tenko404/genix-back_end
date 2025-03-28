const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');           // Para gerar tokens JWT
const { validationResult } = require('express-validator'); // Para verificar validação

const registerUser = async (req, res) => {
    try {
        const { userId, profilePhoto, genres, email, password } = req.body;

        // Verifica se o usuário já existe
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Usuário já cadastrado' });
        }

        // Criptografa a senha
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Cria o usuário no banco de dados
        const user = await User.create({
            userId,
            profilePhoto,
            genres,
            email,
            password: hashedPassword,
        });

        const { password: _, ...userWithoutPassword } = user.toJSON();
        res.status(201).json({
            message: 'Usuário criado com sucesso',
            user: userWithoutPassword
        });

    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        res.status(500).json({ message: 'Erro ao criar usuário' });
    }
};
const loginUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });

        const isMatch = user ? await bcrypt.compare(password, user.password) : false;

        if (!user || !isMatch) {
            return res.status(401).json({ message: 'Email ou senha inválidos' });
        }

        const payload = {
            user: {
                id: user.userId,  
                email: user.email 
                
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET, 
            { expiresIn: '1d' },      
            (err, token) => {         
                if (err) {
                    console.error('Erro ao gerar token JWT:', err);
                    return res.status(500).json({ message: 'Erro ao gerar token de autenticação' });
                }
                res.json({ message: 'Login bem-sucedido', token: token }); 
            }
        );

    } catch (error) {
        console.error('Erro no processo de login:', error);
        res.status(500).json({ message: 'Erro interno do servidor durante o login' });
    }
};
module.exports = {
    registerUser,
    loginUser,
};

