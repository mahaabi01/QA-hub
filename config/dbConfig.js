//this file is used for connecting with our database
module.exports = {
  HOST: "localhost",
  USER: "root",
  PASSWORD: "",
  DB: "stackof",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  //pool is related to threading and response time related used for providing security
  //module.exports helps to export this file to other file to access
};