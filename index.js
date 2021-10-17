const express = require('express');
const router = require('./router/router');

let app = express();

app.use(express.json());
app.use(router);

const PORT = process.env.PORT || 9100;

app.listen(PORT, () => {
    console.log(`Server started on the port '${PORT}'`);
});