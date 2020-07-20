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
    {
        title: 'Step 4',
        activeRange: [4, 4],
    },
    {
        title: 'Step 5',
        activeRange: [5, 5]
    },

];

export const STEP_CONTENT = {
    1: function renderItem() {
        return (
            <NoteGrid
                title={`Click Play button to listen to Slide 1 of the original video.`}
                image="https://tailoredvideowiki.s3-eu-west-1.amazonaws.com/static/tutorials_media/text_translation/1.png"
            />
        )
    },

    2: function renderItem() {
        return (
            <NoteGrid
                title={`Write/Correct the text inside the Slide box.`}
                image="https://tailoredvideowiki.s3-eu-west-1.amazonaws.com/static/tutorials_media/text_translation/2.png"
            />
        )
    },

    3: function renderItem() {
        return (
            <NoteGrid
                title={`Try to keep the text within the word limit.`}
                image="https://tailoredvideowiki.s3-eu-west-1.amazonaws.com/static/tutorials_media/text_translation/3.png"
            />
        )
    },

    4: function renderItem() {
        return (
            <NoteGrid
                title={`Repeat for all slides.`}
            />
        )
    },

    5: function renderItem() {
        return (
            <NoteGrid
                title={`Once all slides text are done/corrected, click on 'Text translation Completed'.`}
                image="https://tailoredvideowiki.s3-eu-west-1.amazonaws.com/static/tutorials_media/text_translation/5.png"
            />
        )
    },
}
