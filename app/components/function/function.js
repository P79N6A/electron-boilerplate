// @flow
import React, { Component } from 'react';
import styles from './function.css';
import { Button, Icon, message } from 'antd';
import shell from 'shelljs'
import { exec } from 'child_process'
import fs from 'fs-extra'
import util from 'util'
import path from 'path';
import ii from '../../assets/ilogo.png'

import { remote } from 'electron';

const app = remote.app;
const dialog = remote.dialog;



type Props = {};

export default class Function extends Component<Props> {
  props: Props;

  componentDidMount() {
    
  }

  handleFsExtra = async () => {
    //判断某个目录和文件是否存在
    let exist = await fs.pathExists('/Users/airuikun/Desktop/project/technology/electron-1/bb.txt');
    message.success(exist.toString());
  }

  
  handleShelljs = async () => {
    // shelljs的exec用不了 config.execPath路径有问题
		// exec  cd 都用不了
		// which echo可以用
    message.success(shell.which('node').toString());
  }

  handleCwdDirname = async () => {
    message.success(process.cwd() + "||" + __dirname);
  }

  handleExec = async () => {
    const execPromise = util.promisify(exec);
    await execPromise('open .');
  }

  testPath = () => {
    
    let ppath;
    if (  process.env.NODE_ENV == 'development' ) {
      ppath = path.join(__dirname, '/assets/test.txt')
    } else {
      ppath = path.join(app.getAppPath(), 'assets/test.txt');
    }

    fs.readFile(ppath, (err, data) => {
      if ( err ) {
        message.error(err.toString());
        return;
      }

      message.info(ppath);
      message.success(data.toString());
    });
  }

  nodeEnv = () => {
    message.success(process.env.NODE_ENV);
  }

  render() {
    return (
      <div className="">
        <div className={styles.container} data-tid="container">
          <h2>node模块功能</h2>
        </div>
        <div className="">
          <Button
            type="primary"
            className={styles.btn_css}
            onClick={this.handleFsExtra}
          >
            fs-extra
          </Button>
          <Button
            type="primary"
            className={styles.btn_css}
            onClick={this.handleShelljs}
          >
            shelljs
          </Button>
          <Button
            type="primary"
            className={styles.btn_css}
            onClick={this.handleCwdDirname}
          >
            process.cwd + __dirname
          </Button>
          <Button
            type="primary"
            className={styles.btn_css}
            onClick={this.handleExec}
          >
            child_process.exec
          </Button>
          <Button
            type="primary"
            className={styles.btn_css}
            onClick={this.nodeEnv}
          >
            环境变量NODE_ENV
          </Button>
          <Button
            type="primary"
            className={styles.btn_css}
            onClick={this.testPath}
          >
            测试打包编译后的路径<img src={ii} />
          </Button>
          
        </div>
      </div>
    );
  }
}
