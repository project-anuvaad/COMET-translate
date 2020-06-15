// PACKAGES DEPS
import React from 'react';
import { connect } from 'react-redux';
import querystring from 'query-string';
import Lottie from 'react-lottie';
import { Grid, Card, Button, Icon, Input, Progress, Select, Popup, Sidebar, Checkbox, Dropdown } from 'semantic-ui-react';
import moment from 'moment';
import ReactAvatar from 'react-avatar';
import Dropzone from 'react-dropzone';



// COMPONENTS
import TranslateBox from './TranslateBox';
import SpeakerTranslationEndtimeModal from './SpeakerTranslationEndtimeModal';
import CommentsSidebar from './CommentsSidebar';

// SHARED COMPONENTS
import SlidesList from '../../components/SlidesList';
import AudioRecorder from '../../components/AudioRecorder';
import LoaderComponent from '../../components/LoaderComponent';
import AssignUsersSpeakersModal from '../../components/AssignUsersSpeakersModal';
import RoleRenderer from '../../containers/RoleRenderer';
import ProofreadingVideoPlayerV2 from '../../components/ProofreadingVideoPlayer/v2';
import EditVideoSpeedModal from '../../components/EditVideoSpeedModal';

// LOTTIES
import aroundTheWorldLottie from '../../lottie/around-the-world.json';
import speedLottie from '../../lottie/speed.json';

// import websockets from '../../../../../websockets';

// ACTIONS
import *  as translationActions from '../../modules/actions';

import {
    getUserOrganziationRole,
    getSubslideIndex,
    getUsersByRoles,
    getUserNamePreview,
    getSpeakersTranslatorsMap,
    displayArticleLanguage
} from '../../utils/helpers';

import styles from './style.scss'

import { Styled } from 'direflow-component';
import TranslationVersionSelectModal from './TranslationVersionSelectModal';
import TranslatingVideoTutorialModal from '../../components/TranslatingVideoTutorialModal';

const FETCH_ARTICLE_JOBNAME = 'FETCH_TRANSLATE_ARTICLE';

const PICTURE_IN_PICTURE_POSITIONS = [
    {
        text: 'Bottom Right',
        value: 'br'
    },
    {
        text: 'Bottom Left',
        value: 'bl',
    },
    {
        text: 'Top Right',
        value: 'tr'
    },
    {
        text: 'Top left',
        value: 'tl',
    },
]

const calculateCompletedArticlePercentage = article => {
    const slides = article.slides.reduce((acc, slide) => acc.concat(slide.content), []).filter((slide) => slide);
    const completedCount = slides.reduce((acc, slide) => slide.text && slide.audio ? ++acc : acc, 0);
    return Math.floor(completedCount / slides.length * 100)
}

class Workstation extends React.Component {
    state = {
        pollerStarted: false,
        videoSpeedPollerStarted: false,
        translationVersionModalVisible: false,
        isTranslatingVideoTutorialModalVisible: false,
        assignUsersModalVisible: false,
        duration: 0,
        currentTime: 0,
    }

    componentWillMount() {
        const { articleId } = this.props;
        this.props.fetchTranslatableArticle({ articleId });
        this.props.fetchTranslatableArticleBaseLanguages({ articleId });
        this.props.fetchSubtitles(articleId);
        this.props.setCCVisible(true);
        this.props.fetchTranslationVersionsCount({ articleId })
        this.props.fetchTranslationVersions({ articleId })
        let {
            speakerNumber,
            finishDateOpen,
        } = querystring.parse(window.location.search);
        if (!speakerNumber) {
            speakerNumber = -1
        }
        this.props.changeSelectedSpeakerNumber(parseInt(speakerNumber));
        if (finishDateOpen) {
            setTimeout(() => {
                this.props.setTranslationSpeakerEndtimeModalVisible(true);
            }, 0);
        }
    }

    componentDidMount = () => {
        if (this.props.user && this.props.user.showTranslatingTutorial) {
            this.setState({ isTranslatingVideoTutorialModalVisible: true });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.translatableArticle && nextProps.translatableArticle && !this.socketSub) {
            this.initSocketSub(nextProps.translatableArticle)
        }
        if (nextProps.translatableArticle) {
            if (nextProps.translatableArticle.videoSpeedLoading && !this.state.videoSpeedPollerStarted) {
                this.setState({ videoSpeedPollerStarted: true });
                this.startFetchArticleJob();
            } else if (!nextProps.translatableArticle.videoSpeedLoading && this.state.videoSpeedPollerStarted) {
                this.setState({ videoSpeedPollerStarted: false });
                this.stopFetchArticleJob();
            }
            if (nextProps.translatableArticle.translationProgress !== 100 && !this.state.pollerStarted) {
                this.setState({ pollerStarted: true })
                this.startFetchArticleJob()
            } else if (nextProps.translatableArticle.translationProgress === 100 && this.state.pollerStarted) {
                this.setState({ pollerStarted: false });
                this.stopFetchArticleJob();
            }
        }
        if (!this.props.user && nextProps.user && nextProps.user.showTranslatingTutorial) {
            this.setState({ isTranslatingVideoTutorialModalVisible: true })
        }
    }

    startFetchArticleJob = () => {
        this.props.startJob({ jobName: FETCH_ARTICLE_JOBNAME, interval: 3000 }, () => {
            const { articleId } = this.props;
            this.props.fetchTranslatableArticle({ articleId, loading: false });
        })
    }

    stopFetchArticleJob = () => {
        this.props.stopJob(FETCH_ARTICLE_JOBNAME);
    }

    componentWillUnmount = () => {
        if (this.state.pollerStarted || this.state.videoSpeedPollerStarted) {
            this.props.stopJob(FETCH_ARTICLE_JOBNAME);
        }
        // if (this.socketSub && this.props.translatableArticle && this.props.translatableArticle._id) {
        //     websockets.unsubscribeFromEvent(`${websockets.websocketsEvents.TRANSLATION_SUBSLIDE_CHANGE}/${this.props.translatableArticle._id}`)
        // }
    }

    initSocketSub = (translatableArticle) => {
        // this.socketSub = websockets.subscribeToEvent(`${websockets.websocketsEvents.TRANSLATION_SUBSLIDE_CHANGE}/${translatableArticle._id}`, (data) => {
        //     console.log('got socket data', data);
        //     const { slidePosition, subslidePosition, changes } = data;
        //     this.props.updateSubslide(slidePosition, subslidePosition, changes);
        // })
    }

    canPreview = () => {
        const { translatableArticle } = this.props;
        if (!translatableArticle) return false;
        if (this.props.preview) {
            return true;
        }
        return translatableArticle.slides.reduce((acc, s) => acc.concat(s.content), []).every((s) => (s.audio && s.text) || s.picInPicVideoUrl);
    }

