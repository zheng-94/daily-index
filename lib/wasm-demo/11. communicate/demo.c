#include <stdio.h>
#include <emscripten/emscripten.h>

extern int send_packet_ptr_to_web(int *packet_ptr);

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

	int packet = 40;
	int *packet_ptr = &packet;
	
	send_packet_ptr_to_web(packet_ptr);

	return NULL;
}