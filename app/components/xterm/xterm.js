// @flow
import React, { Component } from 'react';
import styles from './xterm.css';
import * as fit from 'xterm/lib/addons/fit/fit';
import { Button, Icon, Select, Row, Col, Tabs } from 'antd';

let os = require('os');
let pty = require('node-pty-prebuilt');
let Terminal = require('xterm').Terminal;

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
    if (  process.env.NODE_ENV == 'development' ) {
      //加上setTimeout为了解决dev环境下大小没法控制的bug
      setTimeout(() => {
        this.initTerminal();
      }, 10);
    } else {
      this.initTerminal();
    }
  }

  initTerminal() {
    xterm.open(this.refs.xterm);
    xterm.on('data', data => {
      ptyProcess.write(data);
    });
    ptyProcess.on('data', function(data) {
      xterm.write(data);
    });
    xterm.fit();
  }

  clickHandle = () => {
    console.log('click');
  };

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
