// @flow
import React, { Component } from 'react';
import styles from './function.css';
import { Button, Icon, message } from 'antd';
import shell from 'shelljs'
import { exec } from 'child_process'
import fs from 'fs-extra'
import util from 'util'


type Props = {};

export default class Function extends Component<Props> {
  props: Props;

  componentDidMount() {
    
  }

  handleFsExtra = async () => {
    //判断某个目录和文件是否存在
    let exist = await fs.pathExists('/Users/airuikun/Desktop/project/technology/electron-1/bb');
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
          
        </div>
      </div>
    );
  }
}
