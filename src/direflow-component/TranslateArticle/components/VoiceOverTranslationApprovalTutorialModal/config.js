import React from 'react';
import { NoteGrid } from '../TutorialModal/components';


export const STAGES = [
    {
        title: 'Step 1',
        activeRange: [1, 1]
    },
    {
        title: 'Step 2',
        activeRange: [2, 2]
    },
    {
        title: 'Step 3',
        activeRange: [3, 3]
    },

];

export const STEP_CONTENT = {
    1: function renderItem() {
        return (
            <NoteGrid
                title={`To verify audio click on Play button next to All Slides. `}
                image="https://tailoredvideowiki.s3-eu-west-1.amazonaws.com/static/tutorials_media/voice_over_translation_approval/1.png"
            />
        )
    },

    2: function renderItem() {
        return (
            <NoteGrid
                title={`In case of any changes required, mention in the comments box.`}
                image="https://tailoredvideowiki.s3-eu-west-1.amazonaws.com/static/tutorials_media/voice_over_translation_approval/2.png"
            />
        )
    },

    3: function renderItem() {
        return (
            <NoteGrid
                title={`If recordings are ok, click on “Voice over approved”.`}
                image="https://tailoredvideowiki.s3-eu-west-1.amazonaws.com/static/tutorials_media/voice_over_translation_approval/3.png"
            />
        )
    },
}
