#include <stdio.h>
#include <emscripten/emscripten.h>

extern int set_ptr(int *sizePtr, int *timePtr, int *dataPtr);

int main()
{
	// av_register_all();
	fprintf(stdout, "ffmpeg init done\n");
	return 0;
}

typedef struct
{
	int size;
	int timestamp;
	// uint8_t *data;
} packet_data;

EMSCRIPTEN_KEEPALIVE void *setFile(char *file_path)
{
	FILE *file = fopen(file_path, "r");


	// 函数返回一个指针，结构体数据的指针
	// packet_data *packet = {
	// 	110,
	// 	120
	// };

	int size = 20;
	int time = 30;
	int data = 40;
	int *sizePtr = &size;
	int *timePtr = &time;
	int *dataPtr = &data;
	
	set_ptr(sizePtr, timePtr, dataPtr);

	return NULL;
}

// todo 实例化packet_data 结构体，接着调用js-libary的方法