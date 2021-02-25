// 转码数据存储在indexedDB中，
// 每个文件会新建一个表，每个表的第一个数据为原始数据blob，后面的数据为二进制数据
// 对象仓库，仓库名为文件名

// In the following line, you should include the prefixes of implementations you want to test.
window.indexedDB =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB;

// DON'T use "var indexedDB = ..." if you're not in a function.
// Moreover, you may need references to some window.IDB* objects:
window.IDBTransaction =
  window.IDBTransaction ||
  window.webkitIDBTransaction ||
  window.msIDBTransaction;

window.IDBKeyRange =
  window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
// (Mozilla has never prefixed these objects, so we don't need window.mozIDB*)

const DBNAME = "encodedVideo";
const DBVERSION = 1;

/**
 * @name initDB
 * @description 初始化DB
 * @param {Array} storeNames 仓库名列表
 */
const initDB = (storeNames) => {
  return new Promise((resolve, reject) => {
    const IndexedDB = window.indexedDB.open(DBNAME, DBVERSION);

    IndexedDB.onupgradeneeded = (e) => {
      // 新建数据库
      const db = e.target.result;

      storeNames.forEach((storeName) => {
        if (!db.objectStoreNames.contains(storeName)) {
          // 先判断库是否存在
          const objectStore = db.createObjectStore(storeName, {
            keyPath: "id",
          });

          objectStore.createIndex("id", "id");
        }
      });

      resolve();
    };

    IndexedDB.onerror = (e) => {
      reject(e);
    };

    IndexedDB.onsuccess = (e) => {
      resolve();
    };
  });
};

/**
 * @name addStoreFile
 * @description 将文件放入IndexedDB中所对应名称的store
 * @param {String} storeName 仓库名（即文件名）
 * @param {ArrayBuffer} data 二进制数据
 */
const addStoreFile = (storeName, data) => {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DBNAME);

    request.onsuccess = function (event) {
      const db = request.result;

      const transaction = db
        .transaction([storeName], "readwrite")
        .objectStore(storeName)
        .add(data);

      transaction.onsuccess = (e) => {
        resolve();
      };

      transaction.onerror = (e) => {
        reject();
      };
    };

    request.onerror = (e) => {
      reject();
    };
  });
};

/**
 * @name getPacketByIndex
 * @description 获取 encoded data packets，用于js 上传
 * @param {String} storeName
 * @param {key} key
 */
const getPacketByIndex = (storeName, key) => {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DBNAME);

    request.onsuccess = function (event) {
      const db = request.result;

      const transaction = db
        .transaction(storeName)
        .objectStore(storeName)
        .index("id")
        .get(key);

      transaction.onsuccess = (e) => {
        const result = e.target.result;

        if (result) {
          resolve(result);
        } else {
          reject("未获得数据记录");
        }
      };

      transaction.onerror = (e) => {
        reject();
      };
    };

    request.onerror = (e) => {
      reject();
    };
  });
};

/**
 * todo
 * @name delStore
 * @description 删除仓库
 */
const delStore = () => {
  const IndexedDB = window.indexedDB.open(DBNAME, DBVERSION);
};

/**
 * todo
 * @name delDB
 * @description 删除数据库
 */
const delDB = () => {
  const IndexedDB = window.indexedDB.open(DBNAME, DBVERSION);
};
