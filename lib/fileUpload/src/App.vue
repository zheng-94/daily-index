<template>
  <div id="app">
    <div>
      <input
        type="file"
        :disabled="status !== Status.wait"
        @change="handleFileChange"
      />
      <el-button :disabled="uploadDisabled" @click="handleTranCode"
        >转码</el-button
      >
      <el-button :disabled="uploadDisabled" @click="handleUpload"
        >上传</el-button
      >
      <el-button
        v-if="status !== Status.pause"
        :disabled="status !== Status.uploading || !container.hash"
        @click="handlePause"
      >
        暂停
      </el-button>
      <el-button v-else @click="handleResume">恢复</el-button>
    </div>
    <div>
      <div>文件转码</div>
      <el-progress :percentage="decodePercentage"></el-progress>
      <div>计算文件 hash</div>
      <el-progress :percentage="hashPercentage"></el-progress>
      <div>总进度</div>
      <el-progress :percentage="fakeUploadPercentage"></el-progress>
    </div>
    <el-table :data="data">
      <el-table-column
        prop="hash"
        label="切片hash"
        align="center"
      ></el-table-column>
      <el-table-column label="大小(KB)" align="center" width="120">
        <template v-slot="{ row }">
          {{ row.size | transformByte }}
        </template>
      </el-table-column>
      <el-table-column label="进度" align="center">
        <template v-slot="{ row }">
          <el-progress
            :percentage="row.percentage"
            color="#909399"
          ></el-progress>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
const SIZE = 10 * 1024 * 1024; // 切片大小

const Status = {
  wait: "wait",
  pause: "pause",
  uploading: "uploading",
};

import { createFFmpeg } from "@ffmpeg/ffmpeg";

