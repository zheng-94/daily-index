#include <stdio.h>
#include <emscripten/emscripten.h>

int g_int = 42;
double g_double = 3.1415926;

int* EMSCRIPTEN_KEEPALIVE get_int_ptr() {
	return &g_int;
}

double* EMSCRIPTEN_KEEPALIVE get_double_ptr() {
	return &g_double;
}

void EMSCRIPTEN_KEEPALIVE print_data() {
	printf("C {g_int:%d}\n", g_int);
	printf("C {g_double:%lf}\n", g_double);
}

