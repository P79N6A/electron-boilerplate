// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes';
import styles from './Home.css';
import * as fit from 'xterm/lib/addons/fit/fit';

let os = require('os');
let pty = require('node-pty-prebuilt');
let Terminal = require('xterm').Terminal;

Terminal.applyAddon(fit);

// let shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';//本地调试用这个
const shell = process.env[os.platform() === 'win32' ? 'COMSPEC' : 'SHELL'];//线上用这个

const ptyProcess = pty.spawn(shell, [], {
  name: 'xterm-color',
  cols: 80,
  rows: 30,
  cwd: process.cwd(),
  env: process.env
});
const xterm = new Terminal({
  // cols: 120,
  // rows: 24,
  cursorBlink: 5,
  tabStopWidth: 4,
  scrollback: 3000,
  rightClickSelectsWord: false,
  fontFamily: 'mono, courier-new, courier, monospace',
  fontSize: 16
});


type Props = {};

export default class Home extends Component<Props> {
  props: Props;

  componentDidMount() {
    this.initTerminal();
  }

  initTerminal() {
    xterm.open(this.refs.xterm);
    xterm.on('data', (data) => {
      ptyProcess.write(data);
    });
    ptyProcess.on('data', function (data) {
      xterm.write(data);
    });
    xterm.fit();

    setTimeout(() => {
      //隐藏掉自动多余出来的textarea 是个bug
      // document.getElementsByClassName("xterm-helpers")[0].style.opacity = 0;
      //解决内容输出超过一屏的时候的分屏bug
      // document.getElementsByClassName("xterm-viewport")[0].style.display = 'none';
    }, 300);
  }

  render() {
    return (
      <div className={styles.container} data-tid="container">
        <h2>LEAH-CLI</h2>
        {/* <div>{process.cwd()}</div> */}
        <Link to={routes.COUNTER}>to Counter66</Link>
        <div className='' ref="xterm"></div>
      </div>
    );
  }
}
