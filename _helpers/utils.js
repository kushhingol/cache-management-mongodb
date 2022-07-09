/**
 * @desc: Function is defined to generate error Object for the given errorType
 * @param {*} errType : String
 * @returns Object
 */
const errorObject = (errType) => {
  const err = new Error();
  err.name = errType;
  return err;
};

/**
 * @desc: Fucntion is defined to get Random string
 * @returns : String
 */
const getRandomString = () => (Math.random() + 1).toString(36).substring(7);

/**
 * @desc: Function is defined to get the expiration time
 * @returns : Date
 */
const getExpirationTime = () =>
  new Date(Date.now() + 1000 * process.env.CACHE_EXPIRATION_TIME_IN_SECONDS);

module.exports = { errorObject, getRandomString, getExpirationTime };
