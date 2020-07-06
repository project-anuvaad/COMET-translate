import React from 'react';
import { Grid, Button, Icon, Modal, Input, Checkbox } from 'semantic-ui-react';
import { connect } from 'react-redux';


import LoaderComponent from '../../components/LoaderComponent';
import ClearPagination from '../../components/ClearPagination';
import TranslationExportCard from './TranslationExportCard';
import _ from 'lodash';



import * as translateArticleActions from '../../modules/actions';

const FETCH_TRANSLATIONEXPORTS = 'FETCH_TRANSLATIONEXPORTS';
class ExportHistory extends React.Component {
    state = {
        selectedTranslationExport: null,
        translationExportModalVisible: false,
    }
    componentWillMount = () => {
        this.props.setExportHistoryPageNumber(1);
        this.props.fetchTranslationExports(this.props.exportHistoryCurrentPageNumber, true);
        this.props.fetchArticleVideo(this.props.translatableArticle.video);
        this.props.fetchSignLangArticles(this.props.translatableArticle.originalArticle);
        this.props.startJob({ jobName: FETCH_TRANSLATIONEXPORTS, interval: 10000 }, () => {
            this.props.fetchTranslationExports(this.props.exportHistoryCurrentPageNumber, false);
        })
    }

    componentWillUnmount = () => {
        this.props.stopJob(FETCH_TRANSLATIONEXPORTS);
        this.props.setExportHistoryPageNumber(1);
    }

    onPageChange = (e, { activePage }) => {
        this.props.setExportHistoryPageNumber(activePage);
        this.props.fetchTranslationExports(activePage, true);
    }

    onDeclineRequest = translationExport => {
        this.props.declineTranslationExport(translationExport._id);
    }

    onApproveRequest = translationExport => {
        this.props.approveTranslationExport(translationExport._id)
    }

    canApprove = () => {
        const { translatableArticle, user, organization } = this.props;
        if (!translatableArticle || !user || !organization) return false;

        const userRole = user.organizationRoles.find((r) => r.organization._id === organization._id)
        const verifiers = (translatableArticle && translatableArticle.verifiers) || [];

        return userRole && (userRole.organizationOwner || userRole.permissions.indexOf('admin') !== -1 || verifiers.indexOf(user._id) !== -1);
    }

    onOpenTranslationExportSettings = (translationExport) => {
        this.setState({ selectedTranslationExport: translationExport, translationExportModalVisible: true });
    }

    onUpdateTranslationExport = () => {
        const { selectedTranslationExport } = this.state;
        this.setState({ selectedTranslationExport: null, translationExportModalVisible: false });
        const changes = {
            voiceVolume: selectedTranslationExport.voiceVolume,
            backgroundMusicVolume: selectedTranslationExport.backgroundMusicVolume,
            normalizeAudio: selectedTranslationExport.normalizeAudio,
            cancelNoise: selectedTranslationExport.cancelNoise,
        };
        this.props.updateTranslationExportAudioSettings(selectedTranslationExport._id, changes);
    }

    onChangeSelectedVoiceVolume = (volume) => {
        this.setState(({ selectedTranslationExport }) => ({ selectedTranslationExport: { ...selectedTranslationExport, voiceVolume: volume } }));
    }

    onChangeSelectedBackgroundVolume = volume => {
        this.setState(({ selectedTranslationExport }) => ({ selectedTranslationExport: { ...selectedTranslationExport, backgroundMusicVolume: volume } }));
    }

