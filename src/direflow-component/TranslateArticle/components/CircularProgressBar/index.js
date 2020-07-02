import React from 'react';
import { Styled } from 'direflow-component';
import { CircularProgressbar, buildStyles as bs } from 'react-circular-progressbar';
import styles from 'react-circular-progressbar/dist/styles.css';

export class CircularProgressBar extends React.Component {
    render() {
        return (
            <Styled styles={styles}>
                <span style={{ display: 'flex' }}><CircularProgressbar {...this.props} /></span>
            </Styled>
        )
    }
}

export const buildStyles = bs;