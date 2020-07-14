const http = require('http');
const config = require('./config/config');
const path = require('path');
const fs = require('fs');
const Handlebars = require('handlebars');
const tplPath = path.join(__dirname, './template/dir.tpl');
const source = fs.readFileSync(tplPath);
const template = Handlebars.compile(source.toString());
const isFresh = require('./cache');
const mimeType = require('./mimeType');

const server = http.createServer((req, res) => {
    //将客户端当前文件夹路径与请求的url拼接起来
    const filePath = path.join(config.root, req.url,)
    //对类型判断方法的调用
    const contentType = mimeType(filePath);
    res.setHeader('Content-Type', contentType);
    //判断目录是否存在
    fs.stat(filePath, (err, stats) => {
        if (err) {
            res.statusCode = 404;
            // res.setHeader('Content-Type', 'text/plain');
            res.end(`${filePath} is not a directory or file`);
            return;
        }
        //判断是否过期
        if (isFresh(stats, req, res)) {
            res.statusCode = 304;
            res.end();
            return;
        }
        //如果请求路径对应是文件还是文件夹
        if (stats.isFile()) {
            res.statusCode = 200;
            // res.setHeader('Content-Type', 'text/html');
            fs.createReadStream(filePath).pipe(res);
        } else if (stats.isDirectory()) {
            fs.readdir(filePath, (err, files) => {
                res.statusCode = 200;
                // res.setHeader('Content-Type', 'text/html');
                const dir = path.relative(config.root, filePath);
                const data = {
                    title: path.basename(filePath),
                    dir: dir ? `/${dir}` : '',
                    files
                }
                res.end(template(data))
            })
        }
    })
});

server.listen(config.port, config.hostname, () => {
    console.log(`Servser started at http://${config.hostname}:${config.port}`)
});