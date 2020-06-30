import React from 'react';
import { Styled } from 'direflow-component';
import { Editor } from 'react-draft-wysiwyg';
import styles from 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

export class TextEditor extends React.Component {
    render() {
        return (
            <Styled styles={styles}>
                <div><Editor {...this.props} /></div>
            </Styled>
        )
    }
}
