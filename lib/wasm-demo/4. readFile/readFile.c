#include <stdio.h>

int print_file(char *file_path)
{

  FILE *file = fopen(file_path, "r");
  if (!file)
  {
    printf("cannot open file\n");
    return 1;
  }
  while (!feof(file))
  {
    char c = fgetc(file);
    if (c != EOF)
    {
      putchar(c);
    }
  }
  return 0;
}
