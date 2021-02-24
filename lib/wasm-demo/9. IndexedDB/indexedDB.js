const DBNAME = "encodedVideo";
const DBVERSION = 1;

// 转码数据存储在indexedDB中，
// 每个文件会新建一个表，每个表的第一个数据为原始数据blob，后面的数据为二进制数据
// 对象仓库，仓库名为文件名

/**
 * @name initDB
 * @description 初始化DB
 */
export const initDB = () => {
  const IndexedDB = window.indexedDB.open(DBNAME, DBVERSION);

  IndexedDB.onupgradeneeded = (event) => {
    // 如果指定的版本号，大于数据库的实际版本号，就会发生数据库升级事件upgradeneeded
    // 新建数据库
    const result = event.target.result;

    if (!result.objectStoreNames.contains(tableName)) {
      // 先判断库是否存在
      result
        .createObjectStore(tableName, { keyPath: key }) // 表的主键 是 url 比如{url: 'xx', data: {xx}}  主键会自动生成索引
        .createIndex(key, key, { unique: true }); // 建立索引
    }
    IndexedDB.result.close();
  };
};

/**
 * @name initStore
 * @description 新建对象仓库，仓库名为文件名
 * @param {String} storeName 仓库名
 * @param {String} key 主键
 */
export const initStore = (storeName, key) => {
  const IndexedDB = window.indexedDB.open(DBNAME, DBVERSION);

  IndexedDB.onsuccess = (event) => {
    const result = event.target.result;

    if (!result.objectStoreNames.contains(storeName)) {
      // 先判断库是否存在
      result
        .createObjectStore(storeName, { keyPath: key }) // 表的主键 是 url 比如{url: 'xx', data: {xx}}  主键会自动生成索引
        .createIndex(key, key, { unique: true }); // 建立索引
    }
    IndexedDB.result.close();
  };
};
