const swaggerAutogen = require("swagger-autogen")();

const outputFile = "./swagger_output.json"; 
const endpointsFiles = ["./routes/*.js"];

const doc = {
  info: {
    version: "1.0.0",
    title: "Your Express API",
    description: "API documentation for your Express API",
  },
  host: "localhost:5000", 
  basePath: "/",
  schemes: ["http"], 
};

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  require("./server.js"); 
});
