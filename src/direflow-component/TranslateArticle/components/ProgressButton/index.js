import React from 'react';
import { Progress } from 'semantic-ui-react';
import { Styled } from 'direflow-component';
import styles from './style.scss';

export default class ProgressButton extends React.Component {

    render() {
        return (
            <Styled styles={styles}>
                <div>
                    <div className={`progress-btn ${this.props.showProgress && 'hidden'}`} basic onClick={this.props.onClick}>
                        {this.props.text}
                    </div>
                    <Progress className={`progress-bar ${!this.props.showProgress && 'hidden'}`} size="small" percent={this.props.percent} indicating progress />
                </div>
            </Styled>
        )
    }
}

ProgressButton.defaultProps = {
    onClick: () => { },
}