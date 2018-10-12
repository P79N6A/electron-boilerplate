// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes';
import styles from './Home.css';

type Props = {};

export default class Home extends Component<Props> {
  props: Props;

  render() {
    return (
      <div className={styles.container} data-tid="container">
        <h2>Home111</h2>
        <div>{process.cwd()}</div>
        <Link to={routes.COUNTER}>to Counter</Link>
      </div>
    );
  }
}
