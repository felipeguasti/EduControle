const path = require('path');

module.exports = {
    mode: 'development', // ou 'production'
    entry: './src/public/js/admin.js',
    output: {
      filename: 'admin.js',
      path: path.resolve(__dirname, 'src', 'public', 'js')
    }
};

module.exports = {
    mode: 'development', // ou 'production'
    entry: './src/public/js/anuncios.js',
    output: {
      filename: 'anuncios.js',
      path: path.resolve(__dirname, 'src', 'public', 'js')
    }
};

module.exports = {
    mode: 'development', // ou 'production'
    entry: './src/public/js/refeitorio.js',
    output: {
      filename: 'refeitorio.js',
      path: path.resolve(__dirname, 'src', 'public', 'js')
    }
};