# C与js交互通信

## js->c

- 调用函数：利用EMSCRIPTEN_KEEPALIVE，例子: demo.c 中的setFile()
- 传递file：利用内存和File System API，例子：demo.html 中的process()

## c->js
利用内存和指针传递数据，js-library来实现通信。

具体做法：将结构体数据的指针作为参数，调用send_packet_ptr_to_web()即可

后续：js通信c释放内存还没做，但这个可以to be continced

