const express = require('express');
const router = require('./router');

let app = express();

app.use(express.json());
app.use(router);

// get request
app.get('/', (req, res) => {
    if(req.url === '/')
        res.send(`Welcome to express app`);
});

app.all('*', (req, res) => {
    res.status(404).send(`<h3> Resource not found<h3>`)
});

app.listen(9100, () => {
    console.log(`Server started on the port 9100`);
});