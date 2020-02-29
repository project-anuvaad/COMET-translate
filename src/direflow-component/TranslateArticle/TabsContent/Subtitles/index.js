import React from 'react';
import { connect } from 'react-redux'
import { Grid, Button, Dropdown, Modal, Icon, Popup } from 'semantic-ui-react';
import moment from 'moment';
import * as translationActions from '../../modules/actions';

import LoaderComponent from '../../components/LoaderComponent';
import ProofreadingVideoPlayer from '../../components/ProofreadingVideoPlayer/v2';
import VideoTimeline from '../../components/VideoTimeline/v2';
import SpeakerDragItem from '../../components/SpeakerDragItem';
import SplitterIcon from '../../components/SplitterIcon';
import SubtitleForm from '../../components/SubtitleForm';
import { formatTime } from '../../utils/helpers';
import FindAndReplaceModal from '../../components/FindAndReplaceModal';

import { Styled } from 'direflow-component';
import styles from './style.scss';

class Subtitles extends React.Component {

    state = {
        stages: [],
        videoPlaying: false,
        controlsVisible: false,
        duration: 0,
        intervalId: null,
        currentTime: 0,
        subtitles: [],
        selectedSubtitle: null,
        splitterDragging: false,
        selectedSubtitleIndex: null,
        isResetSubtitlesModalOpen: false,
        isFindAndReplaceModalVisible: false,
    }


    componentWillMount = () => {
        this.props.fetchSubtitles(this.props.articleId);
        this.props.setSelectedSubtitle(null);
        this.props.setSelectedSubtitleIndex(0);
        this.props.resetUndo();
    }

    onVideoLoad = (e) => {
        if (this.videoRef) {
            this.videoRef.ontimeupdate = () => {
                if (this.videoRef) {
                    this.setState({ currentTime: this.videoRef.currentTime * 1000 });
                    this.checkSelectedSubtitleChange(this.videoRef.currentTime * 1000);
                }
            }
            this.videoRef.onended = () => {
                this.setState({ videoPlaying: false });
            }
            this.setState({ duration: this.videoRef.duration * 1000 })
        }
    }

    onPlayToggle = () => {
        this.setState(({ videoPlaying }) => {
            const newPlaying = !videoPlaying;
            if (newPlaying) {
                this.videoRef.play();
            } else {
                this.videoRef.pause();
            }

            return { videoPlaying: newPlaying };
        })
    }

    onTimeChange = (currentTime) => {
        this.videoRef.currentTime = currentTime / 1000;
        this.setState({ currentTime });
        this.checkSelectedSubtitleChange(currentTime)
    }

    checkSelectedSubtitleChange = (currentTime) => {

        if (this.props.selectedSubtitle && (this.props.selectedSubtitle.startTime <= currentTime && this.props.selectedSubtitle.endTime >= currentTime)) {
            // same subtitle item;
            return;
        }

        const currentSubtitleIndex = this.props.subtitles.subtitles.findIndex((s) => s.startTime <= currentTime && s.endTime >= currentTime);
        const currentSubtitle = this.props.subtitles.subtitles[currentSubtitleIndex];
        if (currentSubtitle) {
            this.props.setSelectedSubtitle({ ...currentSubtitle });
            this.props.setSelectedSubtitleIndex(currentSubtitleIndex);
        } else if (this.props.selectedSubtitle) {
            this.props.setSelectedSubtitle(null);
            this.props.setSelectedSubtitleIndex(0);
        }
    }

    onAddSubtitle = (subtitle) => {
        console.log('adding subtitle', subtitle)
        this.props.addSubtitle(this.props.subtitles._id, subtitle);
    }

    onSaveSubtitle = (subtitle, index, changes) => {
        this.props.updateSubtitle(this.props.subtitles._id, subtitle.position, changes);
        this.checkSelectedSubtitleChange(this.state.currentTime)
    }

    onDeleteSubtitle = (subtitle, index) => {
        this.props.deleteSubtitle(this.props.subtitles._id, subtitle.position);
    }

