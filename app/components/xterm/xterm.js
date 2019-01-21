// @flow
import React, { Component } from 'react';
import styles from './xterm.css';
import * as fit from 'xterm/lib/addons/fit/fit';
import { Button, Icon, Select, Row, Col, Tabs, message } from 'antd';
import fs from 'fs-extra';
import os from 'os';
import delay from 'delay';
import path from 'path';
import { Terminal } from 'xterm';
import * as pty from 'node-pty-prebuilt';

const isWin = os.platform() === 'win32' ? true : false;
const homedir = os.homedir();
const tmpdir = os.tmpdir();

Terminal.applyAddon(fit);

// const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';//本地调试用这个
const shell = process.env[os.platform() === 'win32' ? 'COMSPEC' : 'SHELL']; //线上用这个

const ptyProcess = pty.spawn(shell, [], {
  name: 'xterm-color',
  cols: 80,
  rows: 30,
  cwd: process.cwd(),
  env: process.env
});
const xterm = new Terminal({
  cols: 80,
  rows: 25,
  cursorBlink: 5,
  tabStopWidth: 4,
  scrollback: 1000,
  rightClickSelectsWord: false,
  fontFamily: 'mono, courier-new, courier, monospace',
  fontSize: 16
});

type Props = {};

export default class Xterm extends Component<Props> {
  props: Props;

  componentDidMount() {
    //hack各种问题
    this.hackBug();
  }

  hackBug = () => {
    if (  process.env.NODE_ENV == 'development' ) {
      //加上setTimeout为了解决dev环境下大小没法控制的bug 线上环境不用
      setTimeout(() => {
        this.initTerminal();
      }, 10);
    } else {
      this.initTerminal();
    }
    //hack各种问题
    setTimeout(()=>{
      //自动对焦
      xterm.focus();

      //解决编译打包后 mac的中文乱码问题 mmp
      if ( isWin ) {
        // 兼容windows乱码问题 懒 不想弄了 mmp
        // 问题描述：windows显示的时候支持 但是message.success的时候不支持 mmp 但是可以忍受 算是好的 因为内部实现不需要放出来看到
      } else {
        ptyProcess.write(`export LC_ALL=zh_CN.UTF-8\r`);//mac
        ptyProcess.write(`clear\r`);//mac
      }
    }, 1000);
  }

  initTerminal() {
    xterm.open(this.refs.xterm);
    xterm.on('data', data => {
      ptyProcess.write(data);
    });
    ptyProcess.on('data', (data) => {
      xterm.write(data);
    });
    xterm.fit();
  }

  clickHandle = () => {
    console.log('click');
  }

  clickOperator = async () => {
    message.success(os.homedir());
  }

  gotoPath = async () => {
    let tmpPath = path.join(tmpdir, 'tmp.txt');
    //用shell获取路径 打入tmp.txt文件 解决pty.on('data')乱码不确定性问题  适配win和mac
    if ( isWin ) {
      ptyProcess.write(`echo %cd% > ${tmpPath}\r`);//windows
    } else {
      ptyProcess.write(`pwd > ${tmpPath}\r`);//mac
    }
    await delay(300);
    let realPath = await fs.readFileSync(tmpPath)
    message.success('realPath' + realPath.toString());
  }

  render() {
    return (
      <div className="">
        <div className={styles.container} data-tid="container">
          <h2>LEAH-CLI</h2>
          <div className="" ref="xterm" />
        </div>
        <div className="">
          <Button
            type="primary"
            className={styles.btn_css}
            onClick={this.gotoPath}
          >
            获取terminal的当前路径
          </Button>
          <Button
            type="primary"
            className={styles.btn_css}
            onClick={this.clickOperator}
          >
            操作
          </Button>
          <Button
            type="primary"
            className={styles.btn_css}
            onClick={this.clickHandle}
          >
            创建页面
          </Button>
          <Button
            type="primary"
            className={styles.btn_css}
            onClick={this.clickHandle}
          >
            代理网络
          </Button>
          <Button
            type="primary"
            className={styles.btn_css}
            onClick={this.clickHandle}
          >
            自动切图
          </Button>
          <Button
            type="primary"
            className={styles.btn_css}
            onClick={this.clickHandle}
          >
            创建目录
          </Button>
          <Button
            type="primary"
            className={styles.btn_css}
            onClick={this.clickHandle}
          >
            自动发布
          </Button>
          <Button
            type="primary"
            className={styles.btn_css}
            onClick={this.clickHandle}
          >
            创建项目
          </Button>
          <Button
            type="primary"
            className={styles.btn_css}
            onClick={this.clickHandle}
          >
            创建页面
          </Button>
          <Button
            type="primary"
            className={styles.btn_css}
            onClick={this.clickHandle}
          >
            代理网络
          </Button>
          <Button
            type="primary"
            className={styles.btn_css}
            onClick={this.clickHandle}
          >
            自动切图
          </Button>
          <Button
            type="primary"
            className={styles.btn_css}
            onClick={this.clickHandle}
          >
            创建目录
          </Button>
          <Button
            type="primary"
            className={styles.btn_css}
            onClick={this.clickHandle}
          >
            自动发布
          </Button>
        </div>
      </div>
    );
  }
}







