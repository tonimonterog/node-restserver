// ======================
// Puerto
// ======================

process.env.PORT = process.env.PORT || 3000;

// ======================
// Entorno
// ======================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ======================
// Vencimiento del token
// ======================
// 60 segundos
// 60 minutos
// 24 horas
// 30 días

process.env.CADUCIDAD_TOKEN = '48h';

// ======================
// SEED de autentiación
// ======================

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

// ======================
// Base de datos
// ======================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;

// ======================
// Google Cliente ID
// ======================

process.env.CLIENT_ID = process.env.CLIENT_ID || '211861944831-4hkc925dlu1rivfssm44e123o9hvn8b6.apps.googleusercontent.com';