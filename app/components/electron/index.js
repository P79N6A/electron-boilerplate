// @flow
import React, { Component } from 'react';
import styles from './index.css';
import { Button, Icon, message } from 'antd';


type Props = {};

export default class Electron extends Component<Props> {
  props: Props;

  componentDidMount() {
    
  }

  clickHandle = () => {
    message.success('click');
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
            Button
          </Button>
        </div>
      </div>
    );
  }
}