export default {
  name: "app",
  filters: {
    transformByte(val) {
      return Number((val / 1024).toFixed(0));
    },
  },
  data: () => ({
    Status,

    container: {
      file: null,
      hash: "",
      worker: null,
    },
    decodePercentage: 0, // 转码进度条
    hashPercentage: 0, // 计算hash 进度条
    data: [],
    requestList: [],
    status: Status.wait,
    // 当暂停时会取消 xhr 导致进度条后退
    // 为了避免这种情况，需要定义一个假的进度条
    fakeUploadPercentage: 0,
  }),
  computed: {
    uploadDisabled() {
      return (
        !this.container.file ||
        [Status.pause, Status.uploading].includes(this.status)
      );
    },
    uploadPercentage() {
      if (!this.container.file || !this.data.length) return 0;
      const loaded = this.data
        .map((item) => item.size * item.percentage)
        .reduce((acc, cur) => acc + cur);
      return parseInt((loaded / this.container.file.size).toFixed(2));
    },
  },
  watch: {
    uploadPercentage(now) {
      if (now > this.fakeUploadPercentage) {
        this.fakeUploadPercentage = now;
      }
    },
  },
  methods: {
    // handle 文件转码
    async handleTranCode() {
      // util 获取二进制数组
      const getArrayBuffer = (file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.readAsArrayBuffer(file);
          reader.onload = () => {
            const arrayBuffer = reader.result;
            const bytes = new Uint8Array(arrayBuffer);
            resolve(bytes);
          };
        });
      };

      // util bolb转成file
      const blobToFile = (theBlob, fileName) => {
        theBlob.lastModifiedDate = new Date();
        theBlob.name = fileName;
        return theBlob;
      }

      const ffmpeg = createFFmpeg({
        log: false,
        progress: ({ ratio }) => {
          this.decodePercentage = Math.round(ratio * 10000) / 100;
        },
      });

      const fileName = this.container.file.name;
      const fileBuffer = await getArrayBuffer(this.container.file);

      await ffmpeg.load();

      ffmpeg.FS("writeFile", fileName, fileBuffer);

      await ffmpeg.run("-i", fileName, "output.mp4");

      const data = ffmpeg.FS("readFile", "output.mp4");

      this.container.file = blobToFile(new Blob([data.buffer], { type: "video/mp4" }), fileName)
    },
    // handle 暂停上传
    handlePause() {
      this.status = Status.pause;
      this.resetData();
    },
    resetData() {
      this.requestList.forEach((xhr) => xhr?.abort());
      this.requestList = [];
      if (this.container.worker) {
        this.container.worker.onmessage = null;
      }
    },
    // handle 恢复上传
    async handleResume() {
      this.status = Status.uploading;
      const { uploadedList } = await this.verifyUpload(
        this.container.file.name,
        this.container.hash
      );
      await this.uploadChunks(uploadedList);
    },
    // xhr
    request({
      url,
      method = "post",
      data,
      headers = {},
      onProgress = (e) => e,
      requestList,
    }) {
      return new Promise((resolve) => {
        const xhr = new XMLHttpRequest();
        xhr.upload.onprogress = onProgress;
        xhr.open(method, url);
        Object.keys(headers).forEach((key) =>
          xhr.setRequestHeader(key, headers[key])
        );
        xhr.send(data);
        xhr.onload = (e) => {
          // 将请求成功的 xhr 从列表中删除
          if (requestList) {
            const xhrIndex = requestList.findIndex((item) => item === xhr);
            requestList.splice(xhrIndex, 1);
          }
          resolve({
            data: e.target.response,
          });
        };
        // 暴露当前xhr给外部
        requestList?.push(xhr);
      });
    },
    // 生成文件切片
    createFileChunk(file, size = SIZE) {
      const fileChunkList = [];
      let cur = 0;
      while (cur < file.size) {
        fileChunkList.push({ file: file.slice(cur, cur + size) });
        cur += size;
      }
      return fileChunkList;
    },
    // 生成文件 hash（web-worker）
    calculateHash(fileChunkList) {
      return new Promise((resolve) => {
        this.container.worker = new Worker("/hash.js");
        this.container.worker.postMessage({ fileChunkList });
        this.container.worker.onmessage = (e) => {
          const { percentage, hash } = e.data;
          this.hashPercentage = percentage;
          if (hash) {
            resolve(hash);
          }
        };
      });
    },
    // 上传切片
    async uploadChunks(uploadedList = []) {
      const requestList = this.data
        .filter(({ hash }) => !uploadedList.includes(hash))
        .map(({ chunk, hash, index }) => {
          const formData = new FormData();
          formData.append("chunk", chunk);
          formData.append("hash", hash);
          formData.append("filename", this.container.file.name);
          formData.append("fileHash", this.container.hash);
          return { formData, index };
        })
        .map(async ({ formData, index }) =>
          this.request({
            url: "http://localhost:3000",
            data: formData,
            onProgress: this.createProgressHandler(this.data[index]),
            requestList: this.requestList,
          })
        );
      await Promise.all(requestList);
      // 之前上传的切片数量 + 本次上传的切片数量 = 所有切片数量时
      // 合并切片
      if (uploadedList.length + requestList.length === this.data.length) {
        await this.mergeRequest();
      }
    },
    // 通知服务端合并切片
    async mergeRequest() {
      await this.request({
        url: "http://localhost:3000/merge",
        headers: {
          "content-type": "application/json",
        },
        data: JSON.stringify({
          size: SIZE,
          fileHash: this.container.hash,
          filename: this.container.file.name,
        }),
      });
      this.$message.success("上传成功");
      this.status = Status.wait;
    },
    // handle 选择文件
    handleFileChange(e) {
      const [file] = e.target.files;
      if (!file) return;
      this.resetData();
      Object.assign(this.$data, this.$options.data());
      this.container.file = file;
    },
    // 根据 hash 验证文件是否曾经已经被上传过
    // 没有才进行上传
    async verifyUpload(filename, fileHash) {
      const { data } = await this.request({
        url: "http://localhost:3000/verify",
        headers: {
          "content-type": "application/json",
        },
        data: JSON.stringify({
          filename,
          fileHash,
        }),
      });
      return JSON.parse(data);
    },
    // handle 上传
    async handleUpload() {
      if (!this.container.file) return;
      const fileChunkList = this.createFileChunk(this.container.file);
      this.container.hash = await this.calculateHash(fileChunkList);

      const { shouldUpload, uploadedList } = await this.verifyUpload(
        this.container.file.name,
        this.container.hash
      );
      if (!shouldUpload) {
        this.$message.success("秒传：上传成功");
        this.status = Status.wait;
        return;
      }

      this.data = fileChunkList.map(({ file }, index) => ({
        fileHash: this.container.hash,
        index,
        hash: this.container.hash + "-" + index, // 文件名 + 数组下标
        chunk: file,
        size: file.size,
        percentage: uploadedList.includes(index) ? 100 : 0,
      }));

      await this.uploadChunks(uploadedList);
    },
    // 用闭包保存每个 chunk 的进度数据
    createProgressHandler(item) {
      return (e) => {
        item.percentage = parseInt(String((e.loaded / e.total) * 100));
      };
    },
  },
};
</script>

<style></style>
