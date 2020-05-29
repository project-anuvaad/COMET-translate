import React from 'react';
import { STEP_CONTENT, STAGES } from './config'
import TutorialModal from '../TutorialModal';

export default class TranslatingVideoTutorialModal extends React.Component {

    render() {

        return (
            <TutorialModal
                {...this.props}
                title="Learn how to translate a video"
                stages={STAGES}
                stepContent={STEP_CONTENT}
                numberOfSteps={Object.keys(STEP_CONTENT).length}
            />
        )   

    }
}