const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./routes');
const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());
app.use('/api', routes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
