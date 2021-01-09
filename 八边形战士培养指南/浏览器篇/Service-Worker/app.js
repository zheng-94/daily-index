const fs = require("fs");
const path = require("path");
const Koa = require("koa");

const app = new Koa();

// log request URL:
app.use(async (ctx, next) => {
  console.log(`${ctx.request.method} ${ctx.request.url}`); // 打印URL
  await next(); // 调用下一个middleware
});

app.use((ctx) => {
  ctx.set("Cache-Control", "max-age=86400");

  const url = ctx.url == "/" ? "/index.html" : ctx.url;
  const fileType = path.extname(url).slice(1);

  switch (fileType) {
    case "html":
      ctx.response.type = "html";
      ctx.response.body = fs.createReadStream("index.html");
      break;
    case "js":
      ctx.response.type = "script";
      if (ctx.url.includes("sw.js")) {
        ctx.response.body = fs.createReadStream("static/sw.js");
      } else {
        ctx.response.body = fs.createReadStream("static/index.js");
      }
      break;
    case "jpg":
      ctx.response.type = "image/jpg";
      ctx.response.body = fs.createReadStream("static/index.jpg");
      break;
    default:
      ctx.response.body = "文件不存在";
      break;
  }
});

app.listen(3000);
console.log("app started at port 3000...");
