import React, { useState } from "react";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import "./App.css";

const CODECS = [
  "av1",
  "avc",
  "h264",
  "h263",
  "hevc",
  "h265",
  "mp4v-es",
  "mpeg-1",
  "mpeg-2",
  "theora",
  "p8",
  "p9",
];

const CODES_ERROR_TIP =
  "文件视频编码错误，不能直接播放，是否用不要钱的转码播放服务？（注意：文件越大越久）";

const fileName = 'demo-heiping.mp4'
// const fileName = "demo-bofangcuowu.mp4";
// const fileName = "demo.flv";

function App() {
  const [videoSrc, setVideoSrc] = useState("/demo-heiping.mp4"); // 视频地址
  const [right, setRight] = useState(true); // 是否可播放
  const [rate, setRate] = useState(0); // 转码进度 0->1
  const [message, setMessage] = useState(""); // 提示信息

  // ffmpeg 相关配置
  const ffmpeg = createFFmpeg({
    log: false,
    logger: ({ type, message }) => {
      console.log(type, message);
      if (type === "fferr" && message.includes("Stream #0:0")) {
        console.log(message);
        
        // if (message.match(/Stream #0:0 ->/)) {
        //   setMessage(CODES_ERROR_TIP);
        //   return;
        // }

        const codecInfo = message.match(/Video: .+?,/)[0];

        const find = CODECS.find((codes) => {
          return codecInfo.includes(codes);
        });

        setRight(Boolean(find));

        if (find) {
          setMessage("可以播");
          // setVideoSrc(`/${fileName}`);
        } else {
          setMessage(CODES_ERROR_TIP);
        }
      }
    },
    progress: ({ ratio }) => {
      setRate(ratio.toFixed(4));
    },
  });

  // 获取信息
  const getInfo = async () => {
    setMessage("正在加载 ffmpeg-core.js");
    await ffmpeg.load();

    setMessage("正在分析中...");

    ffmpeg.FS("writeFile", fileName, await fetchFile(`/${fileName}`));

    await ffmpeg.run("-i", fileName);
  };
  // 转码
  const doTranscode = async () => {
    setMessage("正在加载 ffmpeg-core.js");
    await ffmpeg.load();

    setMessage("开始转码");

    ffmpeg.FS("writeFile", fileName, await fetchFile(`/${fileName}`));

    await ffmpeg.run("-i", fileName, "test.mp4");

    setMessage("转码完成");

    const data = ffmpeg.FS("readFile", "test.mp4");
    setVideoSrc(
      URL.createObjectURL(new Blob([data.buffer], { type: "video/mp4" }))
    );
  };
  return (
    <div className="App">
      <br />
      <video src={videoSrc} controls></video>
      <br />
      <button style={{ marginRight: "10px" }} onClick={getInfo}>
        获取信息
      </button>
      <br />
      {[0, 1].includes(rate) && (
        <p>{message}</p>
      )}      
      {!right && <button onClick={doTranscode}>转码</button>}
      {![0, 1].includes(rate) && (
        <p>转码进度：{(rate * 100).toPrecision(4)}%</p>
      )}
    </div>
  );
}

export default App;
