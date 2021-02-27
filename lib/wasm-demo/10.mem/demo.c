#include <stdio.h>
#include <emscripten/emscripten.h>

typedef unsigned char uint8_t;

int g_int = 42;
double g_double = 3.1415926;
uint8_t g_unit8[5] = 'dafsdf';

int* EMSCRIPTEN_KEEPALIVE get_int_ptr() {
	return &g_int;
}

double* EMSCRIPTEN_KEEPALIVE get_double_ptr() {
	return &g_double;
}

uint8_t* EMSCRIPTEN_KEEPALIVE get_unit8_ptr() {
	return &g_unit8;
}

void EMSCRIPTEN_KEEPALIVE print_data() {
	printf("C {g_int:%d}\n", g_int);
	printf("C {g_double:%lf}\n", g_double);
	printf("C {g_unit8:%lf}\n", g_unit8);
}

