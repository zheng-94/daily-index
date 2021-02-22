// js library
mergeInto(LibraryManager.library, {
  download_file_from_wasm: (fileName) => {
    // "foo.zip" file name is for now hardcoded
    const content = FS.readFile("newfile", { encoding: "binary" });

    const fileUrl = URL.createObjectURL(
      new Blob([new Uint8Array(content, content.byteOffset, content.length)])
    );

    const link = document.createElement("a");
    link.href = fileUrl;
    link.innerHTML = "Click!";
    document.body.appendChild(link);
    link.click();
  },
});
