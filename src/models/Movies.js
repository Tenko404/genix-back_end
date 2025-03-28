// models/Movies.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Movies = sequelize.define('Movies', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    genre: {
        type: DataTypes.STRING,
        allowNull: true
    },
    studio: {
        type: DataTypes.STRING,
        allowNull: true
    },
    // Alterados para STRING
    audienceScorePercent: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    profitabilityPercent: {
        type: DataTypes.STRING,
        allowNull: true
    },
    rottenTomatoesPercent: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    worldwideGross: {
        type: DataTypes.STRING,
        allowNull: true
    },
    // Mantido como INTEGER
    year: {
        type: DataTypes.INTEGER,
        allowNull: true 
    }
}, {
    timestamps: true,
    tableName: 'movies',
});

module.exports = Movies;