// @flow
import React, { Component } from 'react';
import styles from './index.css';
import { Button, Icon, message } from 'antd';
import { ipcRenderer, shell, remote, desktopCapturer, screen } from 'electron';
import path from 'path';
import os from 'os';
import fs from 'fs';

const dialog = remote.dialog;
const app = remote.app;

ipcRenderer.on('reply-msg', (event, arg) => {
  message.success('主进程回复的消息为：' + arg);
});

type Props = {};

export default class Electron extends Component<Props> {
  props: Props;

  componentDidMount() {}

  clickHandle = () => {
    dialog.showOpenDialog(
      { properties: ['openFile', 'openDirectory'] },
      filename => {
        message.success('您选中的文件夹路径为：' + filename[0]);
      }
    );
  };

  sendMes = () => {
    //发送消息
    ipcRenderer.send('send-msg', '你好主进程');
  };

  openUrl = () => {
    //发送消息
    shell.openExternal('https://electronjs.org/');
  };

  notification = () => {
    const msgNote = {
      title: '基本通知',
      body: '简短的通知内容',
      icon: path.join(__dirname, '/assets/ilogo.png')
    };
    const note = new window.Notification(msgNote.title, msgNote);
    note.onclick = () => {
      message.success('通知被点击');
    };
  };

  system = () => {
    ipcRenderer.send('select-file-main');
  };

  error = () => {
    dialog.showErrorBox('一条错误信息', '错误消息演示');
  };

  dialogK = () => {
    const options = {
      type: 'info',
      title: '信息',
      message: '对话框',
      buttons: ['是', '否']
    };
    dialog.showMessageBox(options, index => {
      message.success('选择了' + index);
    });
  };

  tishi = () => {
    const options = {
      type: 'info',
      title: '信息',
      message: '提示框'
    };
    dialog.showMessageBox(options);
  };

  information = () => {
    const a = 'electron版本号：' + process.versions.electron + '\n';
    const b = '系统主目录：' + os.homedir() + '\n';
    const c = 'APP路径：' + app.getAppPath() + '\n';

    const options = {
      type: 'info',
      title: '系统信息',
      message: a + b + c
    };
    dialog.showMessageBox(options);
  };

  capture = () => {
    const thumbSize = determineScreenShotSize();
    let options = { types: ['screen'], thumbnailSize: thumbSize };

    desktopCapturer.getSources(options, function(error, sources) {
      if (error) return console.log(error);
      sources.forEach(function(source) {
        if (source.name === 'Entire screen' || source.name === 'Screen 1') {
          const screenshotPath = path.join(os.tmpdir(), 'screenshot.png');
          fs.writeFile(screenshotPath, source.thumbnail.toPNG(), function(
            error
          ) {
            if (error) return console.log(error);
            shell.openExternal('file://' + screenshotPath);
            const msg = `截图保存到: ${screenshotPath}`;
            // message.success(msg);
            const options = {
              type: 'info',
              title: '系统信息',
              message: `截图保存到: ${screenshotPath}`
            };
            dialog.showMessageBox(options);
          });
        }
      });
    });

    function determineScreenShotSize() {
      const screenSize = screen.getPrimaryDisplay().workAreaSize;
      const maxDimension = Math.max(screenSize.width, screenSize.height);
      return {
        width: maxDimension * window.devicePixelRatio,
        height: maxDimension * window.devicePixelRatio
      };
    }

  };

  testPath = () => {
    const testP = path.join(__dirname, '/assets/test.txt')
    fs.readFile(testP, (err, data) => {
      message.success(data.toString());
    });
  }

  render() {
    return (
      <div className="">
        <div className={styles.container} data-tid="container">
          <h2>Electron功能</h2>
        </div>
        <div className="">
          <Button
            type="primary"
            className={styles.btn_css}
            onClick={this.clickHandle}
          >
            打开文件管理器
          </Button>
          <Button
            type="primary"
            className={styles.btn_css}
            onClick={this.sendMes}
          >
            主进程和渲染进程通信
          </Button>
          <Button
            type="primary"
            className={styles.btn_css}
            onClick={this.openUrl}
          >
            用默认浏览器打开url(也可以打开文件file://)
          </Button>
          <Button
            type="primary"
            className={styles.btn_css}
            onClick={this.notification}
          >
            系统通知
          </Button>
          <Button
            type="primary"
            className={styles.btn_css}
            onClick={this.system}
          >
            控制主进程打开文件管理器
          </Button>
          <Button
            type="primary"
            className={styles.btn_css}
            onClick={this.error}
          >
            打开错误提示框
          </Button>
          <Button
            type="primary"
            className={styles.btn_css}
            onClick={this.dialogK}
          >
            对话框
          </Button>
          <Button
            type="primary"
            className={styles.btn_css}
            onClick={this.tishi}
          >
            提示框
          </Button>
          <Button
            type="primary"
            className={styles.btn_css}
            onClick={this.information}
          >
            获取系统信息
          </Button>
          <Button
            type="primary"
            className={styles.btn_css}
            onClick={this.testPath}
          >
            测试打包编译后的路径
          </Button>
          <Button
            type="primary"
            className={styles.btn_css}
            onClick={this.capture}
          >
            截图
          </Button>
        </div>
      </div>
    );
  }
}
