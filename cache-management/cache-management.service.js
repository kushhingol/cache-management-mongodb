const db = require("../db/db");
const utilsService = require("../_helpers/utils");
const Cache = db.Cache;

const CacheMessage = {
  CACHE_HIT: "Cache hit",
  CACHE_MISS: "Cache miss",
};

/**
 * @desc : Function is defined to update a record in the collection (Generic function)
 * @param {*} query : Object
 * @param {*} cacheData : Object
 * @returns : Promise
 */
const updateQuery = async (query, cacheData) => {
  return await Cache.findOneAndUpdate(query, {
    $set: cacheData,
  });
};

/**
 * @desc: Function is defined to get the count of all cache records
 * @retuns : Promise
 */
const getCacheRecordsCount = async () => {
  return await Cache.find().count();
};

/**
 * @desc: Function is defined to update TTL on Record read
 * @param {*} cacheKey : string
 * @param {*} value : Object
 * @returns : {data: Object, message: string}
 */
const updatedExpirationTimeOnRead = async (cacheKey, value) => {
  const query = {
    key: cacheKey,
    expiresAt: { $gte: new Date(Date.now()) },
  };
  await updateQuery(query, {
    expiresAt: utilsService.getExpirationTime(),
  });
  return {
    data: value,
    message: CacheMessage.CACHE_HIT,
  };
};

/**
 * @desc: Function is defined to add new Cache Record in the collection
 * @param {*} key : string
 * @param {*} value : Object
 * @param {*} expiresAt : string
 * @returns : Promise
 */
const addNewCacheRecord = async (key, value, expiresAt) => {
  const cache = new Cache();
  cache.key = key;
  cache.value = value;
  cache.expiresAt = expiresAt;
  await cache.save();
  return {
    data: cache.value,
    message: CacheMessage.CACHE_MISS,
  };
};

/**
 * @desc: Function is defined to find whether the cache count is exceeded our not
 * @returns : boolean
 */
const getIsCacheCountExceed = async () => {
  const cacheCount = await getCacheRecordsCount();
  return cacheCount > process.env.MAX_ENTRIES - 1;
}

/**
 * @desc : Function is defined to get CacheData using cache key and also to create new cache record
 *         if the key is not present
 * @note   The record will be overriddedn with the record which is expired in the case of Cache Miss
 * @param {*} cacheKey : string
 * @returns : Promise
 */
const getCacheDataByCacheKey = async (cacheKey) => {
  try {
    const cacheDataRecord = await Cache.findOne({
      key: cacheKey,
      expiresAt: { $gte: new Date(Date.now()) },
    });

    if (cacheDataRecord) {
      return await updatedExpirationTimeOnRead(cacheKey, cacheDataRecord.value);
    } else {
      //If key is expired and if its already present in the collection
      //Then deleting the record in order to recreate a fresh record with the same key
      await Cache.findOneAndDelete({ key: cacheKey });

      const isCacheCountExceeded = await getIsCacheCountExceed();
      const [key, value, expiresAt] = [
        cacheKey,
        utilsService.getRandomString(),
        utilsService.getExpirationTime(),
      ];

      if (!isCacheCountExceeded) {
        return await addNewCacheRecord(key, value, expiresAt);
      } else {
        //Update existing record when cache count exceeded
        const data = await updateExpiredCache({
          value,
          expiresAt,
        });
        return {
          data: data,
          message: CacheMessage.CACHE_MISS,
        };
      }
    }
  } catch (err) {
    throw utilsService.errorObject(err.name);
  }
};

/**
 * @desc: Function is defined to get all stored keys
 * @returns : Promise
 */
const getAllStoredCacheKeys = async () => {
  return await Cache.find({
    key: { $exists: 1 },
    expiresAt: { $gte: new Date(Date.now()) },
  }).distinct("key");
};

/**
 * @desc: Function is defined to udpate the expired cache to new Cache
 * @param {*} cacheData : Object
 * @returns : Promise
 */
const updateExpiredCache = async (cacheData) => {
  const expiredCacheData = await Cache.findOne({
    expiresAt: { $lt: new Date(Date.now()) },
  });
  if (expiredCacheData) {
    const query = { key: expiredCacheData.key };
    return await updateQuery(query, {
      value: cacheData,
      expiresAt: utilsService.getExpirationTime(),
    });
  } else {
    throw utilsService.errorObject("CacheLimitExceeded");
  }
};

/**
 * @desc: Function is defined to create a new Cache
 * @param {*} cacheData : Object
 * @returns : Promise
 */
const createCache = async (cacheData) => {
  try {
    const isCacheCountExceeded = await getIsCacheCountExceed()
    const key = utilsService.getRandomString();
    if (!isCacheCountExceeded) {
      const cache = new Cache();
      cache.key = key;
      cache.value = cacheData;
      return await cache.save();
    } else {
      //Update existing record when cache count exceeded
      return await updateExpiredCache(cacheData);
    }
  } catch (err) {
    throw utilsService.errorObject(err.name);
  }
};

/**
 * @desc: Function is defined to update cache record or save one if cache record is not found
 * @param {*} cacheKey : String
 * @param {*} cacheData : Object
 * @returns : Promise
 */
const updateCache = async (cacheKey, cacheData) => {
  try {
    const cache = await Cache.findOne({ key: cacheKey });
    if (cache) {
      const query = {
        key: cacheKey,
        expiresAt: { $gte: new Date(Date.now()) },
      };
      return await updateQuery(query, {
        value: cacheData,
        expiresAt: utilsService.getExpirationTime(),
      });
    } else {
      const cache = new Cache();
      cache.key = cacheKey;
      cache.value = cacheData;
      return await cache.save();
    }
  } catch (err) {
    throw utilsService.errorObject(err);
  }
};

/**
 * @desc: Function is defined to delete cache Record by key 
 * @param {*} cacheKey : string
 * @returns : Promise
 */
const deleteCacheByKey = async (cacheKey) => {
  const data = await Cache.findOneAndDelete({ key: cacheKey });
  if (data) {
    return data;
  } else {
    throw utilsService.errorObject("EntryNotFoundInDB");
  }
};

/**
 * @desc: Function is defined to delete all cache records
 * @returns : Promise
 */
const deleteAllCache = async () => {
  return await Cache.deleteMany();
};

module.exports = {
  getCacheDataByCacheKey,
  getAllStoredCacheKeys,
  createCache,
  updateCache,
  deleteCacheByKey,
  deleteAllCache,
};
