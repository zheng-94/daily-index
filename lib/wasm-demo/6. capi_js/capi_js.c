extern int js_add(int a, int b);
extern void js_console_log_int(int param);

int print_the_answer(char *file_path)
{
    int i = js_add(21, 21);
    js_console_log_int(i);
}