    canExport = () => {
        const { originalTranslatableArticle } = this.props;
        if (!originalTranslatableArticle) return false;
        return originalTranslatableArticle.slides.reduce((acc, s) => acc.concat(s.content), []).every((s) => (s.audio && s.text) || s.picInPicVideoUrl);
    }

    /*
        this function was intended to prohibit/disable modifying workstation
        but for the assigend user
    */
    // canModify = () => {
    //     const { translatableArticle, user, organization, currentSlideIndex, currentSubslideIndex } = this.props;
    //     if (!translatableArticle) return false;

    //     const userOrgRole = getUserOrganziationRole(user, organization);
    //     const currentSubslide = translatableArticle.slides[currentSlideIndex] ? translatableArticle.slides[currentSlideIndex].content[currentSubslideIndex] : null;
    //     if (!currentSubslide) return false;

    //     const userTranslatorData = translatableArticle.translators &&
    //     translatableArticle.translators.length > 0 &&
    //     translatableArticle.translators.find((t) => t.user === user._id && t.speakerNumber === currentSubslide.speakerProfile.speakerNumber)
    //     return !!userTranslatorData
    // }

    canModify = () => {
        const { translatableArticle, user, organization, currentSlideIndex, currentSubslideIndex } = this.props;
        if (!translatableArticle) return false;
        const userOrgRole = getUserOrganziationRole(user, organization);
        if (!userOrgRole) return false;
        if (userOrgRole.organizationOwner || userOrgRole.permissions.indexOf('admin') !== -1 || userOrgRole.permissions.indexOf('translate') !== -1) return true;
        return false;
    }

    onVideoLoad = (e) => {
        if (this.videoRef) {
            if (this.audioRef && this.props.editorPlaying) {
                this.audioRef.play()
            }
            this.videoRef.ontimeupdate = () => {
                if (this.videoRef) {
                    console.log('editor muted', this.props.editorMuted)
                    this.setState({ currentTime: this.videoRef.currentTime * 1000 });
                }
            }
            this.videoRef.onended = () => {
                if (this.props.preview) {
                    console.log('==================== on ended ========================')
                    this.onSlideForward();
                } else {
                    this.onSlideChange(this.props.currentSlideIndex, this.props.currentSubslideIndex);
                }
            }
            this.setState({ duration: this.videoRef.duration * 1000 })
        }
    }


    onTimeChange = (currentTime) => {
        this.videoRef.currentTime = currentTime / 1000;
        this.videoAudioRef.currentTime = currentTime / 1000;
        this.setState({ currentTime });
    }


    onPlayToggle = () => {
        const { editorPlaying } = this.props;
        const newPlaying = !editorPlaying;
        console.log('on play toggle', newPlaying, this.props.preview, this.picInPicRef)
        if (newPlaying) {
            this.videoRef.play();
            if (this.props.preview && !this.props.translatableArticle.signLang && this.audioRef) {
                this.audioRef.play();
                console.log('play audio')
            } else if (this.props.preview && this.picInPicRef) {
                this.picInPicRef.play();
                console.log('play video pic in pic', this.picInPicRef)
            } else if (this.videoAudioRef) {
                this.videoAudioRef.play();
                console.log('play videoaudioref')
            }
        } else {
            this.videoRef.pause();
            if (this.props.preview && this.audioRef) {
                this.audioRef.pause();
            } else {
                this.videoAudioRef.pause();
            }
        }
        this.props.setEditorPlaying(newPlaying);

    }

    getVersionedSubslides = () => {
        const { slide, subslide } = this.getCurrentSlideAndSubslide();
        const { translationVersions } = this.props;
        if (!slide || !subslide || !translationVersions) return [];
        const slidePosition = slide.position;
        const subslidePosition = subslide.position;
        const subslides = [];
        translationVersions.forEach(article => {
            const vsubslide = article.slides.find(s => s.position === slidePosition).content.find(s => s.position === subslidePosition);
            vsubslide.articleId = article._id;
            subslides.push(vsubslide);
        });
        return subslides;
    }


    onSlideChange = (currentSlideIndex, currentSubslideIndex) => {
        const { slide, subslide } = this.getCurrentSlideAndSubslide();
        if (subslide.tmpAudio && subslide.recordedBlob) {
            this.props.saveRecordedTranslation(slide.position, subslide.position, subslide.recordedBlob, true);
        }
        this.props.setCurrentEditorIndexes({ currentSlideIndex, currentSubslideIndex });
        const { translatableArticle } = this.props;
        if (translatableArticle.slides[currentSlideIndex] && translatableArticle.slides[currentSlideIndex].content[currentSubslideIndex]) {
            this.props.setCurrentSlide(translatableArticle.slides[currentSlideIndex]);
            this.props.setCurrentSubslide(translatableArticle.slides[currentSlideIndex].content[currentSubslideIndex])
        }
        if (!this.props.preview) {
            this.props.setEditorPlaying(false);
            this.props.setEditorMuted(false);
        }
        const newSlide = this.props.translatableArticle.slides[currentSlideIndex]
        const newListIndex = getSubslideIndex(this.props.translatableArticle.slides, newSlide.position, newSlide.content[currentSubslideIndex].position)
        this.props.setListIndex(newListIndex);
        this.props.setAddCommentSlideIndex(newListIndex);
        this.props.setCommentsSlidesIndexes([newListIndex]);
        this.props.fetchComments();
    }

    onSlideForward = () => {
        const { currentSlideIndex, currentSubslideIndex, translatableArticle } = this.props;
        const currentSlide = translatableArticle.slides[currentSlideIndex];
        const currentSubslide = currentSlide.content[currentSubslideIndex];
        let newSlideIndex, newSubslideIndex;
        if (currentSlide.content[currentSubslideIndex + 1]) {
            newSlideIndex = currentSlideIndex;
            newSubslideIndex = currentSubslideIndex + 1;
        } else if (translatableArticle.slides[currentSlideIndex + 1]) {
            newSlideIndex = currentSlideIndex + 1;
            newSubslideIndex = 0;
        } else {
            newSlideIndex = currentSlideIndex;
            newSubslideIndex = currentSubslideIndex;
        }

        this.onSlideChange(newSlideIndex, newSubslideIndex);
    }

    onPlayComplete = () => {
        if (this.props.preview) {
            // this.props.setEditorPlaying(false);
        }
    }

    getCurrentSlideAndSubslide = () => {

        const { translatableArticle, currentSlideIndex, currentSubslideIndex } = this.props;
        if (!translatableArticle || !translatableArticle.slides) return {};
        const slide = translatableArticle.slides[currentSlideIndex];
        if (!slide) return {};
        const subslide = slide.content[currentSubslideIndex];
        return { slide, subslide };
    }

    getSpeakersTranslatorsMap = () => {
        const { translatableArticle, organizationUsers } = this.props;
        if (!translatableArticle || !organizationUsers) return {};
        return getSpeakersTranslatorsMap(translatableArticle.speakersProfile, translatableArticle.translators, organizationUsers);
    }

