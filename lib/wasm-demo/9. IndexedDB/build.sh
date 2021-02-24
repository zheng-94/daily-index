emcc demo.c \
-s WASM=1 \
--js-library lib.js \
-s FORCE_FILESYSTEM=1 \
-s "EXPORTED_FUNCTIONS=['_read_and_save_file']" \
-s "EXTRA_EXPORTED_RUNTIME_METHODS=['ccall']" \
-o demo.js \