    renderTranslationExportSettings = () => {
        const { selectedTranslationExport, translationExportModalVisible } = this.state;
        return (
            <Modal
                size='tiny'
                open={translationExportModalVisible}
                onClose={() => this.setState({ translationExportModalVisible: false })}
            >
                <Modal.Header>
                    <h3>CONFIRM AUDIO SETTINGS</h3>
                    <Button
                        // basic
                        onClick={() => this.setState({ translationExportModalVisible: false })}
                        className="pull-right"
                        color="white"
                        color="gray"
                        circular
                        icon="close"
                        style={{ position: 'relative', top: '-3rem' }}
                    />
                </Modal.Header>
                {selectedTranslationExport && (

                    <Modal.Content>
                        <Grid style={{ margin: 0 }}>
                            <Grid.Row style={{ borderBottom: '1px solid #eee' }}>
                                <Grid.Column width={8}>
                                   ML Background Noise Cancellation 
                                </Grid.Column>
                                <Grid.Column width={8} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Checkbox
                                        toggle
                                        onChange={(e, { checked }) => {
                                            this.setState({ selectedTranslationExport: { ...selectedTranslationExport, cancelNoise: checked } });
                                        }}
                                        size="huge"
                                        checked={selectedTranslationExport.cancelNoise}
                                    />
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row style={{ borderBottom: '1px solid #eee' }}>
                                <Grid.Column width={8}>
                                    Audio Mastering
                                </Grid.Column>
                                <Grid.Column width={8} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Checkbox
                                        toggle
                                        onChange={(e, { checked }) => {
                                            this.setState({ selectedTranslationExport: { ...selectedTranslationExport, normalizeAudio: checked } });
                                        }}
                                        size="huge"
                                        checked={selectedTranslationExport.normalizeAudio}
                                    />
                                </Grid.Column>
                            </Grid.Row>

                            <Grid.Row style={{ borderBottom: '1px solid #eee' }}>

                                <Grid.Column width={8}>
                                    Voice Volume:
                                </Grid.Column>
                                <Grid.Column width={8} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                                    <Icon
                                        circular
                                        name="minus"
                                        onClick={() => {
                                            if (this.state.selectedTranslationExport.voiceVolume - 0.1 < 0) {
                                                this.onChangeSelectedVoiceVolume(0);
                                            } else {
                                                this.onChangeSelectedVoiceVolume(this.state.selectedTranslationExport.voiceVolume - 0.1);
                                            }
                                        }}
                                        size='small'
                                        style={{ cursor: 'pointer', backgroundColor: '#d4e0ed' }}
                                    />
                                    <Input
                                        style={{ width: 70, marginLeft: 10, marginRight: 10 }}
                                        type="text"
                                        disabled
                                        value={parseInt(selectedTranslationExport.voiceVolume * 100) + '%'}
                                    />
                                    <Icon
                                        circular
                                        name="plus"
                                        onClick={() => {
                                            if (this.state.selectedTranslationExport.voiceVolume + 0.1 > 10) {
                                                this.onChangeSelectedVoiceVolume(10);
                                            } else {
                                                this.onChangeSelectedVoiceVolume(this.state.selectedTranslationExport.voiceVolume + 0.1);
                                            }
                                        }}
                                        size='small'
                                        style={{ cursor: 'pointer', backgroundColor: '#d4e0ed' }}
                                    />

                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row style={{ borderBottom: '1px solid #eee' }}>
                                <Grid.Column width={8}>
                                    Background Music Volume:
                                </Grid.Column>
                                <Grid.Column width={8} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                                    {this.props.video && this.props.video.backgroundMusicUrl ? (
                                        <React.Fragment>
                                            <Icon
                                                circular
                                                name="minus"
                                                onClick={() => {
                                                    if (this.state.selectedTranslationExport.backgroundMusicVolume - 0.1 < 0) {
                                                        this.onChangeSelectedBackgroundVolume(0);
                                                    } else {
                                                        this.onChangeSelectedBackgroundVolume(this.state.selectedTranslationExport.backgroundMusicVolume - 0.1);
                                                    }
                                                }}
                                                size='small'
                                                style={{ cursor: 'pointer', backgroundColor: '#d4e0ed' }}
                                            />
                                            <Input
                                                style={{ width: 70, marginLeft: 10, marginRight: 10 }}
                                                type="text"
                                                disabled
                                                value={parseInt(selectedTranslationExport.backgroundMusicVolume * 100) + '%'}
                                            />
                                            <Icon
                                                circular
                                                name="plus"
                                                onClick={() => {
                                                    if (this.state.selectedTranslationExport.backgroundMusicVolume + 0.1 > 10) {
                                                        this.onChangeSelectedBackgroundVolume(10);
                                                    } else {
                                                        this.onChangeSelectedBackgroundVolume(this.state.selectedTranslationExport.backgroundMusicVolume + 0.1);
                                                    }
                                                }}
                                                size='small'
                                                style={{ cursor: 'pointer', backgroundColor: '#d4e0ed' }}
                                            />

                                        </React.Fragment>
                                    ) : (
                                            <span style={{ color: '#999999', fontSize: 12 }}>No Music uploaded yet</span>
                                        )}
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Modal.Content>
                )}
                <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '1rem' }}>
                    <Button
                        size="large"
                        circular
                        onClick={() => this.setState({ translationExportModalVisible: false })}

