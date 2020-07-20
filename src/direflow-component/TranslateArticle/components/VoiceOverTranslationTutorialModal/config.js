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
    {
        title: 'Step 6',
        activeRange: [6, 6]
    },

];

export const STEP_CONTENT = {
    1: function renderItem() {
        return (
            <NoteGrid
                title={`Click on green Record button and start voice over for each slide.`}
                image="https://tailoredvideowiki.s3-eu-west-1.amazonaws.com/static/tutorials_media/voice_over_translation/1.png"
            />
        )
    },

    2: function renderItem() {
        return (
            <NoteGrid
                title={`Alternatively you can upload audio file.`}
                image="https://tailoredvideowiki.s3-eu-west-1.amazonaws.com/static/tutorials_media/voice_over_translation/2.png"
            />
        )
    },

    3: function renderItem() {
        return (
            <NoteGrid
                title={`Make sure your voice time is near to the slide time.`}
                // image="https://tailoredvideowiki.s3-eu-west-1.amazonaws.com/static/tutorials_media/voice_over_translation/1.pngg"
            />
        )
    },

    4: function renderItem() {
        return (
            <NoteGrid
                title={`Click on tick mark if ok. If not, delete by clicking on X mark and record again.`}
                image="https://tailoredvideowiki.s3-eu-west-1.amazonaws.com/static/tutorials_media/voice_over_translation/4.png"
            />
        )
    },

    5: function renderItem() {
        return (
            <NoteGrid
                title={`Repeat Step 3 for all slides to complete 100% work.`}
                image="https://tailoredvideowiki.s3-eu-west-1.amazonaws.com/static/tutorials_media/voice_over_translation/5.png"
            />
        )
    },
    6: function renderItem() {
        return (
            <NoteGrid
                title={`Once recording is completed click on "Voice over Completed".`}
                image="https://tailoredvideowiki.s3-eu-west-1.amazonaws.com/static/tutorials_media/voice_over_translation/6.png"
            />
        )
    },
}
