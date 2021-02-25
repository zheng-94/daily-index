#include <stdio.h>

extern int add_indexedDB(void);
extern int edit_DOM(void);

int forward(char *file_path)
{
  FILE *source, *target;
  int i;

  source = fopen(file_path, "rb");

  if (source == NULL)
  {
    printf("cannot open read file\n");
    return 1;
  }

  fseek(source, 0, SEEK_END);
  int length = ftell(source);

  fseek(source, 0, SEEK_SET);
  
  target = fopen("newfile", "wb");

  if (target == NULL)
  {
    printf("cannot open write file\n");
    fclose(source);
    return 1;
  }

  for (i = 0; i < length; i++)
  {
    fputc(fgetc(source), target);
  }

  fclose(source);
  fclose(target);

  add_indexedDB();
  edit_DOM();

  return 0;
}
