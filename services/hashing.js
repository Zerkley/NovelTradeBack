const argon2 = require("argon2");


const hashingService = async (password) => {
    try {
      const hash = await argon2.hash(password)
      return hash;
    } catch (error) {
      console.log(error);
    }
  };

  const hashingCompare = async (hash, password) =>{
    try {
      if (await argon2.verify(hash, password)){
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
    }
  }

  module.exports = { hashingService, hashingCompare };