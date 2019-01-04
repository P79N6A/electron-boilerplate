// @flow
import React, { Component } from 'react';
import styles from './function.css';
import { Button, Icon } from 'antd';


type Props = {};

export default class Function extends Component<Props> {
  props: Props;

  componentDidMount() {
    
  }


  clickHandle = () => {
    console.log('click');
  };

  render() {
    return (
      <div className="">
        <div className={styles.container} data-tid="container">
          <h2>Page</h2>
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