    getUserAssignedTranslations = () => {
        const { translatableArticle, user } = this.props;
        if (!translatableArticle || !translatableArticle.translators || translatableArticle.translators.length === 0) return false;
        const assignedTranslations = translatableArticle.translators.filter((t) => t.user === user._id);
        return assignedTranslations;
    }

    getSelectedTranslator = () => {
        const { translatableArticle } = this.props;
        const selectedTranslator = translatableArticle && translatableArticle.translators ? translatableArticle.translators.find(t => t.speakerNumber === this.props.selectedSpeakerNumber) : null;
        return selectedTranslator;
    }

    onUploadPictureInPicture = e => {
        const { slide, subslide } = this.getCurrentSlideAndSubslide();
        this.props.uploadPictureInPictureVideo(slide.position, subslide.position, e.target.files[0]);
    }

    onSaveTranslatedText = (value, slideIndex, subslideIndex) => {
        const slide = this.props.translatableArticle.slides[slideIndex];
        const subslide = this.props.translatableArticle.slides[slideIndex].content[subslideIndex];
        this.props.saveTranslatedText(slide.position, subslide.position, value);
    }

    onGenerateTTSAudio = () => {
        const { slide, subslide } = this.getCurrentSlideAndSubslide();
        this.props.addTTSTranslation(slide.position, subslide.position);
    }

    onUpdateAudioFromOriginal = () => {
        const { slide, subslide } = this.getCurrentSlideAndSubslide();
        this.props.updateAudioFromOriginal(slide.position, subslide.position);
    }

    onSyncAll = (type) => {
        if (type === 'original') {
            this.props.syncAllFromOriginal();
        } else if (type === 'tts') {
            this.props.syncAllFromTTS();
        }
    }

    onRecordingStop = (recordedBlob) => {
        this.toggleRecording();
        if (recordedBlob) {
            const { slide, subslide } = this.getCurrentSlideAndSubslide();
            console.log('recorded blob', recordedBlob, this.props.listIndex, this.props.maxListIndex)
            if (this.props.listIndex >= this.props.maxListIndex) {
                this.props.saveRecordedTranslation(slide.position, subslide.position, recordedBlob);
            } else {
                this.props.tmpSaveRecordedTranslation(slide.position, subslide.position, recordedBlob);
            }
        }
    }


    toggleRecording = () => {
        if (!this.props.recording) {
            this.props.setEditorPlaying(true);
            this.props.setEditorMuted(true);
            if (this.videoRef) {
                this.videoRef.play();
            }
        } else {
            if (this.videoRef) {
                this.videoRef.pause();
            }
            this.props.setEditorPlaying(false);
            this.props.setEditorMuted(false);
        }
        if (this.videoRef) {
            this.videoRef.currentTime = 0;
        }
        this.props.setRecording(!this.props.recording);
    }

    onPreviewChange = (preview) => {
        if (this.videoRef) {
            this.videoRef.currentTime = 0;
        }
        if (this.videoAudioRef) {
            this.videoAudioRef.currentTime = 0;
        }
        if (preview) {
            this.props.setEditorMuted(true);
        } else {
            this.props.setEditorMuted(false);
        }
        console.log('============= preview change ====================', preview)
        this.props.onPreviewChange(preview);
    }

    onUploadAudioChange = e => {

        this.props.setRecording(false);
        const { slide, subslide } = this.getCurrentSlideAndSubslide();
        this.props.saveRecordedTranslation(slide.position, subslide.position, e.target.files[0]);;
        e.target.value = ''
    }

    onExport = () => {
        this.props.requestExportTranslationReview()
    }

    onChatClick = (subslide, index) => {
        console.log('usbslide', subslide);
        this.props.setCommentsVisible(true);
        this.props.setListIndex(index)
    }

    onSaveSpeakerFinishDate = timestamp => {
        this.props.updateSpeakerFinishDate(this.props.selectedSpeakerNumber, timestamp);
        this.props.setTranslationSpeakerEndtimeModalVisible(false);
    }

    onChangeBaseLanguage = (baseLanguage) => {
        const { articleId } = this.props;

        const articleQuery = {
            ...baseLanguage,
            articleId,
        }
        this.props.fetchTranslatableArticle(articleQuery);
    }

    onAssignUsersClick = (article) => {
        this.props.fetchUsers(this.props.organization._id);
        this.setState({ assignUsersModalVisible: true });
    }

    onSaveTranslators = (translators) => {
        this.setState({ assignUsersModalVisible: false });
        this.props.updateTranslators(this.props.translatableArticle._id, translators.filter((t) => t.user));
    }

    getTranslators = () => {
        return getUsersByRoles(this.props.organizationUsers, this.props.organization, ['translate', 'admin', 'owner']);
    }

    onVideoSpeedChange = (speed, slide) => {
        const { translatableArticle, currentSubslide, currentSlide } = this.props;
        this.props.updateArticleVideoSpeed({ articleId: translatableArticle._id, type: slide, speed, slidePosition: currentSlide.position, subslidePosition: currentSubslide.position })
    }

    onPlay = () => {
        this.videoRef.play()
        this.props.setEditorPlaying(true)
        this.props.setEditorMuted(true);
    }
    onPause = () => {
        this.videoRef.pause()
        this.props.setEditorPlaying(false)
        this.props.setEditorMuted(false);
    }

    onEnded = () => {
        this.videoRef.pause();
        this.videoRef.currentTime = 0;
        this.props.setEditorPlaying(false)
        this.props.setEditorMuted(false);
    }

