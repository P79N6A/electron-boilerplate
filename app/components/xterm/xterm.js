// @flow
import fs from 'fs-extra';
import os from 'os';
import path from 'path';

import React, { Component } from 'react';
import styles from './xterm.css';
import * as fit from 'xterm/lib/addons/fit/fit';
import { Button, Icon, Select, Row, Col, Tabs, message } from 'antd';
import delay from 'delay';
import { Terminal } from 'xterm';
import * as pty from 'node-pty-prebuilt';
import init_fe from './api/init_fe.js'

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
    if (process.env.NODE_ENV == 'development') {
      //加上setTimeout为了解决dev环境下大小没法控制的bug 线上环境不用
      setTimeout(() => {
        this.initTerminal();
      }, 500);
    } else {
      this.initTerminal();
    }
    //hack各种问题
    setTimeout(() => {
      //自动对焦
      xterm.focus();

      //解决编译打包后 mac的中文乱码问题 mmp
      if (isWin) {
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

  clickOperator = async () => {
    message.success(os.homedir());
  }

  // gotoPath = async () => {
  //   let tmpPath = path.join(tmpdir, 'tmp.txt');
  //   //用shell获取路径 打入tmp.txt文件 解决pty.on('data')乱码不确定性问题  适配win和mac
  //   if (isWin) {
  //     ptyProcess.write(`echo %cd% > ${tmpPath}\r`);//windows
  //   } else {
  //     ptyProcess.write(`pwd > ${tmpPath}\r`);//mac
  //   }
  //   await delay(300);
  //   let realPath = await fs.readFileSync(tmpPath);
  //   realPath = realPath.toString();
  //   //刚获取到的路径字符串 最后一个字符是个换行 要去掉 
  //   realPath = realPath.substring(0, realPath.length - 1);
  //   message.success('realPath' + realPath);
  // }

  getTernimalPath = async () => {
    let tmpPath = path.join(tmpdir, 'tmp.txt');
    //用shell获取路径 打入tmp.txt文件 解决pty.on('data')乱码不确定性问题  适配win和mac
    if (isWin) {
      ptyProcess.write(`echo %cd% > ${tmpPath}\r`);//windows
    } else {
      ptyProcess.write(`pwd > ${tmpPath}\r`);//mac
    }
    await delay(300);
    let realPath = await fs.readFileSync(tmpPath);
    realPath = realPath.toString();
    //刚获取到的路径字符串 最后一个字符是个换行 要去掉 
    realPath = realPath.substring(0, realPath.length - 1);
    //windows下会出现很多奇怪的字符:多出来的空格 和换行  兼容它 盘它
    if (isWin) {
      realPath = realPath.replace(/\\/g, '/')//将windows下所有的\替换成/  要不然路径全部不对
      realPath = realPath.replace(/ /g, '')//将windows下所有的空格去掉
      realPath = realPath.replace(/\r/g, '')
      realPath = realPath.replace(/\n/g, '')
    }
    return realPath;
  }

  initProjectFE = async () => {
    let pathTerminal = await this.getTernimalPath();
    await init_fe(pathTerminal, 'FEProject', ptyProcess);
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
            onClick={this.initProjectFE}
          >
            创建前端项目
          </Button>
          <Button
            type="primary"
            className={styles.btn_css}
            onClick={this.clickOperator}
          >
            操作
          </Button>
          {/* <Button
            type="primary"
            className={styles.btn_css}
            onClick={this.gotoPath}
          >
            获取terminal的当前路径
          </Button> */}
        </div>
      </div>
    );
  }
}
