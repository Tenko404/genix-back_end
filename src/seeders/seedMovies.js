require('dotenv').config(); 
const fs = require('fs');
const csv = require('csv-parser');
const Movies = require('../models/Movies'); 
const sequelize = require('../config/database'); 

const csvFilePath = './src/seeders/movies.csv'; 

const moviesToSeed = [];

const seedFromCSV = async () => {
    console.log(`Iniciando leitura do arquivo CSV: ${csvFilePath}`);

    fs.createReadStream(csvFilePath)
        .pipe(csv({ separator: ',' }))
        .on('error', (error) => {
            console.error('Erro ao ler o arquivo CSV:', error);
        })
        .on('data', (row) => {
            const cleanString = (value) => {
                if (value === null || value === undefined) return null;
                return String(value).replace(/[R$%,]/g, '').trim();
            };

            const isCleanedValueNumeric = (cleaned) => {
                 if (cleaned === null || cleaned === '') return false;
                 return !isNaN(parseFloat(cleaned));
            };

            // Pega os valores limpos
            const audienceScoreClean = cleanString(row['Nota da audiência %']);
            const profitabilityClean = cleanString(row['Lucro']);
            const rottenTomatoesClean = cleanString(row['Rotten Tomatoes %']);
            const worldwideGrossClean = cleanString(row['Bilheteria Mundial']);
            const yearClean = cleanString(row['Ano']);
            const yearNumber = !isNaN(parseInt(yearClean, 10)) ? parseInt(yearClean, 10) : null;

            const movieData = {
                title: row['Filme'],
                genre: row['Genero'] || null,
                studio: row['Estudio'] || null,
                audienceScorePercent: isCleanedValueNumeric(audienceScoreClean) ? `${audienceScoreClean}%` : null,
                profitabilityPercent: profitabilityClean, 
                rottenTomatoesPercent: isCleanedValueNumeric(rottenTomatoesClean) ? `${rottenTomatoesClean}%` : null,
                worldwideGross: isCleanedValueNumeric(worldwideGrossClean) ? `$${worldwideGrossClean}` : null,
                year: yearNumber, 
            };
            moviesToSeed.push(movieData);

        })
        .on('end', async () => {
            console.log(`Leitura do CSV concluída. ${moviesToSeed.length} filmes encontrados.`);
            console.log('Sincronizando banco de dados e inserindo filmes...');

            try {
                await sequelize.sync();

                await Movies.bulkCreate(moviesToSeed, {
                    ignoreDuplicates: true,
                });

                console.log('Filmes inseridos com sucesso no banco de dados!');

            } catch (error) {
                console.error('Erro ao sincronizar ou inserir filmes no banco:', error);
            } finally {
            }
        });
};

seedFromCSV();