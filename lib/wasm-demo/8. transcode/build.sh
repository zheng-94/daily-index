#!/bin/bash

emcc sendFile.c \
-s WASM=1 \
--js-library jsLibary.js \
-s FORCE_FILESYSTEM=1 \
-s ALLOW_MEMORY_GROWTH=1 \
-s "EXPORTED_FUNCTIONS=['_read_and_save_file']" \
-s "EXTRA_EXPORTED_RUNTIME_METHODS=['ccall']" \
-o sendFile.js \