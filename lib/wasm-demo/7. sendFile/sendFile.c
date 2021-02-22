#include <stdio.h>

extern int download_file_from_wasm(void);

int read_and_save_file(char *file_path)
{
  FILE *file = fopen(file_path, "r");
  FILE *file2 = fopen("newfile" , "a+");

  if (!file) {
    printf("cannot open file\n");
    return 1;
  }

  while (!feof(file))
  {
    char *c = fgetc(file);

    if (c != EOF)
    {
      fputs(c, file2);      
    }
  }

  download_file_from_wasm();

  return 0;
}