    onChangeSignLangVideo = (acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            const { slide, subslide } = this.getCurrentSlideAndSubslide();
            this.props.uploadPictureInPictureVideo(slide.position, subslide.position, acceptedFiles[0])
        }
    }

    onChangePicInPicPosition = (e, { value }) => {
        const { slide, subslide } = this.getCurrentSlideAndSubslide();
        this.props.updatePictureInPicturePosition(slide.position, subslide.position, value);
    }

    _renderUploadAudio = (disabled) => {
        const { subslide } = this.getCurrentSlideAndSubslide();
        return (
            <span>
                <Button
                    circular
                    basic
                    icon="cloud upload"
                    color="teal"
                    onClick={() => document.getElementById('upload-audio-input').click()}
                    content={subslide.audio ? null : 'Upload'}
                />
                <Input
                    input={(
                        <input
                            ref={(r) => this.uploadRef = r}
                            disabled={disabled}
                            type="file"
                            id="upload-audio-input"
                            style={{ visibility: 'hidden', position: 'absolute', zIndex: -1 }}
                            onChange={this.onUploadAudioChange}
                            // value={this.props.uploadAudioInputValue}
                            accept=".webm, .mp3, .wav"
                        />
                    )}
                />
            </span>
        );
    }

    renderLoadingLottie = () => {
        const defaultOptions = {
            loop: true,
            autoplay: true,
            animationData: aroundTheWorldLottie,
            rendererSettings: {
                preserveAspectRatio: 'xMidYMid slice'
            }
        };

        return (
            <div key="translate-progress-loader" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                <div style={{ width: '50%' }}>
                    <Lottie options={defaultOptions}
                        height={400}
                        width={400}
                    />
                    <Progress indicating progress percent={this.props.translatableArticle ? this.props.translatableArticle.translationProgress : 0} />
                    <p style={{ textAlign: 'center', fontSize: '2rem', padding: '1rem' }}>Translating the video's text...</p>
                </div>
            </div>
        )
    }

    renderSpeedLoadingLottie = () => {
        const defaultOptions = {
            loop: true,
            autoplay: true,
            animationData: speedLottie,
            rendererSettings: {
                preserveAspectRatio: 'xMidYMid slice'
            }
        };

        return (
            <div key="translate-progress-loader" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                <div style={{ width: '50%' }}>
                    <Lottie options={defaultOptions}
                        height={400}
                        width={400}
                    />
                    <p style={{ textAlign: 'center', fontSize: '2rem', padding: '1rem' }}>Adjusting video speed...</p>
                </div>
            </div>
        )
    }

    renderAssignUsersModal = () => {
        const users = this.getTranslators();

        return (
            <AssignUsersSpeakersModal
                open={this.state.assignUsersModalVisible}
                article={this.props.translatableArticle}
                users={users}
                onClose={() => this.setState({ assignUsersModalVisible: false })}
                onSave={this.onSaveTranslators}
            />
        )
    }

    renderSpeakerTranslationEndtimeModal = () => {
        const selectedTranslator = this.getSelectedTranslator();

        return (
            <SpeakerTranslationEndtimeModal
                open={this.props.translationSpeakerEndtimeModalVisible}
                onClose={() => this.props.setTranslationSpeakerEndtimeModalVisible(false)}
                value={selectedTranslator ? selectedTranslator.finishDate : new Date().getTime()}
                onSave={this.onSaveSpeakerFinishDate}
            />
        )
    }

    isCurrentSlideLoading = () => {
        const { loadingSlides, currentSlideIndex, currentSubslideIndex } = this.props;
        return loadingSlides && loadingSlides.find((slide) => slide.slideIndex === currentSlideIndex && slide.subslideIndex === currentSubslideIndex) ? true : false;
    }

    renderSignLangUpload = () => {
        const { slide, subslide } = this.getCurrentSlideAndSubslide();
        if (!subslide) return null;

        return (
            <Grid.Row style={{ marginTop: '2.7rem' }}>
                <Grid.Column width={16}>
                    <div style={{ minHeight: 300 }}>
                        <LoaderComponent active={this.props.uploadPictureInPictureLoading}>
                            <Dropzone
                                multiple={false}
                                accept="video/*"
                                onDrop={this.onChangeSignLangVideo}>
                                {({ getRootProps, getInputProps }) => (
                                    <section>
                                        <div {...getRootProps()}>
                                            <input {...getInputProps()} />
                                            {subslide.picInPicVideoUrl ? (
                                                <video
                                                    muted={true}
                                                    onPlay={this.onPlay}
                                                    onPause={this.onPause}
                                                    // onEnded={this.onEnded}
                                                    controls
                                                    ref={ref => this.picInPicRef = ref}
                                                    src={subslide.picInPicVideoUrl}
                                                    key={subslide.picInPicVideoUrl}
                                                    width={'100%'}
                                                />
                                            ) : (
                                                    <div className="dropbox">
                                                        <img src="https://tailoredvideowiki.s3-eu-west-1.amazonaws.com/static/upload-cloud.png" />
                                                        <p className="description">Drag and drop a video file here to upload</p>
                                                        <p className="extra">or just click here to choose a video file</p>
                                                    </div>
                                                )}
                                            <p style={{ textAlign: 'center' }}>
                                                {subslide.picInPicVideoUrl ? (
                                                    <div
                                                        style={{ color: '#999999' }}
                                                    >
                                                        You can
                                                        <Button
                                                            primary
                                                            basic
                                                            circular
                                                            style={{ margin: 10 }}
                                                        >
                                                            choose another video
                                                </Button>
                                                        or drag it here
                                                    </div>
                                                ) : ''}
                                            </p>
                                        </div>

                                    </section>
                                )}

                            </Dropzone>

                        </LoaderComponent>
                    </div>
                    {subslide && subslide.picInPicVideoUrl && (
                        <div>
                            <div style={{ marginBottom: 10, marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                {/* <Popup
                                    content="coming soon"
                                    trigger={(
                                        <Button
                                            // icon
                                            circular
                                            // ="left"
                                            // loading={this.props.uploadPictureInPictureLoading}
                                            disabled={true}
                                            // onClick={this.toggleRecord}
                                            color={this.state.recording ? 'red' : 'green'}
                                        >
                                            <Icon name="video" style={{ marginRight: 10 }} /> Record
                                        </Button>
                                    )}
                                /> */}
                                <div>
                                    <small>Maximum limit: {parseFloat(subslide.media[0].duration).toFixed(2)} seconds</small>
                                </div>
                                <div />
                                <div>
                                    <span style={{ display: 'inline-block', marginRight: 10 }}>
                                        <strong>Video Position:</strong>
                                    </span>
                                    <Dropdown
                                        options={PICTURE_IN_PICTURE_POSITIONS}
                                        value={subslide.picInPicPosition}
                                        onChange={this.onChangePicInPicPosition}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </Grid.Column>
            </Grid.Row>

        )
    }

    renderTextForm = () => {

        const {
            translatableArticle,
            originalViewedArticle,
            currentSlideIndex,
            currentSubslideIndex,
            recording,
        } = this.props;

        const { slide, subslide } = this.getCurrentSlideAndSubslide();
        const canModify = this.canModify();
        const sameLang = translatableArticle && originalViewedArticle && originalViewedArticle.langCode.indexOf(translatableArticle.langCode) === 0 && !translatableArticle.tts;

        if (!slide || !subslide) return;

        let canSyncAll = false;
        const subslides = translatableArticle.slides.reduce((acc, s) => s.content ? acc.concat(s.content) : acc, [])

        if (sameLang) {
            if (subslides.some(s => (!s.audio || s.audioSource !== 'original'))) {
                canSyncAll = true;
            }
        } else if (translatableArticle.tts) {
            if (subslides.some(s => !s.audioSynced)) {
                canSyncAll = true;
            }
        }
        const versionedSubslides = this.getVersionedSubslides();
        let slideTitle = `Slide ${this.props.listIndex + 1}`;
        if (versionedSubslides && versionedSubslides.length > 0) {
            const selectedVersion = versionedSubslides.findIndex(vs => vs.articleId === subslide.translationVersionArticleId);
            if (selectedVersion !== -1) {
                slideTitle = <span>Slide {this.props.listIndex + 1} -<small> Translator {selectedVersion + 1}</small> </span>;
            }
        }

        return (
            <React.Fragment>
                {!this.props.preview ? (
                    <Grid.Row>
                        <Grid.Column computer={16} mobile={16}>
                            {translatableArticle.slides[currentSlideIndex] && (
                                <TranslateBox
                                    title={slideTitle}
                                    findAndReplaceModalVisible={this.props.findAndReplaceModalVisible}
                                    onFindAndReplaceSubmit={({ find, replace }) => {
                                        this.props.findAndReplaceText(find, replace);
                                        this.props.setFindAndReplaceModalVisible(false);
                                    }}
                                    onFindAndReplaceOpen={() => this.props.setFindAndReplaceModalVisible(true)}
                                    onFindAndReplaceClose={() => this.props.setFindAndReplaceModalVisible(false)}
                                    value={translatableArticle.slides[currentSlideIndex].content[currentSubslideIndex].text || ''}
                                    onSave={this.onSaveTranslatedText}
                                    disabled={!canModify}
                                    currentSlideIndex={currentSlideIndex}
                                    currentSubslideIndex={currentSubslideIndex}
                                    translationVersionsCount={this.props.translationVersionsCount}
                                    onOpenTranslationVersions={() => this.setState({ translationVersionModalVisible: true })}
                                />
                            )}

                            <div className="c-export-human-voice__recorder-container">

                                {subslide.tmpAudio ? (
                                    <React.Fragment>

                                        <Popup
                                            trigger={
                                                <Button
                                                    icon="check"
                                                    primary
                                                    circular
                                                    style={{ marginRight: 10 }}
                                                    loading={this.isCurrentSlideLoading()}
                                                    disabled={this.isCurrentSlideLoading()}
                                                    onClick={() => {
                                                        this.props.saveRecordedTranslation(slide.position, subslide.position, subslide.recordedBlob);
                                                    }}
                                                />
                                            }
                                            content="Confirm and Upload recorded audio"
                                        />
                                        <Popup
                                            trigger={
                                                <Button
                                                    icon="close"
                                                    color="red"
                                                    circular
                                                    onClick={() => {
                                                        if (subslide.tmpAudio) {
                                                            this.props.deleteTmpRecordedTranslation(slide.position, subslide.position);
                                                        } else {
                                                            this.props.deleteRecordedTranslation(slide.position, subslide.position);
                                                        }
                                                    }}
                                                />
                                            }
                                            content={(subslide.tmpAudio && subslide.audio) ? 'Restore original audio' : 'Delete current record'}
                                        />
                                    </React.Fragment>
                                ) : (
                                        <React.Fragment>
                                            <div className="c-export-human-voice__recorder-mic-container">
                                                {translatableArticle.tts && (
                                                    <React.Fragment>

                                                        <Popup
                                                            content="Re-generate TTS audio"
                                                            trigger={
                                                                <Button
                                                                    primary
                                                                    // size="large"
                                                                    icon="refresh"
                                                                    help="Sync Audio"
                                                                    circular
                                                                    style={{ marginRight: 10 }}
                                                                    loading={this.isCurrentSlideLoading()}
                                                                    disabled={this.isCurrentSlideLoading() || (subslide && subslide.audioSynced)}
                                                                    onClick={() => this.onGenerateTTSAudio()}
                                                                />
                                                            }
                                                        />
                                                    </React.Fragment>
                                                )}
                                                {!translatableArticle.tts && (
                                                    <AudioRecorder
                                                        style={{ marginRight: 10 }}
                                                        record={recording}
                                                        loading={this.isCurrentSlideLoading()}
                                                        showLabel={!subslide.audio}
                                                        disabled={!canModify || this.isCurrentSlideLoading()}
                                                        onStart={this.toggleRecording}
                                                        maxDuration={translatableArticle.slides[currentSlideIndex].content[currentSubslideIndex].media[0].duration}
                                                        className="c-export-human-voice__recorder-mic"
                                                        onStop={this.onRecordingStop}
                                                        backgroundColor="#2185d0"
                                                        strokeColor="#000000"
                                                    />
                                                )}
                                            </div>
                                            {!recording && !translatableArticle.tts && this._renderUploadAudio.bind(this)(!canModify)}
                                        </React.Fragment>
                                    )}
                                {subslide && (subslide.audio || subslide.tmpAudio) && !recording && (
                                    <div className="c-export-human-voice__audio_container" >
                                        <audio
                                            key={`audio-player-${subslide.tmpAudio || subslide.audio}`}
                                            controls
                                            onPlay={this.onPlay}
                                            onPause={this.onPause}
                                            onEnded={this.onEnded}
                                        >
                                            <source src={subslide.tmpAudio || subslide.audio} />
                                            Your browser does not support the audio element.
                                            </audio>

                                        {canModify && subslide && !subslide.tmpAudio && !this.isCurrentSlideLoading() && (
                                            <React.Fragment>
                                                <Popup
                                                    trigger={
                                                        <Icon
                                                            name="close"
                                                            className="c-export-human-voice__clear-record"
                                                            onClick={() => {
                                                                if (subslide.tmpAudio) {
                                                                    this.props.deleteTmpRecordedTranslation(slide.position, subslide.position);
                                                                } else {
                                                                    this.props.deleteRecordedTranslation(slide.position, subslide.position);
                                                                }
                                                            }}
                                                        />
                                                    }
                                                    content={(subslide.tmpAudio && subslide.audio) ? 'Restore original audio' : 'Delete current record'}
                                                />
                                            </React.Fragment>
                                        )}
                                    </div>
                                )}

                            </div>

                            {translatableArticle.tts && canSyncAll && (
                                <Button
                                    primary
                                    circular
                                    loading={this.props.syncAllLoading}
                                    disabled={this.props.syncAllLoading}
                                    onClick={() => this.onSyncAll('tts')}
                                    content="Sync all"
                                />
                            )}
                            {sameLang && (
                                <React.Fragment>

                                    <Button
                                        primary
                                        circular
                                        loading={this.isCurrentSlideLoading()}
                                        disabled={this.isCurrentSlideLoading() || subslide.audioSource === 'original'}
                                        onClick={this.onUpdateAudioFromOriginal}
                                        content="Sync original audio"
                                    />
                                    {canSyncAll && (
                                        <Button
                                            primary
                                            circular
                                            loading={this.props.syncAllLoading}
                                            disabled={this.props.syncAllLoading}
                                            onClick={() => this.onSyncAll('original')}
                                            content="Sync all"
                                        />
                                    )}
                                </React.Fragment>
                            )}
                            {!translatableArticle.tts && (
                                <div>
                                    <small>Maximum limit: {parseInt(translatableArticle.slides[currentSlideIndex].content[currentSubslideIndex].media[0].duration)} seconds</small>
                                </div>
                            )}
                        </Grid.Column>

                        <Grid.Column width={4}>
                        </Grid.Column>
                    </Grid.Row>
                ) : null}
            </React.Fragment>
        )
    }

    render() {
        const {
            originalViewedArticle,
            translatableArticle,
            currentSlideIndex,
            currentSubslideIndex,
            baseLanguages,
            selectedBaseLanguage,
        } = this.props;
        const { slide, subslide } = this.getCurrentSlideAndSubslide();
        const canModify = this.canModify();
        const assignedTranslations = this.getUserAssignedTranslations();
        const selectedTranslator = this.getSelectedTranslator();
        const speakerTranslatorsMap = this.getSpeakersTranslatorsMap();
        const versionedSubslides = this.getVersionedSubslides();

        return (
            <Styled styles={styles}>
                <div>

                    <LoaderComponent active={!this.props.originalViewedArticle || !this.props.translatableArticle || !slide || !subslide}>

                        <Grid style={{ width: '100%' }}>
                            {(!originalViewedArticle || (!translatableArticle || translatableArticle.translationProgress !== 100)) && (
                                <Grid.Row>
                                    <Grid.Column width={16}>
                                        {this.renderLoadingLottie()}
                                    </Grid.Column>
                                </Grid.Row>
                            )}
                            {translatableArticle && translatableArticle.videoSpeedLoading && (
                                <Grid.Row>
                                    <Grid.Column width={16}>
                                        {this.renderSpeedLoadingLottie()}
                                    </Grid.Column>
                                </Grid.Row>
                            )}
                            {originalViewedArticle && translatableArticle && translatableArticle.translationProgress === 100 && !translatableArticle.videoSpeedLoading && (
                                <React.Fragment>
                                    <Grid.Row>
                                        <Grid.Column width={10}>
                                            <Grid>
                                                <Grid.Row>
                                                    <Grid.Column width={16}>
                                                        {originalViewedArticle && (
                                                            <h3>
                                                                {originalViewedArticle.title}
                                                            </h3>
                                                        )}
                                                        {originalViewedArticle.slides[currentSlideIndex] && originalViewedArticle.slides[currentSlideIndex].content[currentSubslideIndex] && (
                                                            <div>
                                                                <ProofreadingVideoPlayerV2
                                                                    inverted
                                                                    width={'100%'}
                                                                    muted={this.props.editorMuted}
                                                                    duration={this.state.duration}
                                                                    currentTime={this.state.currentTime}
                                                                    onVideoLoad={this.onVideoLoad}
                                                                    playing={this.props.editorPlaying}
                                                                    onTimeChange={this.onTimeChange}
                                                                    videoRef={(ref) => this.videoRef = ref}
                                                                    audioRef={(ref) => this.videoAudioRef = ref}
                                                                    text={this.props.ccVisible ? originalViewedArticle.slides[currentSlideIndex].content[currentSubslideIndex].text : ''}
                                                                    url={originalViewedArticle.slides[currentSlideIndex].content[currentSubslideIndex].media[0].url}
                                                                    audio={originalViewedArticle.slides[currentSlideIndex].content[currentSubslideIndex].audio}
                                                                    onPlayToggle={this.onPlayToggle}
                                                                    extraContent={
                                                                        <div>
                                                                            <span style={{ color: '#999999', marginRight: 10 }}>
                                                                                Base Language:
                                                                        </span>
                                                                            <Dropdown
                                                                                style={{ color: '#0e7ceb' }}
                                                                                placeholder="Select base language"
                                                                                text={baseLanguages && baseLanguages.languages ?
                                                                                    <span
                                                                                        style={{ color: '#0e7ceb' }}
                                                                                    >
                                                                                        {displayArticleLanguage(selectedBaseLanguage)}
                                                                                    </span> : ''
                                                                                }
                                                                            >
                                                                                <Dropdown.Menu>
                                                                                    {baseLanguages && baseLanguages.languages ? baseLanguages.languages.map((lang, index) => (
                                                                                        <Dropdown.Item
                                                                                            key={'base-language-dropdown' + index}
                                                                                            active={displayArticleLanguage(lang) === displayArticleLanguage(selectedBaseLanguage)}

                                                                                            onClick={() => this.onChangeBaseLanguage(lang)}
                                                                                        >
                                                                                            {displayArticleLanguage(lang)}
                                                                                        </Dropdown.Item>
                                                                                    )) : (
                                                                                            <Dropdown.Item active>
                                                                                                No base languages available yet
                                                                                            </Dropdown.Item>
                                                                                        )}
                                                                                </Dropdown.Menu>
                                                                            </Dropdown>
                                                                        </div>
                                                                    }
                                                                />
                                                                {this.props.preview && (
                                                                    <audio
                                                                        ref={(ref) => this.audioRef = ref}
                                                                        key={`audio-player-${subslide.tmpAudio || subslide.audio}`}
                                                                        autoPlay={true}
                                                                    >
                                                                        <source src={subslide.audio} />
                                                                        Your browser does not support the audio element.
                                                                    </audio>
                                                                )}
                                                            </div>

                                                        )}
                                                    </Grid.Column>
                                                </Grid.Row>
                                                <Grid.Row
                                                // style={{ margin: 0, padding: 0 }}
                                                >
                                                    <Grid.Column width={16}>
                                                        <div
                                                            style={{
                                                                display: 'flex',
                                                                justifyContent: 'space-between',
                                                            }}
                                                        >
                                                            <div>
                                                                <EditVideoSpeedModal
                                                                    value={this.props.currentSubslide && this.props.currentSubslide.videoSpeed ? this.props.currentSubslide.videoSpeed : 1}
                                                                    slideIndex={this.props.listIndex}
                                                                    onSubmit={this.onVideoSpeedChange}
                                                                />
                                                            </div>
                                                            <div>
                                                                <Popup
                                                                    trigger={
                                                                        <Icon
                                                                            onClick={() => this.props.setCCVisible(!this.props.ccVisible)}
                                                                            color={this.props.ccVisible ? 'blue' : 'green'}
                                                                            name="cc"
                                                                            size="large"
                                                                            style={{ cursor: 'pointer' }}
                                                                        />
                                                                    }
                                                                    content="Toggle subtitles"
                                                                />
                                                            </div>
                                                        </div>
                                                    </Grid.Column>
                                                </Grid.Row>
                                                <Grid.Row>
                                                    <Grid.Column width={16}>
                                                        <CommentsSidebar />
                                                    </Grid.Column>
                                                </Grid.Row>


                                            </Grid>
                                        </Grid.Column>

                                        <Grid.Column width={6}>
                                            <Button
                                                primary
                                                circular
                                                disabled={!this.canExport()}
                                                onClick={this.onExport}
                                                style={{ position: 'absolute', top: '-5.5rem', right: 0 }}
                                            >
                                                Send to Export
                                                <Icon name="arrow right" style={{ marginLeft: 10 }} />
                                            </Button>

                                            <Button
                                                circular
                                                color="green"
                                                size="tiny"
                                                style={{ position: 'absolute', right: 0, top: '-2rem', zIndex: 2 }}
                                                onClick={() => this.setState({ isTranslatingVideoTutorialModalVisible: true })}
                                            >
                                                Translation Tutorial <Icon name="info circle" style={{ marginLeft: 10 }} />
                                            </Button>
                                            <Grid>
                                                {this.props.translatableArticle && this.props.translatableArticle.signLang ? this.renderSignLangUpload() : this.renderTextForm()}
                                                {this.props.selectedSpeakerNumber !== -1 && (
                                                    <Grid.Row>

                                                        <Grid.Column width={16}>
                                                            <div>
                                                                <p>
                                                                    Will be completed on: {selectedTranslator && selectedTranslator.finishDate ? moment(selectedTranslator.finishDate).format('YYYY-MM-DD') : 'Unknown yet'}
                                                                    {canModify && (
                                                                        <Icon
                                                                            name="edit"
                                                                            style={{ marginLeft: 10, cursor: 'pointer' }}
                                                                            onClick={() => this.props.setTranslationSpeakerEndtimeModalVisible(true)}
                                                                        />
                                                                    )}
                                                                </p>
                                                            </div>
                                                        </Grid.Column>
                                                    </Grid.Row>
                                                )}
                                                {/* Show user if he's assigned to translate for any speaker here */}
                                                {assignedTranslations && assignedTranslations.length > 0 ? (
                                                    <strong>
                                                        <span style={{ display: 'inline-block', marginBottom: 10 }}>
                                                            You're assiged to translate for Speaker(s) {assignedTranslations.map(t => t.speakerNumber).join(', ')}
                                                        </span>
                                                    </strong>
                                                ) : (
                                                        <span style={{ display: 'inline-block', marginBottom: 10 }}>
                                                            {(() => {
                                                                const userOrgRole = getUserOrganziationRole(this.props.user, this.props.organization);
                                                                if (!userOrgRole.organizationOwner && userOrgRole.permissions.indexOf('admin') === -1) {
                                                                    return `You're not assigned to this video`;
                                                                }
                                                                return '';
                                                            })()}
                                                        </span>
                                                    )}
                                                <Grid.Row>
                                                    <Grid.Column width={10}>
                                                        <h5>
                                                            ALL SLIDES ({this.props.subslides ? this.props.subslides.length : 0})
                                                            <Button
                                                                basic
                                                                circular
                                                                size="tiny"
                                                                style={{ marginLeft: 10, fontSize: '0.6em' }}
                                                                icon={this.props.preview ? 'pause' : 'play'}
                                                                color="teal"
                                                                onClick={() => {
                                                                    this.onPreviewChange(!this.props.preview)
                                                                    setTimeout(() => {
                                                                        this.onPlayToggle();
                                                                    }, 100);
                                                                }}
                                                            />
                                                        </h5>
                                                    </Grid.Column>
                                                    <Grid.Column width={6} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                        <Dropdown
                                                            direction="left"
                                                            disabled={this.props.preview}
                                                            icon={<Icon name="chevron down" style={{ color: 'rgb(153, 153, 153)' }} />}
                                                            text={<span style={{ color: 'rgb(153, 153, 153)' }}>
                                                                {this.props.selectedSpeakerNumber === -1 ? 'All speakers' : `Speaker ${this.props.selectedSpeakerNumber}`}
                                                            </span>}
                                                        >
                                                            <Dropdown.Menu>
                                                                <Dropdown.Item
                                                                    active={this.props.selectedSpeakerNumber === -1}
                                                                    onClick={() => {
                                                                        this.props.changeSelectedSpeakerNumber(-1);
                                                                        this.onSlideChange(0, 0)
                                                                        this.props.fetchComments();
                                                                    }}
                                                                >
                                                                    <div
                                                                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                                                    >
                                                                        <span>
                                                                            All
                                                                        </span>
                                                                        <RoleRenderer roles={['admin']}>
                                                                            <Popup
                                                                                trigger={
                                                                                    <Button
                                                                                        circular
                                                                                        className="pull-right"
                                                                                        icon="edit"
                                                                                        size="tiny"
                                                                                        basic
                                                                                        onClick={this.onAssignUsersClick}
                                                                                    />
                                                                                }
                                                                                position="top right"
                                                                                content="Update assignees"
                                                                            />
                                                                            {this.renderAssignUsersModal()}
                                                                        </RoleRenderer>
                                                                    </div>
                                                                </Dropdown.Item>
                                                                {originalViewedArticle.speakersProfile.map((sp) => (
                                                                    <Dropdown.Item
                                                                        key={`speaker-dropdown-${sp.speakerNumber}-${sp.speakerGender}`}
                                                                        active={this.props.selectedSpeakerNumber === sp.speakerNumber}
                                                                        onClick={() => {
                                                                            this.onSlideChange(0, 0)
                                                                            this.props.changeSelectedSpeakerNumber(sp.speakerNumber);
                                                                            this.props.fetchComments();
                                                                        }}
                                                                    >
                                                                        <div
                                                                            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                                                        >
                                                                            <span>
                                                                                Speaker {sp.speakerNumber} ({sp.speakerGender})
                                                                            </span>
                                                                            {speakerTranslatorsMap && speakerTranslatorsMap[sp.speakerNumber] && (
                                                                                <Popup
                                                                                    trigger={
                                                                                        <span style={{ marginLeft: 10 }}>
                                                                                            <ReactAvatar
                                                                                                round
                                                                                                size={25}
                                                                                                name={getUserNamePreview(speakerTranslatorsMap[sp.speakerNumber])}
                                                                                            />
                                                                                        </span>
                                                                                    }
                                                                                    content={getUserNamePreview(speakerTranslatorsMap[sp.speakerNumber])}
                                                                                />
                                                                            )}
                                                                        </div>
                                                                    </Dropdown.Item>
                                                                ))}
                                                            </Dropdown.Menu>
                                                        </Dropdown>
                                                    </Grid.Column>
                                                </Grid.Row>
                                                <div style={{ width: '100%' }}>
                                                    <Progress size="small" progress color="green" percent={calculateCompletedArticlePercentage(translatableArticle)} style={{ marginBottom: 0 }} />
                                                </div>
                                                <Grid.Row>
                                                    <Grid.Column width={16}>
                                                        <Grid>
                                                            <SlidesList
                                                                currentSlideIndex={currentSlideIndex}
                                                                currentSubslideIndex={currentSubslideIndex}
                                                                speakerTranslatorsMap={speakerTranslatorsMap}
                                                                slides={translatableArticle.slides}
                                                                onSubslideClick={this.onSlideChange}
                                                                onChatClick={this.onChatClick}
                                                            />
                                                        </Grid>
                                                    </Grid.Column>
                                                </Grid.Row>
                                            </Grid>
                                        </Grid.Column>
                                    </Grid.Row>
                                </React.Fragment>
                            )}
                            {this.renderSpeakerTranslationEndtimeModal()}
                            <TranslationVersionSelectModal
                                open={this.state.translationVersionModalVisible}
                                onClose={() => this.setState({ translationVersionModalVisible: false })}
                                onVersionChange={(translationVersionArticleId) => {
                                    this.setState({ translationVersionModalVisible: false });
                                    this.props.setTranslationVersionForSubslide({ articleId: translatableArticle._id, slidePosition: slide.position, subslidePosition: subslide.position, translationVersionArticleId })
                                }}
                                onTranscribeAll={(translationVersionArticleId) => {
                                    this.props.setTranslationVersionForAllSubslides({ articleId: translatableArticle._id, translationVersionArticleId })
                                }}
                                slide={slide}
                                subslide={subslide}
                                translationVersions={this.props.translationVersions}
                                versionedSubslides={versionedSubslides}
                            />
                            <TranslatingVideoTutorialModal
                                open={this.state.isTranslatingVideoTutorialModalVisible}
                                onClose={() => this.setState({ isTranslatingVideoTutorialModalVisible: false })}
                                showOnStartup={this.props.user && this.props.user.showTranslatingTutorial}
                                onChangeShowOnStartup={(show) => this.props.updateShowTranslationTutorial(show)}
                            />
                        </Grid>

                    </LoaderComponent>
                </div>
            </Styled>

        )
    }
}

const mapStateToProps = ({ translateArticle }) => ({
    ...translateArticle,
    user: translateArticle.user,
    organization: translateArticle.organization,
    organizationUsers: translateArticle.organizationUsers,
})

const mapDispatchToProps = dispatch => ({
    setCurrentSlide: slide => dispatch(translationActions.setCurrentSlide(slide)),
    setCurrentSubslide: subslide => dispatch(translationActions.setCurrentSubslide(subslide)),
    setTranslationVersionForSubslide: (params) => dispatch(translationActions.setTranslationVersionForSubslide(params)),
    setTranslationVersionForAllSubslides: (params) => dispatch(translationActions.setTranslationVersionForAllSubslides(params)),
    fetchTranslatableArticle: (params) => dispatch(translationActions.fetchTranslatableArticle(params)),
    fetchTranslationVersionsCount: (params) => dispatch(translationActions.fetchTranslationVersionsCount(params)),
    fetchTranslationVersions: (params) => dispatch(translationActions.fetchTranslationVersions(params)),
    fetchTranslatableArticleBaseLanguages: ({ articleId }) => dispatch(translationActions.fetchTranslatableArticleBaseLanguages({ articleId })),
    setCurrentEditorIndexes: indexes => dispatch(translationActions.setCurrentEditorIndexes(indexes)),
    
    updateShowTranslationTutorial: (show) => dispatch(translationActions.updateShowTranslationTutorial(show)),

    saveTranslatedText: (slidePositon, subslidePosition, text) => dispatch(translationActions.saveTranslatedText(slidePositon, subslidePosition, text)),
    findAndReplaceText: (find, replace) => dispatch(translationActions.findAndReplaceText(find, replace)),
    setRecording: recording => dispatch(translationActions.setRecording(recording)),
    uploadPictureInPictureVideo: (slidePosition, subslidePosition, blob) => dispatch(translationActions.uploadPictureInPictureVideo(slidePosition, subslidePosition, blob)),
    updatePictureInPicturePosition: (slidePosition, subslidePosition, position) => dispatch(translationActions.updatePictureInPicturePosition(slidePosition, subslidePosition, position)),
    saveRecordedTranslation: (slidePositon, subslidePosition, blob) => dispatch(translationActions.saveRecordedTranslation(slidePositon, subslidePosition, blob)),
    tmpSaveRecordedTranslation: (slidePositon, subslidePosition, blob) => dispatch(translationActions.tmpSaveRecordedTranslation(slidePositon, subslidePosition, blob)),
    deleteRecordedTranslation: (slidePositon, subslidePosition) => dispatch(translationActions.deleteRecordedTranslation(slidePositon, subslidePosition)),
    deleteTmpRecordedTranslation: (slidePositon, subslidePosition) => dispatch(translationActions.deleteTmpRecordedTranslation(slidePositon, subslidePosition)),
    setEditorPlaying: playing => dispatch(translationActions.setEditorPlaying(playing)),
    setEditorMuted: muted => dispatch(translationActions.setEditorMuted(muted)),
    startJob: (options, callFunc) => dispatch(translationActions.startJob(options, callFunc)),
    stopJob: (jobName) => dispatch(translationActions.stopJob(jobName)),
    onPreviewChange: preview => dispatch(translationActions.onPreviewChange(preview)),
    changeSelectedSpeakerNumber: num => dispatch(translationActions.changeSelectedSpeakerNumber(num)),
    updateSubslide: (slidePositon, subslidePosition, audio) => dispatch(translationActions.updateSubslide(slidePositon, subslidePosition, audio)),
    addTTSTranslation: (slidePosition, subslidePosition) => dispatch(translationActions.addTTSTranslation(slidePosition, subslidePosition)),
    syncAllFromTTS: () => dispatch(translationActions.syncAllFromTTS()),
    requestExportTranslationReview: (articleId) => dispatch(translationActions.requestExportTranslationReview(articleId)),
    setTranslationSpeakerEndtimeModalVisible: visible => dispatch(translationActions.setTranslationSpeakerEndtimeModalVisible(visible)),
    updateSpeakerFinishDate: (speakerNumber, timestamp) => dispatch(translationActions.updateSpeakerFinishDate(speakerNumber, timestamp)),
    setCommentsVisible: visible => dispatch(translationActions.setCommentsVisible(visible)),
    setListIndex: index => dispatch(translationActions.setListIndex(index)),
    setMaxListIndex: index => dispatch(translationActions.setMaxListIndex(index)),
    setFindAndReplaceModalVisible: visible => dispatch(translationActions.setFindAndReplaceModalVisible(visible)),
    fetchSubtitles: (articleId) => dispatch(translationActions.fetchSubtitles(articleId)),
    fetchUsers: (organizationId) => dispatch(translationActions.fetchUsers(organizationId)),
    updateTranslators: (articleId, translators) => dispatch(translationActions.updateTranslators(articleId, translators)),
    updateArticleVideoSpeed: (params) => dispatch(translationActions.updateArticleVideoSpeed(params)),
    setCCVisible: visible => dispatch(translationActions.setCCVisible(visible)),
    setCommentsSlidesIndexes: indexes => dispatch(translationActions.setCommentsSlidesIndexes(indexes)),
    setAddCommentSlideIndex: index => dispatch(translationActions.setAddCommentSlideIndex(index)),
    fetchComments: (params) => dispatch(translationActions.fetchComments(params)),
    updateAudioFromOriginal: (slidePosition, subslidePosition) => dispatch(translationActions.updateAudioFromOriginal(slidePosition, subslidePosition)),
    syncAllFromOriginal: () => dispatch(translationActions.syncAllFromOriginal()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Workstation);