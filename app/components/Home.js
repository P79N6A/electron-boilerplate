// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes';
import styles from './Home.css';
import { Button, Icon, Select, Row, Col, Tabs } from 'antd';
import Xterm from './xterm/xterm.js';
import Function from './function/function.js';
import Template from './template/index.js';
import Electron from './electron/index.js';
const TabPane = Tabs.TabPane;

type Props = {};

export default class Home extends Component<Props> {
  props: Props;

  componentDidMount() {}

  render() {
    return (
      <div className="home_wrap">
        <div className="">
          <div className={styles.logo}>LEAH</div>
          <Tabs defaultActiveKey="1" tabPosition={'left'}>
            <TabPane
              tab={
                <div className="">
                  <Icon type="radar-chart" />
                  <div className={styles.icon_st1}>终端</div>
                </div>
              }
              key="1"
            >
              <Xterm />
            </TabPane>
            <TabPane
              tab={
                <div className="">
                  <Icon type="switcher" />
                  <div className={styles.icon_st2}>node</div>
                </div>
              }
              key="2"
            >
              <Function />
            </TabPane>
            <TabPane
              tab={
                <div className="">
                  <Icon type="box-plot" />
                  <div className={styles.icon_st3}>elec</div>
                </div>
              }
              key="3"
            >
              <Electron />
            </TabPane>
            {/* <TabPane tab={<Icon type="area-chart" />} key="4">
              <Template/>
            </TabPane> */}
          </Tabs>
        </div>
      </div>
    );
  }
}
