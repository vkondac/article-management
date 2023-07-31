const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerUi = require("swagger-ui-express");
const articlesRouter = require('./routes/articles');
const categoriesRouter = require('./routes/categories');
const tagsRouter = require('./routes/tags');
const specs = require("./swagger_output.json");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
const allowedOrigins = ['http://localhost:3000'];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
}

app.use(cors(corsOptions));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use('/article', articlesRouter);
app.use('/category', categoriesRouter);
app.use('/tag', tagsRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
})