                    >Cancel</Button>
                    <Button
                        size="large"
                        circular
                        primary
                        onClick={this.onUpdateTranslationExport}
                    >
                        Confirm
                    </Button>
                </div>
            </Modal>
        )
    }

    renderPagination = () => (
        <Grid.Row>
            <Grid.Column width={16}>
                <div style={{ position: 'absolute', top: '-5.5rem', right: 0 }}>
                    <ClearPagination
                        activePage={this.props.exportHistoryCurrentPageNumber}
                        onPageChange={this.onPageChange}
                        totalPages={this.props.exportHistoryTotalPages}
                    />
                </div>
            </Grid.Column>
        </Grid.Row>
    )


    render() {
        const canGenerateSignLanguage = this.props.signLanguageArticles.length > 0;

        return (
            <LoaderComponent active={this.props.loading}>
                <div>
                    <Grid>
                        {this.renderPagination()}
                        {(!this.props.translationExports || this.props.translationExports.length === 0) && (
                            <Grid.Row>
                                <Grid.Column>
                                    No exports are available here
                                </Grid.Column>
                            </Grid.Row>
                        )}
                        {this.props.translationExports && _.chunk(this.props.translationExports, 4).map((translationExportChunk, index) => (
                            <Grid.Row key={`translation-export-chunk-${index}`} >
                                {translationExportChunk.map((translationExport) => (
                                    <Grid.Column width={4} key={translationExport._id}>
                                        <TranslationExportCard
                                            title={this.props.translatableArticle.title}
                                            thumbnail={this.props.video ? this.props.video.thumbnailUrl : ''}
                                            lang={this.props.translatableArticle.langCode || this.props.translatableArticle.langName}
                                            translationExport={{...translationExport }}
                                            canApprove={this.canApprove()}
                                            canGenerateSignLanguage={canGenerateSignLanguage}
                                            hasBackgroundMusic={this.props.video && this.props.video.backgroundMusicUrl}
                                            onOpenTranslationExportSettings={this.onOpenTranslationExportSettings}
                                            onGenerateTranslationExportSubtitledVideo={this.props.generateTranslationExportSubtitledVideo}
                                            onGenerateTranslationExportSubtitle={this.props.generateTranslationExportSubtitle}
                                            onGenerateTranslationExportAudioArchive={this.props.generateTranslationExportAudioArchive}
                                            onGenerateTranslationExportSubtitledSignLanguage={() => {
                                                this.props.generateTranslationExportSubtitledSignLanguage(translationExport._id, this.props.signLanguageArticles[0]._id)
                                            }}
                                            onApproveRequest={this.onApproveRequest}
                                            onDeclineRequest={this.onDeclineRequest}
                                        />
                                    </Grid.Column>
                                ))}
                            </Grid.Row>
                        ))}
                        {this.renderTranslationExportSettings()}
                    </Grid>
                </div>
            </LoaderComponent>
        )
    }
}

const mapStateToProps = ({ translateArticle }) => ({
    translationExports: translateArticle.translationExports,
    exportHistoryCurrentPageNumber: translateArticle.exportHistoryCurrentPageNumber,
    exportHistoryTotalPages: translateArticle.exportHistoryTotalPages,
    loading: translateArticle.loading,
    organization: translateArticle.organization,
    user: translateArticle.user,
    translatableArticle: translateArticle.translatableArticle,
    video: translateArticle.video,
    signLanguageArticles: translateArticle.signLanguageArticles,
})

const mapDispatchToProps = (dispatch) => ({
    fetchTranslationExports: (loading) => dispatch(translateArticleActions.fetchTranslationExports(loading)),
    setExportHistoryPageNumber: pageNumber => dispatch(translateArticleActions.setExportHistoryPageNumber(pageNumber)),
    generateTranslationExportAudioArchive: translationExportId => dispatch(translateArticleActions.generateTranslationExportAudioArchive(translationExportId)),
    generateTranslationExportSubtitledVideo: translationExportId => dispatch(translateArticleActions.generateTranslationExportSubtitledVideo(translationExportId)),
    generateTranslationExportSubtitle: translationExportId => dispatch(translateArticleActions.generateTranslationExportSubtitle(translationExportId)),
    generateTranslationExportSubtitledSignLanguage: (translationExportId, articleId) => dispatch(translateArticleActions.generateTranslationExportSubtitledSignLanguage(translationExportId, articleId)),
    updateTranslationExportAudioSettings: (translationExportId, changes) => dispatch(translateArticleActions.updateTranslationExportAudioSettings(translationExportId, changes)),
    approveTranslationExport: (translationExportId) => dispatch(translateArticleActions.approveTranslationExport(translationExportId)),
    declineTranslationExport: (translationExportId) => dispatch(translateArticleActions.declineTranslationExport(translationExportId)),
    startJob: (options, callFunc) => dispatch(translateArticleActions.startJob(options, callFunc)),
    stopJob: (jobName) => dispatch(translateArticleActions.stopJob(jobName)),
    fetchArticleVideo: videoId => dispatch(translateArticleActions.fetchArticleVideo(videoId)),
    fetchSignLangArticles: (originalArticle) => dispatch(translateArticleActions.fetchSignLangArticles(originalArticle)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ExportHistory); 