    onSubtitleSplit = (subtitle, wordIndex) => {
        this.props.splitSubtitle(this.props.subtitles._id, subtitle.position, wordIndex, this.state.currentTime / 1000);
    }

    onResetSubtitles = () => {
        this.setState({ isResetSubtitlesModalOpen: false });
        this.props.resetSubtitles(this.props.subtitles._id);
    }

    onGenerateSubtitlesClick = () => {
        const { subtitles } = this.props;
        this.props.activateSubtitles(subtitles._id);
    }

    renderSpeakersDragAndDrop = () => (
        <Grid.Row style={{ display: 'flex', alignItems: 'flex-start', padding: 0 }}>
            <Grid.Column width={16} style={{ color: 'white' }}>
                <Grid>
                    <Grid.Row style={{ display: 'flex', alignItems: 'center' }}>
                        <Grid.Column width={8}>
                            <span>1. Splitter</span>
                        </Grid.Column>
                        <Grid.Column width={4}>
                            <span
                                draggable
                                onDragEnd={() => this.setState({ splitterDragging: false })}
                                onDragStart={e => {
                                    e.dataTransfer.setData('text', JSON.stringify({ split: true }));
                                    this.setState({ splitterDragging: true })
                                }}
                                style={{
                                    width: 40,
                                    height: 40,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    flexDirection: 'column',
                                    backgroundColor: 'transparent !important'
                                }}
                            >
                                {this.state.splitterDragging ? (

                                    <Icon name="cut"
                                        size="large"
                                        style={{ transform: 'rotateZ(270deg)' }}
                                    />
                                ) : (
                                        <SplitterIcon />
                                    )}
                                {this.state.splitterDragging && (
                                    <div>
                                        {formatTime(this.state.currentTime)}
                                    </div>
                                )}
                            </span>
                        </Grid.Column>

                    </Grid.Row>
                </Grid>
            </Grid.Column>
            <Grid.Column width={16} style={{ color: 'white', marginTop: 10, marginBottom: 10 }}>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={5}>
                            <span>2. No Speaker</span>
                        </Grid.Column>
                        <Grid.Column width={4}>
                            <div
                                draggable={true}
                                style={{
                                    backgroundColor: 'transparent',
                                    position: 'relative',
                                    color: 'white',
                                    cursor: 'pointer',
                                    height: 20,
                                    display: 'inline-block',
                                }}
                                onDragStart={(e) => e.dataTransfer.setData('text', JSON.stringify({ speaker: { speakerNumber: -1 } }))}
                            >
                                <SpeakerDragItem speaker={{ speakerNumber: -1 }} />
                            </div>
                        </Grid.Column>
                        <Grid.Column width={2}>
                            <Popup
                                trigger={<Icon name="info circle" />}
                                content="Intros, Extro, and all non-speech segments of the video."
                            />
                        </Grid.Column>

                    </Grid.Row>
                </Grid>
            </Grid.Column>
            <Grid.Column width={16}>

                <Grid>
                    <Grid.Row style={{ position: 'relative', bottom: '-1rem', color: 'white' }}>
                        <Grid.Column width={16}>
                            <span>
                                <u>
                                    3. Number of speakers:
                                </u>
                            </span>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        {this.props.article && this.props.article.speakersProfile.sort((a, b) => a.speakerNumber - b.speakerNumber).map((speaker, index) => (
                            <Grid.Column width={16} style={{ marginTop: 10, marginBottom: 10 }} key={'speakers-sda' + index}>
                                <Grid>
                                    <Grid.Row style={{ listStyle: 'none', padding: 10, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                                        <Grid.Column width={4}>
                                            <span>Speaker {speaker.speakerNumber}</span>
                                        </Grid.Column>
                                        <Grid.Column width={6}>
                                            <div
                                                draggable={true}
                                                style={{
                                                    backgroundColor: 'transparent',
                                                    position: 'relative',
                                                    color: 'white',
                                                    cursor: 'pointer',
                                                    height: 20,
                                                    display: 'inline-block',
                                                }}
                                                onDragStart={(e) => e.dataTransfer.setData('text', JSON.stringify({ speaker }))}
                                            >
                                                <SpeakerDragItem speaker={speaker} />
                                            </div>
                                        </Grid.Column>
                                        <Grid.Column width={index === this.props.article.speakersProfile.length - 1 ? 4 : 6}>
                                            <Dropdown
                                                value={speaker.speakerGender}
                                                disabled
                                                options={[{ text: 'Male', value: 'male' }, { text: 'Female', value: 'female' }]}
                                            />
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Grid.Column>

                        ))}
                    </Grid.Row>
                </Grid>
            </Grid.Column>

        </Grid.Row>
    )

    renderResetSubttilesModal = () => (
        <Modal
            open={this.state.isResetSubtitlesModalOpen}
            size="tiny"
            onClose={() => this.setState({ isResetSubtitlesModalOpen: false })}
        >
            <Modal.Header>
                <h3>Sync Text</h3>
            </Modal.Header>
            <Modal.Content>
                Are you sure you want to reset the subtitles?
            </Modal.Content>
            <Modal.Actions>
                <Button
                    onClick={() => this.setState({ isResetSubtitlesModalOpen: false })}
                >
                    Cancel
                </Button>
                <Button
                    onClick={this.onResetSubtitles}
                    primary
                >Yes</Button>
            </Modal.Actions>

        </Modal>

    )

    renderFindAndReplaceModal = () => (
        <FindAndReplaceModal
            open={this.state.isFindAndReplaceModalVisible}
            onClose={() => this.setState({ isFindAndReplaceModalVisible: false })}
            onSubmit={({ find, replace }) => {
                this.setState({ isFindAndReplaceModalVisible: false });
                this.props.findAndReplaceText(find, replace);
            }}
        />
    )

    render() {
        const {
            subtitles,
            subtitlesLoading,
            selectedSubtitleIndex,
            subtitlesTranslationExport,
            subtitlesVideo,
            selectedSubtitle,
        } = this.props;

        return (
            <Styled styles={styles}>

                <LoaderComponent active={subtitlesLoading}>
                    {!subtitles ? (
                        <img src="/img/undraw_security_o890.png" width="100%" />
                    ) : (

                            <Grid style={{ backgroundColor: 'black', paddingTop: '3rem', marginLeft: '-3rem', marginRight: '-3rem' }}>
                                <Grid.Row style={{ padding: 0 }}>


                                    <Grid.Column width={4} />
                                    <Grid.Column width={8}>

                                        <div style={{ width: '100%', height: '100%' }}>
                                            <div
                                                className="pull-right"
                                                style={{ color: 'white', marginBottom: '1rem' }}
                                            >
                                                Last Updated On: {moment(subtitles.updated_at).format('hh:mm a DD/MM/YYYY')}
                                            </div>
                                            {subtitlesVideo && (
                                                <ProofreadingVideoPlayer
                                                    text={selectedSubtitle ? selectedSubtitle.text : ''}
                                                    duration={this.state.duration}
                                                    currentTime={this.state.currentTime}
                                                    onVideoLoad={this.onVideoLoad}
                                                    playing={this.state.videoPlaying}
                                                    onTimeChange={this.onTimeChange}
                                                    videoRef={(ref) => this.videoRef = ref}
                                                    width={'100%'}
                                                    url={subtitlesTranslationExport ? subtitlesTranslationExport.videoUrl : subtitlesVideo.url}
                                                    onPlayToggle={this.onPlayToggle}
                                                    extraContent={
                                                        (
                                                            <p
                                                                onClick={() => this.setState({ isFindAndReplaceModalVisible: true })}
                                                                style={{ color: 'white', cursor: 'pointer' }}
                                                            >
                                                                Find & Replace
                                                        </p>
                                                        )
                                                    }

                                                />
                                            )}
                                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' }}>
                                                <div
                                                    style={{
                                                        color: 'white'
                                                    }}
                                                >

                                                    <span
                                                        draggable
                                                        onDragEnd={() => this.setState({ splitterDragging: false })}
                                                        onDragStart={e => {
                                                            e.dataTransfer.setData('text', JSON.stringify({ split: true }));
                                                            this.setState({ splitterDragging: true })
                                                        }}
                                                        style={{
                                                            width: 40,
                                                            height: 40,
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            flexDirection: 'column',
                                                            backgroundColor: 'transparent'
                                                        }}
                                                    >
                                                        <Icon name="cut"
                                                            size="large"
                                                            style={{ transform: 'rotateZ(270deg)' }}
                                                        />
                                                        {this.state.splitterDragging && (
                                                            <div>
                                                                {formatTime(this.state.currentTime)}
                                                            </div>
                                                        )}
                                                    </span>
                                                </div>

                                                {this.props.article && [this.props.article.speakersProfile.sort((a, b) => a.speakerNumber - b.speakerNumber)[0]].map((speaker, index) => (
                                                    <Grid.Column width={16} style={{ marginTop: 10, marginBottom: 10 }} key={'speakers-sda' + index}>
                                                        <Grid>
                                                            <Grid.Row style={{ listStyle: 'none', padding: 10, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                                                                <Grid.Column width={6}>
                                                                    <div
                                                                        draggable={true}
                                                                        style={{
                                                                            backgroundColor: 'transparent',
                                                                            position: 'relative',
                                                                            color: 'white',
                                                                            cursor: 'pointer',
                                                                            height: 20,
                                                                            display: 'inline-block',
                                                                        }}
                                                                        onDragStart={(e) => e.dataTransfer.setData('text', JSON.stringify({ speaker }))}
                                                                    >
                                                                        <SpeakerDragItem speaker={speaker} />
                                                                    </div>
                                                                </Grid.Column>
                                                            </Grid.Row>
                                                        </Grid>
                                                    </Grid.Column>

                                                ))}
                                            </div>
                                        </div>
                                    </Grid.Column>
                                    <Grid.Column width={4}>

                                        <div className="pull-right">
                                            <div>
                                                <Popup
                                                    position="top right"
                                                    trigger={
                                                        <Button
                                                            primary
                                                            onClick={() => this.setState({ isResetSubtitlesModalOpen: true })}
                                                        >

                                                            <Icon name="refresh" /> Sync Text
                                                </Button>
                                                    }
                                                    content="re-sync the subtitles with the translated text"
                                                />
                                                <Button
                                                    color="green"
                                                    onClick={this.onGenerateSubtitlesClick}
                                                >
                                                    {subtitles.activated ? 'Update Subtitles' : 'Generate Subtitles'}
                                                </Button>
                                            </div>
                                            <div
                                                style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}
                                            >
                                                <Button
                                                    onClick={this.props.undoAction}
                                                    disabled={!this.props.subtitlesUndoStack || this.props.subtitlesUndoStack.length === 0}
                                                >
                                                    <Icon name="undo" /> Undo
                                            </Button>

                                                <Button
                                                    onClick={this.props.redoAction}
                                                    disabled={!this.props.subtitlesRedoStack || this.props.subtitlesRedoStack.length === 0}
                                                >
                                                    <Icon name="redo" /> Redo
                                            </Button>
                                            </div>
                                        </div>
                                    </Grid.Column>
                                    <Grid.Column width={16} style={{ marginTop: 5, paddingLeft: 0 }}>
                                        {this.state.duration && subtitles && subtitles.subtitles && (
                                            <VideoTimeline
                                                splitterDragging={this.state.splitterDragging}
                                                currentTime={this.state.currentTime}
                                                onTimeChange={this.onTimeChange}
                                                duration={this.state.duration}
                                                subtitles={this.props.subtitles.subtitles}
                                                selectedSubtitleIndex={this.props.selectedSubtitleIndex}
                                                onSubtitleChange={this.onSaveSubtitle}
                                                onAddSubtitle={this.onAddSubtitle}
                                                onSubtitleSelect={(subtitle, index) => {
                                                    this.props.setSelectedSubtitle(subtitle);
                                                    this.props.setSelectedSubtitleIndex(index);
                                                }}
                                                onSubtitleSplit={this.onSubtitleSplit}
                                            />
                                        )}
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                    <Grid.Column width={5} >
                                        {/* <Grid className="speakers-box">
                                        <h2 style={{ color: 'white' }}>
                                            Basic tools:
                                        </h2>
                                        {this.renderSpeakersDragAndDrop()}
                                    </Grid> */}
                                    </Grid.Column>
                                    <Grid.Column width={11}>
                                        {this.props.article && this.props.article.speakersProfile && selectedSubtitle && selectedSubtitle.speakerProfile ? (

                                            <div style={{ width: '100%', padding: '2rem', marginTop: '3rem' }}>
                                                <SubtitleForm
                                                    loading={this.props.updateSubslideState === 'loading'}
                                                    subtitle={selectedSubtitle}
                                                    disableSpeakerUpdate
                                                    hideFindAndReplace
                                                    speakers={[{ speakerNumber: -1 }].concat(this.props.article.speakersProfile)}
                                                    showTextArea={selectedSubtitle.speakerProfile.speakerNumber !== -1}
                                                    onSave={(changes) => {
                                                        this.onSaveSubtitle(selectedSubtitle, selectedSubtitleIndex, changes)
                                                    }}
                                                    onDelete={() => this.onDeleteSubtitle(selectedSubtitle, selectedSubtitleIndex)}
                                                />
                                            </div>
                                        ) : (
                                                <div style={{ height: 150 }}></div>
                                            )}
                                    </Grid.Column>

                                </Grid.Row>
                                {this.renderResetSubttilesModal()}
                                {this.renderFindAndReplaceModal()}
                            </Grid>
                        )
                    }
                </LoaderComponent>
            </Styled>
        )
    }
}


const mapStateToProps = ({ translateArticle }) => ({
    article: translateArticle.translatableArticle,
    subtitles: translateArticle.subtitles,
    subtitlesLoading: translateArticle.subtitlesLoading,
    subtitlesVideo: translateArticle.subtitlesVideo,
    subtitlesTranslationExport: translateArticle.subtitlesTranslationExport,
    selectedSubtitle: translateArticle.selectedSubtitle,
    subtitlesUndoStack: translateArticle.subtitlesUndoStack,
    subtitlesRedoStack: translateArticle.subtitlesRedoStack,
    selectedSubtitleIndex: translateArticle.selectedSubtitleIndex,
    user: translateArticle.user,
    organization: translateArticle.organization,
})
const mapDispatchToProps = dispatch => ({
    resetUndo: () => dispatch(translationActions.resetUndo()),
    undoAction: () => dispatch(translationActions.undoAction()),
    redoAction: () => dispatch(translationActions.redoAction()),
    fetchSubtitles: (articleId) => dispatch(translationActions.fetchSubtitles(articleId)),
    updateSubtitle: (subtitleId, subtitlePosition, changes) => dispatch(translationActions.updateSubtitle(subtitleId, subtitlePosition, changes)),
    addSubtitle: (subtitleId, subtitle) => dispatch(translationActions.addSubtitle(subtitleId, subtitle)),
    resetSubtitles: (subtitleId) => dispatch(translationActions.resetSubtitles(subtitleId)),
    deleteSubtitle: (subtitleId, subtitlePosition) => dispatch(translationActions.deleteSubtitle(subtitleId, subtitlePosition)),
    splitSubtitle: (subtitleId, subtitlePosition, wordIndex, time) => dispatch(translationActions.splitSubtitle(subtitleId, subtitlePosition, wordIndex, time)),
    activateSubtitles: (subtitleId) => dispatch(translationActions.activateSubtitles(subtitleId)),

    setSelectedSubtitle: subtitle => dispatch(translationActions.setSelectedSubtitle(subtitle)),
    setSelectedSubtitleIndex: index => dispatch(translationActions.setSelectedSubtitleIndex(index)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Subtitles);