// //解决中文乱码的问题： https://github.com/tsl0922/ttyd/blob/1.3.3/html/js/utf8.js
// let UTF8Decoder = function() {
//   this.bytesLeft = 0;
//   this.codePoint = 0;
//   this.lowerBound = 0;
// };

// UTF8Decoder.prototype.decode = function(str) {
//   var ret = '';
//   for (var i = 0; i < str.length; i++) {
//       var c = str.charCodeAt(i);
//       if (this.bytesLeft == 0) {
//           if (c <= 0x7F) {
//               ret += str.charAt(i);
//           } else if (0xC0 <= c && c <= 0xDF) {
//               this.codePoint = c - 0xC0;
//               this.bytesLeft = 1;
//               this.lowerBound = 0x80;
//           } else if (0xE0 <= c && c <= 0xEF) {
//               this.codePoint = c - 0xE0;
//               this.bytesLeft = 2;
//               this.lowerBound = 0x800;
//           } else if (0xF0 <= c && c <= 0xF7) {
//               this.codePoint = c - 0xF0;
//               this.bytesLeft = 3;
//               this.lowerBound = 0x10000;
//           } else if (0xF8 <= c && c <= 0xFB) {
//               this.codePoint = c - 0xF8;
//               this.bytesLeft = 4;
//               this.lowerBound = 0x200000;
//           } else if (0xFC <= c && c <= 0xFD) {
//               this.codePoint = c - 0xFC;
//               this.bytesLeft = 5;
//               this.lowerBound = 0x4000000;
//           } else {
//               ret += '\ufffd';
//           }
//       } else {
//           if (0x80 <= c && c <= 0xBF) {
//               this.bytesLeft--;
//               this.codePoint = (this.codePoint << 6) + (c - 0x80);
//               if (this.bytesLeft == 0) {
//                   var codePoint = this.codePoint;
//                   if (codePoint < this.lowerBound
//                       || (0xD800 <= codePoint && codePoint <= 0xDFFF)
//                       || codePoint > 0x10FFFF) {
//                       ret += '\ufffd';
//                   } else {
//                       if (codePoint < 0x10000) {
//                           ret += String.fromCharCode(codePoint);
//                       } else {
//                           codePoint -= 0x10000;
//                           ret += String.fromCharCode(
//                               0xD800 + ((codePoint >>> 10) & 0x3FF),
//                               0xDC00 + (codePoint & 0x3FF));
//                       }
//                   }
//               }
//           } else {
//               ret += '\ufffd';
//               this.bytesLeft = 0;
//               i--;
//           }
//       }
//   }
//   return ret;
// };

// Terminal.prototype.decodeUTF8 = function(str) {
//   return (new UTF8Decoder()).decode(str);
// };

// Terminal.prototype.encodeUTF8 = function(str) {
//   var ret = '';
//   for (var i = 0; i < str.length; i++) {
//       var c = str.charCodeAt(i);
//       if (0xDC00 <= c && c <= 0xDFFF) {
//           c = 0xFFFD;
//       } else if (0xD800 <= c && c <= 0xDBFF) {
//           if (i+1 < str.length) {
//               var d = str.charCodeAt(i+1);
//               if (0xDC00 <= d && d <= 0xDFFF) {
//                   c = 0x10000 + ((c & 0x3FF) << 10) + (d & 0x3FF);
//                   i++;
//               } else {
//                   c = 0xFFFD;
//               }
//           } else {
//               c = 0xFFFD;
//           }
//       }
//       var bytesLeft;
//       if (c <= 0x7F) {
//           ret += str.charAt(i);
//           continue;
//       } else if (c <= 0x7FF) {
//           ret += String.fromCharCode(0xC0 | (c >>> 6));
//           bytesLeft = 1;
//       } else if (c <= 0xFFFF) {
//           ret += String.fromCharCode(0xE0 | (c >>> 12));
//           bytesLeft = 2;
//       } else {
//           ret += String.fromCharCode(0xF0 | (c >>> 18));
//           bytesLeft = 3;
//       }
//       while (bytesLeft > 0) {
//           bytesLeft--;
//           ret += String.fromCharCode(0x80 | ((c >>> (6 * bytesLeft)) & 0x3F));
//       }
//   }
//   return ret;
// };

// Terminal.prototype.writeUTF8 = function (str) {
//   this.write(this.decodeUTF8(str));
// };
