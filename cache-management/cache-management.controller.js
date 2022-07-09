const express = require("express");
const router = express.Router();
const cacheService = require("./cache-management.service");
const responseHandler = require("../_helpers/responseHandler");

/**
 * @desc: Handler for GET request /getCache/:id
 * @param {*} req : Object
 * @param {*} res  : Object
 * @param {*} next : Function
 */
const getCacheByKey = (req, res, next) => {
  const key = req.params.id;
  cacheService
    .getCacheDataByCacheKey(key)
    .then((cacheDetails) =>
      res.json(
        responseHandler(res, "success", cacheDetails.data, cacheDetails.message)
      )
    )
    .catch((err) => next(err));
};

/**
 * @desc: Handler function for GET request `/getAllKeys`
 * @param {*} req : Object
 * @param {*} res : Object
 * @param {*} next : Function
 */
const getAllStoredKeys = (req, res, next) => {
  cacheService
    .getAllStoredCacheKeys()
    .then((keys) =>
      res.json(responseHandler(res, "success", keys, "All Keys Fetched!"))
    )
    .catch((err) => next(err));
};

/**
 * @desc: Handler for POST request `/addCacheData`
 * @param {*} req : Object
 * @param {*} res : Object
 * @param {*} next : Function
 */
const createCache = (req, res, next) => {
  cacheService
    .createCache(req.body.data)
    .then((data) =>
      res.json(
        responseHandler(res, "success", data, "Data Cached Successfully!")
      )
    )
    .catch((err) => next(err));
};

/**
 * @desc: Handler for PATCH `/updateCacheData/:id`
 * @param {*} req : Object
 * @param {*} res : Object
 * @param {*} next : Function
 */
const updateCacheData = (req, res, next) => {
  const cacheKey = req.params.id;
  cacheService
    .updateCache(cacheKey, req.body.data)
    .then((data) =>
      res.json(
        responseHandler(
          res,
          "success",
          data,
          "Data Updated Successfully! in Cache"
        )
      )
    )
    .catch((err) => next(err));
};

/**
 * @desc: Handler for DELETE request `/deleteCache/:id`
 * @param {*} req : Object
 * @param {*} res : Object
 * @param {*} next : Function
 */
const deleteCacheByKey = (req, res, next) => {
  const cacheKey = req.params.id;
  cacheService
    .deleteCacheByKey(cacheKey)
    .then(() => {
      res.json(
        responseHandler(
          res,
          "success",
          null,
          `Cache for key:${cacheKey} is deleted successfully!`
        )
      );
    })
    .catch((err) => next(err));
};

/**
 * @desc : Handler for DELETE request `/deleteAllCache`
 * @param {*} req : Object
 * @param {*} res : Object
 * @param {*} next : Function
 */
const deleteAllCache = (req, res, next) => {
  cacheService
    .deleteAllCache()
    .then(() => {
      res.json(
        responseHandler(res, "success", null, `Cache Deleted Successfully!`)
      );
    })
    .catch((err) => next(err));
};

router.get("/getCache/:id", getCacheByKey);
router.get("/getAllKeys", getAllStoredKeys);
router.post("/addCacheData", createCache);
router.patch("/updateCacheData/:id", updateCacheData);
router.delete("/deleteCache/:id", deleteCacheByKey);
router.delete("/deleteAllCache", deleteAllCache);

module.exports = router;
