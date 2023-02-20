const https = require('https');
const http = require('http');
const fs = require( 'fs' );
const express = require('express'); // Sử dụng framework express
const next = require('next'); // Include module next

const port = parseInt(process.env.PORT, 10) || 3000; // Port để chạy app Nextjs, cũng là server nodejs
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const expressApp = express();

    // Nếu các bạn muốn các routing tự động liến kết đến route files giống với cấu trúc của Nextjs thì chỉ cần thêm 3 dòng bên dưới
    // https://nextjs.org/docs/routing/introduction
    expressApp.all('*', (req, res) => {
        return handle(req, res);
    });

    const server = https.createServer(
        {
            key: fs.readFileSync('./ssl/key.pem', 'utf-8'),
            cert: fs.readFileSync('./ssl/cert.pem', 'utf-8')
        },
        expressApp,
    )

    server.listen(port, (err) => {
        if (err) throw err;
        console.log(`> Ready on https://localhost:${port}`);
    });
});
