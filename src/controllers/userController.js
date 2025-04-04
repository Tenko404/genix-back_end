const User = require('../models/User');
const bcrypt = require('bcryptjs');

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

module.exports = {
    registerUser,
};

