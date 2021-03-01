emcc demo.c 
-s WASM=1 
--js-library lib.js 
-s "EXTRA_EXPORTED_RUNTIME_METHODS=['ccall', 'cwrap']" 
-s FORCE_FILESYSTEM=1 
-s ALLOW_MEMORY_GROWTH=1 
-o demo.js

emcc demo.c -s WASM=1 --js-library lib.js -s FORCE_FILESYSTEM=1 -s ALLOW_MEMORY_GROWTH=1 -s "EXTRA_EXPORTED_RUNTIME_METHODS=['ccall', 'cwrap']" -o demo.js