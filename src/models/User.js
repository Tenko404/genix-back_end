const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    userId: { // ID do usuário
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true,
        validate: {
            notEmpty: true,
        }
    },
    profilePhoto: { // URL da foto de perfil
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isUrl: true,
        }
    },
    genres: { 
        type: DataTypes.JSON, // Armazenar os géneros como uma matriz JSON
        allowNull: false,
        validate: {
            isValidGenres(value) {
                if (!Array.isArray(value)) {
                    throw new Error('Genres must be an array');
                }
                if (value.length === 0) {
                    throw new Error('At least one genre must be selected');
                }
            }
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true, // Validação de email
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [6, 100], // Senha deve ter entre 6 e 100 caracteres
        }
    },
    createdAt: { // Data de criação do usuário
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    timestamps: true, // Ativa os campos createdAt e updatedAt
    tableName: 'users', // Nome da tabela no banco de dados
});

module.exports = User;
        
