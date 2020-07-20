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
];

export const STEP_CONTENT = {
    1: function renderItem() {
        return (
            <NoteGrid
                title={`Check and correct the text of the translator.`}
                image="https://tailoredvideowiki.s3-eu-west-1.amazonaws.com/static/tutorials_media/text_translation_approval/1.png"
            />
        )
    },

    2: function renderItem() {
        return (
            <NoteGrid
                title={`Look for orange marks in the slide bar which indicates that the word limit was exceeded. If possible, try to reduce the words to the word limit.`}
                image="https://tailoredvideowiki.s3-eu-west-1.amazonaws.com/static/tutorials_media/text_translation_approval/2.png"
            />
        )
    },

    3: function renderItem() {
        return (
            <NoteGrid
                title={`Repeat for all slides.`}
            />
        )
    },

    4: function renderItem() {
        return (
            <NoteGrid
                title={`Once all slides are checked and verified, click on “Text translation Approved”`}
                image="https://tailoredvideowiki.s3-eu-west-1.amazonaws.com/static/tutorials_media/text_translation_approval/4.png"
            />
        )
    },
}
