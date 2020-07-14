const path = require('path');

const mimeType = {
    'css': 'text/css',
    'js': 'text/javascript',
    'html': 'text/html',
    'json': 'application/json',
    'jpeg': 'image/jpeg',
    'png': 'image/png'
}
module.exports = (filePath) => {
    let ext = path.extname(filePath).split('.').pop().toLocaleLowerCase();

    if (!ext) {
        ext = filePath
    }

    return mimeType[ext] || mimeType['html']
}
