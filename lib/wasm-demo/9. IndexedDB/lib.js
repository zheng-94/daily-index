// js library
mergeInto(LibraryManager.library, {
  // indexedDB操作
  add_indexedDB: function () {
    console.log(`add_indexedDB`);
  },
  // dom操作
  edit_DOM: function () {
    console.log(`edit_DOM`);
  },
  getFile: function (fileName) {
    const request = window.indexedDB.open("encodedVideo");
  },
  addPacket: function (fileName, index, data) {
    
  }
});
