import * as actionTypes from './types';
import Api from '../api';
import querystring from 'query-string';
import requestAgent from '../utils/requestAgent';

// import requestAgent from '../../../../shared/utils/requestAgent';
import NotificationService from '../utils/NotificationService';
import _ from 'lodash';
import { actions as bulkActions } from 'redux-actions-bulk-batch'
import { reduceSlidesSubslides } from '../utils/helpers';
import async from 'async';

const moduleName = 'translateArticle';




export const setCurrentSlide = slide => ({
    type: actionTypes.SET_CURRENT_SLIDE,
    payload: slide,
})

export const setCurrentSubslide = subslide => ({
    type: actionTypes.SET_CURRENT_SUBSLIDE,
    payload: subslide,
})

const setLaoding = loading => ({
    type: actionTypes.SET_LOADING,
    payload: loading,
})

const setTranslationExports = translationExports => ({
    type: actionTypes.SET_TRANSLATION_EXPORTS,
    payload: translationExports,
})

const setOriginalArticle = payload => ({
    type: actionTypes.SET_ORIGINAL_ARTICLE,
    payload,
})

const setTranslatableArticle = (payload) => ({
    type: actionTypes.SET_TRANSLATABLE_ARTICLE,
    payload,
})

const setOriginalTranslatableArticle = (payload) => ({
    type: actionTypes.SET_ORIGINAL_TRANSLATABLE_ARTICLE,
    payload,
})

const setOriginalViewedArticle = payload => ({
    type: actionTypes.SET_ORIGINAL_VIEWED_ARTICLE,
    payload,
})

const setRecordUploadLoading = loading => ({
    type: actionTypes.SET_RECORD_UPLOAD_LOADING,
    payload: loading,
})

const setArticleBaseLanguage = baseLanguages => ({
    type: actionTypes.SET_ARTICLE_BASE_LANGUAGES,
    payload: baseLanguages,
})

const setSelectedBaseLanguage = selectedLang => ({
    type: actionTypes.SET_SELECTED_BASE_LANGUAGE,
    payload: selectedLang,
})

const fetchUserSuccess = (users) => ({
    type: actionTypes.FETCH_USER_SUCCESS,
    payload: users
});

export const setCommentsVisible = visible => ({
    type: actionTypes.SET_COMMENTS_VISIBLE,
    payload: visible,
})

export const setAddCommentLoading = loading => ({
    type: actionTypes.SET_ADD_COMMENT_LOADING,
    payload: loading,
})

export const setComments = comments => ({
    type: actionTypes.SET_COMMENTS,
    payload: comments,
})

export const setListIndex = (index) => ({
    type: actionTypes.SET_LIST_INDEX,
    payload: index,
})

export const setCommentsSlidesIndexes = (indexes) => ({
    type: actionTypes.SET_COMMENTS_SLIDES_INDEXES,
    payload: indexes,
})

export const setAddCommentSlideIndex = slideIndex => ({
    type: actionTypes.SET_ADD_COMMENT_SLIDE_INDEX,
    payload: slideIndex,
})

export const setMaxListIndex = (index) => ({
    type: actionTypes.SET_MAX_LIST_INDEX,
    payload: index,
})

export const setExportHistoryPageNumber = pageNumber => ({
    type: actionTypes.SET_EXPORT_HISTORY_CURRENT_PAGE_NUMBER,
    payload: pageNumber,
})

export const setExportHistoryTotalPages = pagesCount => ({
    type: actionTypes.SET_EXPORT_HISTORY_TOTAL_PAGES,
    payload: pagesCount,
})

export const setActiveTabIndex = index => ({
    type: actionTypes.SET_ACTIVE_TAB_INDEX,
    payload: index,
})

export const setPreview = preview => ({
    type: actionTypes.SET_PREVIEW,
    payload: preview,
})

export const setRecording = recording => ({
    type: actionTypes.SET_TRANSLATION_RECORDING,
    payload: recording,
})

export const setCurrentEditorIndexes = payload => ({
    type: actionTypes.SET_CURRENT_EDITOR_INDEXES,
    payload,
})

export const setCurrentSlideIndex = payload => ({
    type: actionTypes.SET_CURRENT_SLIDE_INDEX,
    payload,
})

export const setCurrentSubslideIndex = payload => ({
    type: actionTypes.SET_CURRENT_SUBSLIDE_INDEX,
    payload,
})

export const setEditorPlaying = playing => ({
    type: actionTypes.SET_EDITOR_PLAYING,
    payload: playing,
})

export const setEditorMuted = muted => ({
    type: actionTypes.SET_EDITOR_MUTED,
    payload: muted,
})

export const setTranslationSpeakerEndtimeModalVisible = visible => ({
    type: actionTypes.SET_SPEKAKER_TRANSLATION_ENDTIME_MODAL_VISIBLE,
    payload: visible,
})

const addLoadingSlide = (slideIndex, subslideIndex) => ({
    type: actionTypes.ADD_LOADING_SLIDE,
    payload: {
        slideIndex,
        subslideIndex,
    }
});

const removeLoadingSlide = (slideIndex, subslideIndex) => ({
    type: actionTypes.REMOVE_LOADING_SLIDe,
    payload: {
        slideIndex,
        subslideIndex,
    }
})

const setVideo = video => ({
    type: actionTypes.SET_ARTICLE_VIDEO,
    payload: video,
})


const setSelectedSpeakerNumber = speakerNumber => ({
    type: actionTypes.SET_SELECTED_SPEAKER_NUMBER,
    payload: speakerNumber,
})

const setTmpViewedArticle = article => ({
    type: actionTypes.SET_TEMP_VIEWED_ARTICLE,
    payload: article,
})

const batchUpdateState = payload => ({
    type: actionTypes.BATCH_UPDATE_STATE,
    payload,
})

const setUserData = (user) => ({
    type: actionTypes.SET_USER,
    payload: user,
})

const setOrganizationData = org => ({
    type: actionTypes.SET_ORGANIZATION,
    payload: org,
})

const setOrganizationUsers = users => ({
    type: actionTypes.SET_ORGANIZATION_USERS,
    payload: users,
})

const addUser = user => ({
    type: actionTypes.ADD_USER,
    payload: user,
})

const fetchUserById = userId => (dispatch) => {
    requestAgent
    .get(Api.user.getById(userId))
    .then(({ body }) => {
        const { user } = body;
        dispatch(addUser(user));
    }) 
    .catch(err => {
        console.log(err);
    })
}



export const fetchUserData = () => dispatch => {
    requestAgent
    .get(Api.user.getUserDetails())
    .then(({ body }) => {
        dispatch(setUserData(body));
    })
    .catch(err => {
        console.log('error getting user data', err);
    })
}


export const fetchOrganizationData = (apiKey) => dispatch => {
    requestAgent
    .get(Api.apiKeys.getByKey(apiKey))
    .then(({ body }) => {
        console.log('============ got organization data', body)
        dispatch(setOrganizationData(body.apiKey.organization))
    })
    .catch(err => {
        console.log('error getting organization data', err);
    })
}



export const startJob = ({ jobName, interval, immediate }, callFunc) => (dispatch, getState) => {
    const { jobs } = getState()[moduleName];
    if (jobs[jobName]) {
        throw new Error(`${jobName} is already registered`);
    }
    if (immediate) {
        callFunc();
    }
    const intervalId = setInterval(() => {
        callFunc()
    }, interval);
    dispatch({ type: actionTypes.START_JOB, payload: { jobName, id: intervalId } });
}

export const stopJob = jobName => (dispatch, getState) => {
    const { jobs } = getState()[moduleName];
    if (jobs[jobName]) {
        clearInterval(jobs[jobName].id);
        dispatch({ type: actionTypes.STOP_JOB, payload: { id: jobs[jobName].id, jobName } });
    }

}

export const setCCVisible = visible => ({
    type: actionTypes.SET_CC_VISIBLE,
    payload: visible,
})

const getUpdatedOrignalTranslatableArticle = (originalTranslatableArticle, slidePosition, subslidePosition, changes) => {
    if (originalTranslatableArticle) {
        const slide = originalTranslatableArticle.slides.find(s => s.position === slidePosition);
        if (slide) {
            const subslide = slide.content.find(s => s.position === subslidePosition);
            if (subslide) {
                Object.keys(changes).forEach((key) => {
                    originalTranslatableArticle.slides.find(s => s.position === slidePosition).content.find(s => s.position === subslidePosition)[key] = changes[key];
                })
                return _.cloneDeep(originalTranslatableArticle)
            }
        }
    }

}

const updateOriginalTranslatableArticle = (slidePosition, subslidePosition, changes) => (dispatch, getState) => {
    const { originalTranslatableArticle } = getState()[moduleName];
    if (originalTranslatableArticle) {
        const slide = originalTranslatableArticle.slides.find(s => s.position === slidePosition);
        if (slide) {
            const subslide = slide.content.find(s => s.position === subslidePosition);
            if (subslide) {
                Object.keys(changes).forEach((key) => {
                    originalTranslatableArticle.slides.find(s => s.position === slidePosition).content.find(s => s.position === subslidePosition)[key] = changes[key];
                })
                dispatch(setOriginalTranslatableArticle(_.cloneDeep(originalTranslatableArticle)));
            }
        }
    }
}
export const updateShowTranslationTutorial = (showTranslatingTutorial) => (dispatch, getState) => {
    requestAgent
    .patch(Api.user.updateShowTranslatingTutorial(), { showTranslatingTutorial })
    .then(() => {
        const { user } = getState()[moduleName];
        user.showTranslatingTutorial = showTranslatingTutorial;
        dispatch(setUserData({ ...user }))
    })
    .catch(err => {
        console.log(err);
        NotificationService.responseError(err);
    })
}
const setStageLoading = loading => ({
    type: actionTypes.SET_STAGE_LOADING,
    payload: loading,
})
export const markTextTranslationAsDone = articleId => dispatch => {
    dispatch(setStageLoading(true))
    requestAgent
    .put(Api.translate.setStageToTextTranslationDone(articleId))
    .then(() => {
        NotificationService.success('Successfuly marked text translation as done');
        dispatch(setStageLoading(false))
        setTimeout(() => {
            window.location.reload();
        }, 1500);
    })
    .catch(err => {
        console.log(err);
        dispatch(setStageLoading(false))
        NotificationService.responseError(err);
    })
}

export const approveTextTranslation = (articleId) => (dispatch) => {

    dispatch(setStageLoading(true))
    requestAgent
    .put(Api.translate.setStageToVoiceoverTranslation(articleId))
    .then(() => {
        NotificationService.success('Successfuly approved text translation');
        dispatch(setStageLoading(false))
        setTimeout(() => {
            window.location.reload();
        }, 1500);
    })
    .catch(err => {
        console.log(err);
        dispatch(setStageLoading(false))
        NotificationService.responseError(err);
    })
}

export const markVoiceTranslationAsDone = (articleId) => (dispatch) => {

    dispatch(setStageLoading(true))
    requestAgent
    .put(Api.translate.setStageToVoiceoverTranslationDone(articleId))
    .then(() => {
        NotificationService.success('Successfuly marked voice over translation as done');
        dispatch(setStageLoading(false))
        setTimeout(() => {
            window.location.reload();
        }, 1500);
    })
    .catch(err => {
        console.log(err);
        dispatch(setStageLoading(false))
        NotificationService.responseError(err);
    })
}

export const approveVoiceoverTranslation = (articleId) => (dispatch) => {
    dispatch(setStageLoading(true))
    requestAgent
    .put(Api.translate.setStageToDone(articleId))
    .then(() => {
        NotificationService.success('Successfuly approved voice over translation');
        dispatch(setStageLoading(false))
        setTimeout(() => {
            window.location.reload();
        }, 1500);
    })
    .catch(err => {
        console.log(err);
        dispatch(setStageLoading(false))
        NotificationService.responseError(err);
    })
}

export const setFindAndReplaceModalVisible = (visible) => ({
    type: actionTypes.SET_FIND_AND_REPLACE_MODAL_VISIBLE,
    payload: visible,
})

export const onPreviewChange = preview => (dispatch, getState) => {
    dispatch(setPreview(preview));
    dispatch(setCurrentSlideIndex(0));
    dispatch(setCurrentSubslideIndex(0));
    dispatch(setListIndex(0))

    const { translatableArticle, originalViewedArticle, tmpViewedArticle } = getState()[moduleName];
    dispatch(bulkActions.startBatchMode())
    if (preview) {
        dispatch(setTmpViewedArticle(originalViewedArticle));
        dispatch(setOriginalViewedArticle(_.cloneDeep(translatableArticle)));

    } else {
        dispatch(setOriginalViewedArticle(_.cloneDeep(tmpViewedArticle)));
        dispatch(setTmpViewedArticle(null));
    }
    dispatch(bulkActions.flushBatchedActions());
}

export const changeSelectedSpeakerNumber = speakerNumber => (dispatch, getState) => {
    
    const { originalTranslatableArticle, originalArticle } = getState()[moduleName];
    if (originalTranslatableArticle) {

        const translatableArticle = _.cloneDeep(originalTranslatableArticle);
        const originalViewedArticle = _.cloneDeep(originalArticle)
        if (speakerNumber !== -1 && originalTranslatableArticle && originalArticle) {
            translatableArticle.slides.forEach((slide) => {
                slide.content = slide.content.filter((subslide) => subslide.speakerProfile.speakerNumber === speakerNumber);
            })
            translatableArticle.slides = translatableArticle.slides.filter((s) => s.content.length !== 0);

            originalViewedArticle.slides.forEach((slide) => {
                slide.content = slide.content.filter((subslide) => subslide.speakerProfile.speakerNumber === speakerNumber);
            })
            originalViewedArticle.slides = originalViewedArticle.slides.filter((s) => s.content.length > 0);
        }
        dispatch(bulkActions.startBatchMode());
        
        dispatch(setCurrentSlideIndex(0));
        dispatch(setCurrentSubslideIndex(0));
        dispatch(setListIndex(0))
        dispatch(setSelectedSpeakerNumber(speakerNumber));
        dispatch(setTranslatableArticle(translatableArticle));
        dispatch(setOriginalViewedArticle(originalViewedArticle))
        dispatch(bulkActions.flushBatchedActions());
    } else {
        dispatch(setSelectedSpeakerNumber(speakerNumber));
    }
    

}

export const fetchTranslatableArticleBaseLanguages = ({ articleId }) => (dispatch, getState) => {
    requestAgent
    .get(Api.translate.getTranslatableArticleBaseLanguages(articleId))
    .then((res) => {
        const { originalLanguage, languages } = res.body;
        dispatch(setArticleBaseLanguage({ originalLanguage, languages: [originalLanguage].concat(languages) }));
    })
    .catch(err => {
        console.log('error getting base language', err);
    })
}


const setTranslationVersionsCount = count => ({
    type: actionTypes.SET_TRANSLATION_VERSIONS_COUNT,
    payload: count,
})
// fetchTranslationVersions
export const fetchTranslationVersionsCount = ({ articleId }) => (dispatch, getState) => {
    requestAgent
    .get(Api.translate.getTranslationVersionsCount(articleId))
    .then((res) => {
        const { count } = res.body;
        dispatch(setTranslationVersionsCount(count))
    })
    .catch((err) => {
        console.log(err);
        NotificationService.responseError(err);
    })
}

const setTranslationVersions = articles => ({
    type: actionTypes.SET_TRANSLATION_VERSIONS,
    payload: articles,
})
// fetchTranslationVersions
export const fetchTranslationVersions = ({ articleId }) => (dispatch, getState) => {
    requestAgent
    .get(Api.translate.getTranslationVersions(articleId))
    .then((res) => {
        const { articles } = res.body;
        dispatch(setTranslationVersions(articles))
    })
    .catch((err) => {
        console.log(err);
        NotificationService.responseError(err);
    })
}

export const setTranslationVersionForSubslide = ({ articleId, slidePosition, subslidePosition, translationVersionArticleId }) => (dispatch, getState) => {
    requestAgent
    .post(Api.translate.setTranslationVersionForSubslide(articleId), { slidePosition, subslidePosition, translationVersionArticleId })
    .then(({ body }) => {
        console.log(body)
        const { subslide } = body;
        const { translatableArticle } = getState()[moduleName]
        const slideIndex = translatableArticle.slides.findIndex((s) => s.position === slidePosition);
        const subslideIndex = translatableArticle.slides[slideIndex].content.findIndex((s) => s.position === subslidePosition);
        const changes = {}
        Object.keys(subslide).forEach(key => {
            translatableArticle.slides[slideIndex].content[subslideIndex][key] = subslide[key];    
            changes[key] = subslide[key];
        })
        dispatch(bulkActions.startBatchMode());
        dispatch(setTranslatableArticle({ ...translatableArticle }));
        dispatch(updateOriginalTranslatableArticle(slidePosition, subslidePosition, changes))
        dispatch(bulkActions.flushBatchedActions());
    })
    .catch(err => {
        console.log(err);
        NotificationService.responseError(err);
    })
}
export const setTranslationVersionForAllSubslides = ({ articleId,  translationVersionArticleId }) => (dispatch, getState) => {
    requestAgent
    .post(Api.translate.setTranslationVersionForAllSubslides(articleId), { translationVersionArticleId })
    .then(({ body }) => {
      window.location.reload()
    })
    .catch(err => {
        console.log(err);
        NotificationService.responseError(err);
    })
}

export const fetchTranslatableArticle = ({ articleId, loading = true, langCode, langName, tts }) => (dispatch, getState) => {
    if (loading) {
        dispatch(setOriginalArticle(null));
        dispatch(setTranslatableArticle(null));
    }
    requestAgent
    .get(Api.translate.getTranslatableArticle(articleId,  {langCode, langName, tts} ))
    .then((res) => {
        const { article, originalArticle } = res.body;
        dispatch(fetchArticleVideo(article.video));
        const subslides = reduceSlidesSubslides(article.slides);
        subslides.forEach((subslide, index) => {
            subslide.index = index;
        })


        // Set the video of viewed article to the one from the translatableArticle
        originalArticle.slides.forEach((slide, slideIndex) => {
            slide.content.forEach((subslide, subslideIndex) => {
                subslide.media = article.slides[slideIndex].content[subslideIndex].media;
            })
        })


        const { selectedSpeakerNumber, currentSlide, currentSubslide } = getState()[moduleName];
        const update = {
            originalArticle: _.cloneDeep(originalArticle),
            originalViewedArticle: _.cloneDeep(originalArticle),
            translatableArticle: _.cloneDeep(article),
            originalTranslatableArticle: _.cloneDeep(article),
            subslides,
            maxListIndex: subslides.length - 1,
        }
        if (!currentSlide && loading) {
            update.listIndex = 0;
            update.currentSlide = article.slides[0];
            update.currentSubslide = article.slides[0].content[0];
        } else if (!loading && currentSlide && currentSubslide) {
            const newSlide = article.slides.find(s => s.position === currentSlide.position);
            const newSubslide = newSlide.content.find(s => s.position === currentSubslide.position);
            update.currentSlide = newSlide;
            update.currentSubslide = newSubslide;
        }
        dispatch(batchUpdateState(update));
        if (loading) {
            // fetch article textTranslators and translators
            if (article.textTranslators && article.textTranslators.length > 0) {
                article.textTranslators.forEach(t => {
                    dispatch(fetchUserById(t.user))
                })
            }
            if (article.translators && article.translators.length > 0) {
                article.translators.forEach(t => {
                    dispatch(fetchUserById(t.user))
                })
            }
            if (article.verifiers && article.verifiers.length > 0) {
                article.verifiers.forEach(t => {
                    dispatch(fetchUserById(t))
                })
            }
            // If there was prevously selected speaker, change the new viewed article's speaker
            if (selectedSpeakerNumber !== -1 && article.speakersProfile.find(s => s.speakerNumber === selectedSpeakerNumber)) {
                dispatch(changeSelectedSpeakerNumber(selectedSpeakerNumber))
            } else {
                dispatch(changeSelectedSpeakerNumber(-1))
            }
            // Set selected display language as the one from the translatable article
            const selectedLang = {
                langCode: originalArticle.langCode,
                langName: originalArticle.langName || '',
                tts: originalArticle.tts,
            };
            dispatch(setSelectedBaseLanguage(selectedLang));

            let {
                comment,
                slideIndex,
                slidePosition,
                subslidePosition,
            } = querystring.parse(window.location.search);

            if (comment && slideIndex) {
                setTimeout(() => {
                    const currentSlideIndex = article.slides.findIndex(s => s.position === parseInt(slidePosition));
                    const currentSubslideIndex = article.slides[currentSlideIndex].content.findIndex(s => s.position === parseInt(subslidePosition));
                    dispatch(setCurrentEditorIndexes({ currentSlideIndex, currentSubslideIndex }))
                    dispatch(setListIndex(parseInt(slideIndex) + 1))
                    dispatch(setCommentsVisible(true))
                }, 500);
            }
        }
    })
    .catch((err) => {
        console.log(err);
        NotificationService.responseError(err);
        // dispatch(push(routes.organziationTranslations()))
    })
}

export const updateSubslide = (slidePosition, subslidePosition, changes) => (dispatch, getState) => {
    const { translatableArticle, originalTranslatableArticle } = getState()[moduleName];
    const slide = translatableArticle.slides.find(s => s.position === slidePosition);
    if (slide) {
        const subslide = slide.content.find(s => s.position === subslidePosition)
        if (subslide) {
            Object.keys(changes).forEach((key) => {
                subslide[key] = changes[key]; 
            })
            const updates = {
                translatableArticle: _.cloneDeep(translatableArticle),
            }
            const updatedOriginalTranslatableArticle = getUpdatedOrignalTranslatableArticle(originalTranslatableArticle, slidePosition, subslidePosition, changes);
            if (updatedOriginalTranslatableArticle) {
                updates.originalTranslatableArticle = updatedOriginalTranslatableArticle;
            }
            dispatch(batchUpdateState(updates));
        }

    }
}

export const saveTranslatedText = (slidePosition, subslidePosition, text) => (dispatch, getState) => {
    const { translatableArticle } = getState()[moduleName]
    requestAgent
    .post(Api.translate.addTranslatedText(translatableArticle._id), { slidePosition, subslidePosition, text })
    .then((res) => {
        const { translatableArticle } = getState()[moduleName]
        const { slidePosition, subslidePosition, ...rest } = res.body;
        const slideIndex = translatableArticle.slides.findIndex((s) => s.position === slidePosition);
        const subslideIndex = translatableArticle.slides[slideIndex].content.findIndex((s) => s.position === subslidePosition);
        const changes = {}
        Object.keys(rest).forEach(key => {
            translatableArticle.slides[slideIndex].content[subslideIndex][key] = rest[key];    
            changes[key] = rest[key];
        })
        dispatch(bulkActions.startBatchMode());
        dispatch(setTranslatableArticle({ ...translatableArticle }));
        dispatch(updateOriginalTranslatableArticle(slidePosition, subslidePosition, changes))
        dispatch(bulkActions.flushBatchedActions());
    })
    .catch((err) => {
        console.log(err);

        const slideIndex = translatableArticle.slides.findIndex((s) => s.position === slidePosition);
        const subslideIndex = translatableArticle.slides[slideIndex].content.findIndex((s) => s.position === subslidePosition);
        translatableArticle.slides[slideIndex].content[subslideIndex] = { ... translatableArticle.slides[slideIndex].content[subslideIndex] };
        dispatch(bulkActions.startBatchMode());
        dispatch(setTranslatableArticle({ ...translatableArticle }));
        dispatch(updateOriginalTranslatableArticle(slidePosition, subslidePosition, { text }))
        dispatch(bulkActions.flushBatchedActions());
        NotificationService.responseError(err);
    })
}

export const findAndReplaceText = (find, replace) => (dispatch, getState) => {
    const { translatableArticle, currentSlideIndex, currentSubslideIndex, selectedSpeakerNumber } = getState()[moduleName]
    // dispatch(setTranslatableArticle(null));
    requestAgent
    .post(Api.translate.findAndReplaceText(translatableArticle._id), { find, replace })
    .then((res) => {
        console.log(res.body);
        const { article } = res.body;
        const update = {
            translatableArticle: _.cloneDeep(article),
            originalTranslatableArticle: _.cloneDeep(article),
        }
        dispatch(batchUpdateState(update));
        dispatch(changeSelectedSpeakerNumber(selectedSpeakerNumber))
        dispatch(setCurrentEditorIndexes({ currentSlideIndex, currentSubslideIndex }));
    })
    .catch((err) => {
        console.log(err);
        dispatch(setTranslatableArticle(translatableArticle));
        NotificationService.responseError(err);
    })
}

export const updateAudioFromOriginal = (slidePosition, subslidePosition) => (dispatch, getState) => {
    // dispatch(setRecordUploadLoading(true));
    const { translatableArticle } = getState()[moduleName]
    const slideIndex = translatableArticle.slides.findIndex((s) => s.position === slidePosition);
    const subslideIndex = translatableArticle.slides[slideIndex].content.findIndex((s) => s.position === subslidePosition);
    const oldAudio = translatableArticle.slides[slideIndex].content[subslideIndex].audio;
    translatableArticle.slides[slideIndex].content[subslideIndex].audio = '';
    dispatch(bulkActions.startBatchMode())
    dispatch(addLoadingSlide(slideIndex, subslideIndex));
    dispatch(setTranslatableArticle(_.cloneDeep(translatableArticle)));
    dispatch(updateOriginalTranslatableArticle(slidePosition, subslidePosition, { audio: '' }))
    dispatch(bulkActions.flushBatchedActions())

    requestAgent.post(Api.translate.updateAudioFromOriginal(translatableArticle._id), { slidePosition, subslidePosition })
    .then((res) => {
        const { translatableArticle, originalTranslatableArticle } = getState()[moduleName]

        translatableArticle.slides[slideIndex].content[subslideIndex].audio = res.body.audio;
        translatableArticle.slides[slideIndex].content[subslideIndex].audioSynced = res.body.audioSynced;
        translatableArticle.slides[slideIndex].content[subslideIndex].audioSource = 'original';

        const updates = {
            translatableArticle: _.cloneDeep(translatableArticle),
            editorMuted: false,
            editorPlaying: false,
            recordUploadLoading: false,

        }
        const updatedOriginalTranslatableArticle = getUpdatedOrignalTranslatableArticle(originalTranslatableArticle, slidePosition, subslidePosition, { audio: res.body.audio });
        if (updatedOriginalTranslatableArticle) {
            updates.originalTranslatableArticle = updatedOriginalTranslatableArticle;
        }
        dispatch(batchUpdateState(updates));
        dispatch(removeLoadingSlide(slideIndex, subslideIndex));

    })
    .catch((err) =>{
        console.log(err);

        const { translatableArticle, originalTranslatableArticle } = getState()[moduleName]

        translatableArticle.slides[slideIndex].content[subslideIndex].audio = oldAudio;
        const updates = {
            translatableArticle: _.cloneDeep(translatableArticle),
            editorMuted: false,
            editorPlaying: false,
            recordUploadLoading: false,
        }

        const updatedOriginalTranslatableArticle = getUpdatedOrignalTranslatableArticle(originalTranslatableArticle, slidePosition, subslidePosition, { audio: oldAudio });
        if (updatedOriginalTranslatableArticle) {
            updates.originalTranslatableArticle = updatedOriginalTranslatableArticle;
        }
        dispatch(batchUpdateState(updates));
        dispatch(removeLoadingSlide(slideIndex, subslideIndex));
        NotificationService.responseError(err);
    })
}

const setSyncAllLoading = loading => ({ 
    type: actionTypes.SET_SYNC_ALL_LOADING,
    payload: loading,
})

export const syncAllFromOriginal = () => (dispatch, getState) => {
    // dispatch(setRecordUploadLoading(true));
    dispatch(setSyncAllLoading(true))
    const { translatableArticle } = getState()[moduleName];
    const subslides = translatableArticle.slides.reduce((acc, s) => s.content ? acc.concat(s.content.map((ss) => ({ ...ss, slidePosition: s.position, subslidePosition: ss.position }))) : acc , []).filter((s) => !s.audio || s.audioSource !== 'original')
    console.log('subslides are', subslides);
    const syncFuncArray = [];

    subslides.forEach(({ slidePosition, subslidePosition }) => {
        syncFuncArray.push(cb => {
            requestAgent.post(Api.translate.updateAudioFromOriginal(translatableArticle._id), { slidePosition, subslidePosition })
            .then((res) => {
                return cb();    
            })
            .catch((err) =>{
                return cb();
            })
        })    
    })

    async.series(syncFuncArray, () => {
        NotificationService.success('Updated successfully');
        dispatch(fetchTranslatableArticle({ articleId: translatableArticle._id }));
        dispatch(setSyncAllLoading(false))
    })

}

export const syncAllFromTTS = () => (dispatch, getState) => {
    dispatch(setSyncAllLoading(true));
    const { translatableArticle } = getState()[moduleName]
    
    const subslides = translatableArticle.slides.reduce((acc, s) => s.content ? acc.concat(s.content.map((ss) => ({ ...ss, slidePosition: s.position, subslidePosition: ss.position }))) : acc , []).filter((s) => !s.audio || !s.audioSynced)
    console.log('subslides', subslides);
    const syncFuncArray = [];
    subslides.forEach(({ slidePosition, subslidePosition }) => {
        syncFuncArray.push(cb => {
            requestAgent.post(Api.translate.addTTSTranslation(translatableArticle._id), { slidePosition, subslidePosition })
            .then((res) => {
                cb();                
            })
            .catch((err) =>{
                cb();
            })
        })    
    })

    async.series(syncFuncArray, () => {
        NotificationService.success('Updated successfully');
        dispatch(fetchTranslatableArticle({ articleId: translatableArticle._id }));
        dispatch(setSyncAllLoading(false))
    })

}

export const addTTSTranslation = (slidePosition, subslidePosition) => (dispatch, getState) => {
  // dispatch(setRecordUploadLoading(true));
  const { translatableArticle } = getState()[moduleName]
  const slideIndex = translatableArticle.slides.findIndex((s) => s.position === slidePosition);
  const subslideIndex = translatableArticle.slides[slideIndex].content.findIndex((s) => s.position === subslidePosition);
  const oldAudio = translatableArticle.slides[slideIndex].content[subslideIndex].audio;
  translatableArticle.slides[slideIndex].content[subslideIndex].audio = '';
  dispatch(bulkActions.startBatchMode())
  dispatch(addLoadingSlide(slideIndex, subslideIndex));
  dispatch(setTranslatableArticle(_.cloneDeep(translatableArticle)));
  dispatch(updateOriginalTranslatableArticle(slidePosition, subslidePosition, { audio: '' }))
  dispatch(bulkActions.flushBatchedActions())

  requestAgent.post(Api.translate.addTTSTranslation(translatableArticle._id), { slidePosition, subslidePosition })
  .then((res) => {
      const { translatableArticle, originalTranslatableArticle } = getState()[moduleName]
    
      const { slidePosition, subslidePosition, ...rest } = res.body;
      Object.keys(rest).forEach(key => {
        translatableArticle.slides[slideIndex].content[subslideIndex][key] = rest[key];
      })

      translatableArticle.slides[slideIndex].content[subslideIndex].audioSource = 'tts';
      const updates = {
          translatableArticle: _.cloneDeep(translatableArticle),
          editorMuted: false,
          editorPlaying: false,
          recordUploadLoading: false,

      }
      const updatedOriginalTranslatableArticle = getUpdatedOrignalTranslatableArticle(originalTranslatableArticle, slidePosition, subslidePosition, rest);
      if (updatedOriginalTranslatableArticle) {
          updates.originalTranslatableArticle = updatedOriginalTranslatableArticle;
      }
      dispatch(batchUpdateState(updates));
      dispatch(removeLoadingSlide(slideIndex, subslideIndex));

  })
  .catch((err) =>{
      console.log(err);

      const { translatableArticle, originalTranslatableArticle } = getState()[moduleName]

      translatableArticle.slides[slideIndex].content[subslideIndex].audio = oldAudio;
      const updates = {
          translatableArticle: _.cloneDeep(translatableArticle),
          editorMuted: false,
          editorPlaying: false,
          recordUploadLoading: false,
      }

      const updatedOriginalTranslatableArticle = getUpdatedOrignalTranslatableArticle(originalTranslatableArticle, slidePosition, subslidePosition, { audio: oldAudio });
      if (updatedOriginalTranslatableArticle) {
          updates.originalTranslatableArticle = updatedOriginalTranslatableArticle;
      }
      dispatch(batchUpdateState(updates));
      dispatch(removeLoadingSlide(slideIndex, subslideIndex));
      NotificationService.responseError(err);
  })
}

export const tmpSaveRecordedTranslation = (slidePosition, subslidePosition, blob) => (dispatch, getState) => {
     const { translatableArticle } = getState()[moduleName]
     const url = URL.createObjectURL(blob);
     const slideIndex = translatableArticle.slides.findIndex((s) => s.position === slidePosition);
     const subslideIndex = translatableArticle.slides[slideIndex].content.findIndex((s) => s.position === subslidePosition);

     translatableArticle.slides[slideIndex].content[subslideIndex].recordedBlob = blob;
     translatableArticle.slides[slideIndex].content[subslideIndex].tmpAudio = url;
     
     dispatch(updateOriginalTranslatableArticle(slidePosition, subslidePosition, { tmpAudio: url, recordedBlob: blob, }))
 
     const updates = {
         translatableArticle: _.cloneDeep(translatableArticle),
         editorMuted: false,
         editorPlaying: false,
         recordUploadLoading: false,

     }
     dispatch(batchUpdateState(updates));
     
}

const setUploadPictureInPictureLoading = loading => ({
    type: actionTypes.SET_UPLOAD_PICTURE_IN_PICTURE_LOADING,
    payload: loading,
}) 

export const uploadPictureInPictureVideo = (slidePosition, subslidePosition, blob) => (dispatch, getState) => {
    const { translatableArticle } = getState()[moduleName]
    const slideIndex = translatableArticle.slides.findIndex((s) => s.position === slidePosition);
    const subslideIndex = translatableArticle.slides[slideIndex].content.findIndex((s) => s.position === subslidePosition);
    dispatch(setUploadPictureInPictureLoading(true));
    // dispatch(addLoadingSlide(slideIndex, subslideIndex));

    requestAgent.post(Api.translate.addPictureInPicture(translatableArticle._id))
    .field('slidePosition', slidePosition)
    .field('subslidePosition', subslidePosition)
    .attach('file', blob)
    .then((res) => {
        const { translatableArticle, originalTranslatableArticle } = getState()[moduleName]

        translatableArticle.slides[slideIndex].content[subslideIndex].picInPicVideoUrl = res.body.picInPicVideoUrl;

        const updates = {
            translatableArticle: _.cloneDeep(translatableArticle),
            editorMuted: false,
            editorPlaying: false,
            recordUploadLoading: false,

        }
        const updatedOriginalTranslatableArticle = getUpdatedOrignalTranslatableArticle(originalTranslatableArticle, slidePosition, subslidePosition, { picInPicVideoUrl: res.body.picInPicVideoUrl });
        if (updatedOriginalTranslatableArticle) {
            updates.originalTranslatableArticle = updatedOriginalTranslatableArticle;
        }
        dispatch(batchUpdateState(updates));
        dispatch(setUploadPictureInPictureLoading(false));
    })
    .catch((err) => {
        console.log(err);

        dispatch(setUploadPictureInPictureLoading(false));
        NotificationService.responseError(err);
    })
}

export const updatePictureInPicturePosition = (slidePosition, subslidePosition, picInPicPosition) => (dispatch, getState) => {
    const { translatableArticle } = getState()[moduleName]
    const slideIndex = translatableArticle.slides.findIndex((s) => s.position === slidePosition);
    const subslideIndex = translatableArticle.slides[slideIndex].content.findIndex((s) => s.position === subslidePosition);

    requestAgent.patch(Api.translate.updatePictureInPicturePosition(translatableArticle._id), { slidePosition, subslidePosition, picInPicPosition })
    .then((res) => {
        const { translatableArticle, originalTranslatableArticle } = getState()[moduleName]

        translatableArticle.slides[slideIndex].content[subslideIndex].picInPicPosition = res.body.picInPicPosition;

        const updates = {
            translatableArticle: _.cloneDeep(translatableArticle),
        }
        const updatedOriginalTranslatableArticle = getUpdatedOrignalTranslatableArticle(originalTranslatableArticle, slidePosition, subslidePosition, { picInPicPosition: res.body.picInPicPosition });
        if (updatedOriginalTranslatableArticle) {
            updates.originalTranslatableArticle = updatedOriginalTranslatableArticle;
        }
        dispatch(batchUpdateState(updates));
    })
    .catch((err) => {
        console.log(err);
        NotificationService.responseError(err);
    })
}


export const saveRecordedTranslation = (slidePosition, subslidePosition, blob) => (dispatch, getState) => {
    // dispatch(setRecordUploadLoading(true));
    if (!blob) {
        return NotificationService.error('Something went wrong. please re-record this slide');
    }
    const { translatableArticle } = getState()[moduleName]
    const url = URL.createObjectURL(blob);
    const slideIndex = translatableArticle.slides.findIndex((s) => s.position === slidePosition);
    const subslideIndex = translatableArticle.slides[slideIndex].content.findIndex((s) => s.position === subslidePosition);
    const oldAudio = translatableArticle.slides[slideIndex].content[subslideIndex].audio;
    translatableArticle.slides[slideIndex].content[subslideIndex].tmpAudio = url;
    dispatch(bulkActions.startBatchMode())
    dispatch(addLoadingSlide(slideIndex, subslideIndex));
    dispatch(setTranslatableArticle(_.cloneDeep(translatableArticle)));
    dispatch(updateOriginalTranslatableArticle(slidePosition, subslidePosition, { audio: url }))
    dispatch(bulkActions.flushBatchedActions())

    requestAgent.post(Api.translate.addRecordedTranslation(translatableArticle._id))
    .field('slidePosition', slidePosition)
    .field('subslidePosition', subslidePosition)
    .field('file', blob)
    .then((res) => {
        const { translatableArticle, originalTranslatableArticle } = getState()[moduleName]
        const { slidePosition, subslidePosition, ...rest } = res.body;
        Object.keys(rest).forEach(key => {
            translatableArticle.slides[slideIndex].content[subslideIndex][key] = rest[key];
        })

        translatableArticle.slides[slideIndex].content[subslideIndex].oldAudio = null;
        translatableArticle.slides[slideIndex].content[subslideIndex].recordedBlob = null;
        translatableArticle.slides[slideIndex].content[subslideIndex].tmpAudio = '';

        const updates = {
            translatableArticle: _.cloneDeep(translatableArticle),
            editorMuted: false,
            editorPlaying: false,
            recordUploadLoading: false,

        }
        const updatedOriginalTranslatableArticle = getUpdatedOrignalTranslatableArticle(originalTranslatableArticle, slidePosition, subslidePosition, { audio: res.body.audio, oldAudio: null, recordedBlob: null, tmpAudio: false });
        if (updatedOriginalTranslatableArticle) {
            updates.originalTranslatableArticle = updatedOriginalTranslatableArticle;
        }
        dispatch(batchUpdateState(updates));
        dispatch(removeLoadingSlide(slideIndex, subslideIndex));

    })
    .catch((err) => {
        console.log(err);

        const { translatableArticle, originalTranslatableArticle } = getState()[moduleName]

        translatableArticle.slides[slideIndex].content[subslideIndex].audio = oldAudio;
        const updates = {
            translatableArticle: _.cloneDeep(translatableArticle),
            editorMuted: false,
            editorPlaying: false,
            recordUploadLoading: false,
        }

        const updatedOriginalTranslatableArticle = getUpdatedOrignalTranslatableArticle(originalTranslatableArticle, slidePosition, subslidePosition, { audio: oldAudio });
        if (updatedOriginalTranslatableArticle) {
            updates.originalTranslatableArticle = updatedOriginalTranslatableArticle;
        }
        dispatch(batchUpdateState(updates));
        dispatch(removeLoadingSlide(slideIndex, subslideIndex));
        NotificationService.responseError(err);
    })
}

export const deleteTmpRecordedTranslation = (slidePosition, subslidePosition) => (dispatch, getState) => {
    const { translatableArticle } = getState()[moduleName]
    const slideIndex = translatableArticle.slides.findIndex((s) => s.position === slidePosition);
    const subslideIndex = translatableArticle.slides[slideIndex].content.findIndex((s) => s.position === subslidePosition);

    translatableArticle.slides[slideIndex].content[subslideIndex].tmpAudio = '';
    translatableArticle.slides[slideIndex].content[subslideIndex].recordedBlob = null;

    dispatch(updateOriginalTranslatableArticle(slidePosition, subslidePosition, { tmpAudio: '', recordedBlob: null, }))

    const updates = {
        translatableArticle: _.cloneDeep(translatableArticle),
    }
    dispatch(batchUpdateState(updates));
}

export const deleteRecordedTranslation = (slidePosition, subslidePosition) => (dispatch, getState) => {
    // dispatch(setRecordUploadLoading(true));
    const { translatableArticle } = getState()[moduleName]
    const slideIndex = translatableArticle.slides.findIndex((s) => s.position === slidePosition);
    const subslideIndex = translatableArticle.slides[slideIndex].content.findIndex((s) => s.position === subslidePosition);
    dispatch(addLoadingSlide(slideIndex, subslideIndex));

    requestAgent.delete(Api.translate.deleteRecordedTranslation(translatableArticle._id), { slidePosition, subslidePosition })
    .then((res) => {
        const { translatableArticle, originalTranslatableArticle } = getState()[moduleName]
        const { slidePosition, subslidePosition, ...rest} = res.body;
        Object.keys(rest).forEach(key => {
            translatableArticle.slides[slideIndex].content[subslideIndex][key] = rest[key];
        })

        const updates = {
            translatableArticle: _.cloneDeep(translatableArticle),
        }
        const updatedOriginalTranslatableArticle = getUpdatedOrignalTranslatableArticle(originalTranslatableArticle, slidePosition, subslidePosition, { audio: '', audioSynced: false });
        if (updatedOriginalTranslatableArticle) {
            updates.originalTranslatableArticle = updatedOriginalTranslatableArticle;
        }
        dispatch(batchUpdateState(updates));
        dispatch(removeLoadingSlide(slideIndex, subslideIndex));
    })
    .catch((err) => {
        console.log(err);
        dispatch(removeLoadingSlide(slideIndex, subslideIndex));
        NotificationService.responseError(err);
    })
}


export const updateTranslators = (articleId, translators) => (dispatch, getState) => {
    const { translatableArticle, originalTranslatableArticle } = getState()[moduleName]
    dispatch(setTranslatableArticle(null));
    
    requestAgent
    .put(Api.article.updateTranslators(articleId), { translators })
    .then((res) => {
        const { translators } = res.body;
        translatableArticle.translators = translators;
        originalTranslatableArticle.translators = translators;

        const updates = {
            translatableArticle: _.cloneDeep(translatableArticle),
            originalTranslatableArticle: _.cloneDeep(originalTranslatableArticle),
        }
        dispatch(batchUpdateState(updates));
        NotificationService.success('Updated Successfully!');
    })
    .catch((err) => {
        NotificationService.responseError(err);
        console.log(err);
        dispatch(setTranslatableArticle(translatableArticle))
    })   
    
}




export const updateSpeakerFinishDate = (speakerNumber, timestamp) => (dispatch, getState) => {

    const { translatableArticle } = getState()[moduleName]
    requestAgent.patch(Api.article.updateTranslatorsFinishDate(translatableArticle._id), { speakerNumber, timestamp })
    .then((res) => {
        const { translators } = res.body;
        const { translatableArticle, originalTranslatableArticle } = getState()[moduleName]
        translatableArticle.translators = translators
        originalTranslatableArticle.translators = translators;
        const updates = {
            translatableArticle: _.cloneDeep(translatableArticle),
            originalTranslatableArticle,
        }
        dispatch(batchUpdateState(updates));
    })
    .catch((err) => {
        console.log(err);
        NotificationService.responseError(err);
    })
}

export const updateTranslationExportAudioSettings = (translationExportId, changes) => (dispatch, getState) => {
    requestAgent.put(Api.translationExport.updateAudioSettings(translationExportId), changes)
    .then((res) => {
        const { exportHistoryCurrentPageNumber } = getState()[moduleName];
        NotificationService.success('Updated successfully!');
        dispatch(fetchTranslationExports(exportHistoryCurrentPageNumber, true));
    })
    .catch((err) => {
        console.log(err);
        NotificationService.responseError(err);
    })   
}

export const requestExportTranslationReview = (articleId) => (dispatch, getState) => {
    const { translatableArticle } = getState()[moduleName]
    requestAgent
    .post(Api.translationExport.requestExportTranslationReview(), { articleId: translatableArticle._id })
    .then((res) => {
        // NotificationService.success('The video has been queued to be exported. we\'ll notify you once it\'s done :)');
        NotificationService.success('The video has been queued to be exported.');
        dispatch(setActiveTabIndex(1));
    })
    .catch((err) => {
        console.log(err);
        NotificationService.responseError(err);
    })
}

export const updateArticleAudioSpeed = ({articleId, speed, type, slidePosition, subslidePosition }) => (dispatch, getState) => {
    const { translatableArticle, currentSlideIndex, currentSubslideIndex } = getState()[moduleName]
    let slideIndex;
    let subslideIndex;

    if (type !== 'all') {
        slideIndex = translatableArticle.slides.findIndex((s) => s.position === slidePosition);
        subslideIndex = translatableArticle.slides[slideIndex].content.findIndex((s) => s.position === subslidePosition);
        dispatch(addLoadingSlide(slideIndex, subslideIndex));
    } else {
        dispatch(addLoadingSlide(currentSlideIndex, currentSubslideIndex));
    }

    requestAgent
    .post(Api.translate.updateAudioSpeed(articleId), { audioSpeed: speed, type, slidePosition, subslidePosition })
    .then((res) => {
        dispatch(fetchTranslatableArticle({ articleId: translatableArticle._id, loading: false }))
        if (type !== 'all') {
            dispatch(removeLoadingSlide(slideIndex, subslideIndex));
        } else {
            dispatch(removeLoadingSlide(currentSlideIndex, currentSubslideIndex));
        }
    })
    .catch(err => {
        console.log(err);
        NotificationService.responseError(err);
    })
}

export const updateArticleVideoSpeed = ({articleId, speed, type, slidePosition, subslidePosition }) => (dispatch, getState) => {
    requestAgent
    .post(Api.translate.updateVideoSpeed(articleId), { videoSpeed: speed, type, slidePosition, subslidePosition })
    .then((res) => {
        console.log(res.body);
        const { videoSpeedLoading } = res.body;
        if (videoSpeedLoading) {
            const { translatableArticle } = getState()[moduleName];
            translatableArticle.videoSpeedLoading = videoSpeedLoading;
            dispatch(setTranslatableArticle(_.cloneDeep(translatableArticle)));
        }
    })
    .catch(err => {
        console.log(err);
        NotificationService.responseError(err);
    })
}

export const fetchComments = ({ slidePosition, subslidePosition } = {}) => (dispatch, getState) => {
    const { translatableArticle, commentsSlidesIndexes } = getState()[moduleName];
    const subslides = reduceSlidesSubslides(translatableArticle.slides)
    const slidesComments = [];
    if (commentsSlidesIndexes.length === 1 && commentsSlidesIndexes[0] === -1) {
        subslides.forEach((s, i) => {
            slidesComments.push(`${subslides[i].slidePosition}-${subslides[i].subslidePosition}`)
        })
    } else {
        commentsSlidesIndexes.forEach((i) => {
            if (subslides[i]) {
                slidesComments.push(`${subslides[i].slidePosition}-${subslides[i].subslidePosition}`)
            }
        })
    }
    if (slidesComments.length === 0 && commentsSlidesIndexes[0] !== -1) {
        dispatch(setComments([]));
    } else {

        requestAgent
        .get(Api.comments.getCommentsByArticleId(translatableArticle._id, { slidePosition, subslidePosition, slides: slidesComments }))
        .then((res) => {
            // NotificationService.success('The video has been queued to be exported. we\'ll notify you once it\'s done :)');
            const comments = res.body.comments.map(c => {
                return {
                    ...c,
                    index: subslides.findIndex(s => s.slidePosition === c.slidePosition && s.subslidePosition === c.subslidePosition)
                }
            })
            dispatch(setComments(comments))
        })
        .catch((err) => {
            console.log(err);
            NotificationService.responseError(err);
        })
    }
}

export const addComment = (slidePosition, subslidePosition, content) => (dispatch, getState) => {
    const { translatableArticle, listIndex } = getState()[moduleName];
    dispatch(setAddCommentLoading(true))
    requestAgent
    .post(Api.comments.addComment(), { articleId: translatableArticle._id, slidePosition, subslidePosition, content })
    .then((res) => {
        dispatch(setAddCommentLoading(false))
        if (listIndex === -1) {
            dispatch(fetchComments())
        } else {
            dispatch(fetchComments({ slidePosition, subslidePosition }))
        }
    })
    .catch((err) => {
        console.log(err);
        dispatch(setAddCommentLoading(false))
        NotificationService.responseError(err);
    })   
}

/*
    EXPORT HISTORY
*/

export const fetchArticleVideo = (videoId) => (dispatch) => {
    requestAgent
    .get(Api.video.getVideoById(videoId))
    .then((res) => {
        const video = res.body;
        dispatch(setVideo(video));
    })
    .catch(err => {
        console.log(err);
    })
}

const setSignLangArticles = articles => ({
    type: actionTypes.SET_SIGNLANG_ARTICLES,
    payload: articles,
})

export const fetchSignLangArticles = (originalArticleId) => (dispatch) => {
    console.log(originalArticleId)
    requestAgent
    .get(Api.article.getArticles({ originalArticle: originalArticleId, signLang: true }))
    .then((res) => {
        const { articles } = res.body;
        dispatch(setSignLangArticles(articles));
    })
    .catch(err => {
        console.log(err);
    })   
}


export const approveTranslationExport = (translationExportId) => (dispatch, getState) => {
    dispatch(setLaoding(true))
    const { exportHistoryCurrentPageNumber } = getState()[moduleName];
    requestAgent
    .post(Api.translationExport.approveExportTranslation(translationExportId))
    .then((res) => {
        dispatch(fetchTranslationExports(exportHistoryCurrentPageNumber, true))
    })
    .catch((err) => {
        console.log(err);
        NotificationService.responseError(err);
        dispatch(setLaoding(false))
    })
}

export const declineTranslationExport = (translationExportId) => (dispatch, getState) => {
    dispatch(setLaoding(true));
    const { exportHistoryCurrentPageNumber } = getState()[moduleName];
    requestAgent
    .post(Api.translationExport.declineeExportTranslation(translationExportId))
    .then((res) => {
        dispatch(fetchTranslationExports(exportHistoryCurrentPageNumber, true));
    })
    .catch((err) => {
        console.log(err);
        NotificationService.responseError(err);
        dispatch(setLaoding(false))
    })
}

export const fetchTranslationExports = (pageNumber, loading) =>  (dispatch, getState) => {
    const { translatableArticle } = getState()[moduleName];
    if (loading) {
        dispatch(setTranslationExports([]));
        dispatch(setLaoding(true))
    }
    requestAgent
    .get(Api.translationExport.getByArticleId(translatableArticle._id, { page: pageNumber }))
    .then((res) => {
        const { translationExports, pagesCount } = res.body;
        dispatch(bulkActions.startBatchMode());
        dispatch(setExportHistoryTotalPages(pagesCount))
        dispatch(setTranslationExports(translationExports));
        dispatch(setLaoding(false))
        dispatch(bulkActions.flushBatchedActions());
    })
    .catch((err) => {
        console.log(err);
        NotificationService.responseError(err);
        dispatch(setLaoding(false))
    })
}

export const generateTranslationExportAudioArchive = (translationExportId) => (dispatch, getState) => {
    requestAgent
    .post(Api.translationExport.generateAudioArchive(translationExportId))
    .then((res) => {
        const { translationExport } = res.body;
        const { translationExports } = getState()[moduleName];
        console.log('translation exports', translationExports, translationExport)
        const translationExportIndex = translationExports.findIndex((t) => t._id === translationExport._id);
        translationExports[translationExportIndex] = translationExport;
        dispatch(setTranslationExports([...translationExports]));
        
    })
    .catch((err) => {
        console.log(err);
        NotificationService.responseError(err);
        dispatch(setLaoding(false))
    })
}


export const generateTranslationExportSubtitle = (translationExportId) => (dispatch, getState) => {
    requestAgent
    .post(Api.translationExport.generateSubtitles(translationExportId))
    .then((res) => {
        const { translationExport } = res.body;
        const { translationExports } = getState()[moduleName];
        const translationExportIndex = translationExports.findIndex((t) => t._id === translationExport._id);
        translationExports[translationExportIndex] = translationExport;
        dispatch(setTranslationExports([...translationExports]));
        
    })
    .catch((err) => {
        console.log(err);
        NotificationService.responseError(err);
        dispatch(setLaoding(false))
    })
}

export const generateTranslationExportSubtitledSignLanguage = (translationExportId, articleId) => (dispatch, getState) => {
    requestAgent
    .post(Api.translationExport.generateSubtitlesSignLanguage(translationExportId), { articleId })
    .then((res) => {
        const { translationExport } = res.body;
        const { translationExports } = getState()[moduleName];
        const translationExportIndex = translationExports.findIndex((t) => t._id === translationExport._id);
        translationExports[translationExportIndex] = translationExport;
        dispatch(setTranslationExports([...translationExports]));
        
    })
    .catch((err) => {
        console.log(err);
        NotificationService.responseError(err);
        dispatch(setLaoding(false))
    })
}

export const generateTranslationExportSubtitledVideo = (translationExportId) => (dispatch, getState) => {
    requestAgent
    .post(Api.translationExport.generateSubtitledVideo(translationExportId))
    .then((res) => {
        const { translationExport } = res.body;
        const { translationExports } = getState()[moduleName];
        console.log('translation exports', translationExports, translationExport)
        const translationExportIndex = translationExports.findIndex((t) => t._id === translationExport._id);
        translationExports[translationExportIndex] = translationExport;
        dispatch(setTranslationExports([...translationExports]));
        
    })
    .catch((err) => {
        console.log(err);
        NotificationService.responseError(err);
        dispatch(setLaoding(false))
    })
}


// Subtitles
const setSubtitlesLoading = loading => ({
    type: actionTypes.SET_SUBTITLES_LOADING,
    payload: loading,
})
const setSubtitles = subtitles => ({
    type: actionTypes.SET_SUBTITLES,
    payload: subtitles,
})

const setSubtitlesVideo = (video) => ({
    type: actionTypes.SET_SUBTITLES_VIDEO,
    payload: video,
})

const setSubtitlesTranslationExport = translationExport => ({
    type: actionTypes.SET_SUBTITLES_TRANSLATION_EXPORT,
    payload: translationExport,
})

export const resetUndo = () => (dispatch) => {
    dispatch(setSubtitlesUndoStack([]));
    dispatch(setSubtitlesRedoStack([]));
}

export const setSubtitlesUndoStack = (stack) => ({
    type: actionTypes.SET_SUBTITLES_UNDO_STACK,
    payload: stack,
})

export const setSubtitlesRedoStack = (stack) => ({
    type: actionTypes.SET_SUBTITLES_REDO_STACK,
    payload: stack,
})

export const setSelectedSubtitle = subtitle => ({
    type: actionTypes.SET_SELECTED_SUBTITLE,
    payload: subtitle,
})

export const setSelectedSubtitleIndex = index => ({
    type: actionTypes.SET_SELECTED_SUBTITLE_INDEX,
    payload: index,
})

function formatSubtitle(s) {
    return { ...s, index: s.position, startTime: s.startTime * 1000, endTime: s.endTime * 1000, color: 'white', backgroundColor: s.speakerProfile && s.speakerProfile.speakerNumber === -1 ? 'white' : 'blue' };
}

function unformatSubtitle(s) {
    return { ...s, startTime: s.startTime / 1000, endTime: s.endTime / 1000 };
}

function formatSubtitles(subtitles) {
    let speakersIndexesMap = {};
    subtitles.map(s => s.speakerProfile).filter(s => s).forEach((s) => {
        speakersIndexesMap[s.speakerNumber] = 0;
    })

    return subtitles.slice().map((s) => 
        ({ ...s, index: s.speakerProfile && typeof s.speakerProfile.speakerNumber === 'number' ? speakersIndexesMap[s.speakerProfile.speakerNumber] : null }))
        .map(formatSubtitle);
}

const addUndoAction = action => (dispatch, getState) => {
    const { subtitlesUndoStack } = getState()[moduleName];
    subtitlesUndoStack.push(action)
    dispatch(setSubtitlesUndoStack(subtitlesUndoStack.slice()));
    dispatch(setSubtitlesRedoStack([]));
}

export const undoAction = () => (dispatch, getState) => {
    const { subtitlesUndoStack, subtitlesRedoStack } = getState()[moduleName];
    const lastAction = subtitlesUndoStack.pop();
    dispatch(setSubtitlesUndoStack(subtitlesUndoStack.slice()));
    lastAction.undo(dispatch);
    subtitlesRedoStack.push(lastAction);
    dispatch(setSubtitlesRedoStack(subtitlesRedoStack.slice()));
}


export const redoAction = () => (dispatch, getState) => {
    const { subtitlesUndoStack, subtitlesRedoStack } = getState()[moduleName];
    const lastAction = subtitlesRedoStack.pop();
    dispatch(setSubtitlesRedoStack(subtitlesRedoStack.slice()));
    lastAction.redo(dispatch);
    subtitlesUndoStack.push(lastAction);
    dispatch(setSubtitlesUndoStack(subtitlesUndoStack.slice()));
}


export const fetchUsers = (organizationId) => dispatch => {
    requestAgent.get(Api.organization.getUsers({ organization: organizationId }))
        .then(({ body }) => {
            dispatch(setOrganizationUsers(body));
        })
        .catch(err => {
            console.log(err);
        })
}

export const fetchSubtitles = (articleId) => (dispatch, getState) => {
    dispatch(setSubtitlesLoading(true));
    requestAgent
    .get(Api.subtitles.getByArticleId(articleId))
    .then((res) => {
        const { subtitles, translationExport, locked } = res.body;
        if (subtitles) {
            dispatch(setSubtitlesTranslationExport(translationExport));
            dispatch(setSubtitles({ ...subtitles, subtitles: formatSubtitles(subtitles.subtitles)}));
            dispatch(setSubtitlesVideo(subtitles.video));
        } else {
            dispatch(setSubtitles(null));
            dispatch(setSubtitlesVideo(null));
            dispatch(setSubtitlesTranslationExport(null));
        }
        dispatch(setSubtitlesLoading(false));
    })
    .catch(err => {
        console.log(err);
        dispatch(setSubtitlesLoading(false));
        NotificationService.responseError(err);
    })
}


export const addSubtitle = (subtitleId, subtitle, {undoable = true } = {}) => (dispatch, getState) => {
    requestAgent
    .post(Api.subtitles.addSubtitle(subtitleId), subtitle)
    .then((res) => {
        const { subtitles } = res.body;
        const formattedSubtitles = formatSubtitles(subtitles.subtitles);
        dispatch(setSubtitles({ ...subtitles, subtitles: formattedSubtitles}));
        dispatch(setSelectedSubtitle(null));
        const addedSubtitle = subtitles.subtitles.find(s => s.startTime === subtitle.startTime && s.endTime === subtitle.endTime);
        if (undoable && addedSubtitle) {
            const undoAction = {
                type: 'add_subtitle',
                undo: (dispatch) => {
                    dispatch(deleteSubtitle(subtitleId, addedSubtitle.position, { undoable: false }))
                },
                redo: (dispatch) => {
                    dispatch(addSubtitle(subtitleId, subtitle, { undoable: false }))
                }
            }
            dispatch(addUndoAction(undoAction));
        }
    })
    .catch(err => {
        console.log(err);
        NotificationService.responseError(err);
    })
}

export const deleteSubtitle = (subtitleId, subtitlePosition, {undoable = true } = {}) => (dispatch, getState) => {
    const { subtitles } = getState()[moduleName];
    const deletedSubtitle = unformatSubtitle(subtitles.subtitles.find(s => s.position === subtitlePosition));
    console.log('deleted subtitle', deletedSubtitle)
    requestAgent
    .delete(Api.subtitles.deleteSubtitle(subtitleId, subtitlePosition))
    .then((res) => {
        const { subtitles } = res.body;
        dispatch(setSubtitles({ ...subtitles, subtitles: formatSubtitles(subtitles.subtitles)}));
        dispatch(setSelectedSubtitle(null));
        if (undoable && deletedSubtitle) {
            const undoAction = {
                type: 'delete_subtitle',
                undo: (dispatch) => {
                    dispatch(addSubtitle(subtitleId, deletedSubtitle, { undoable: false }))
                },
                redo: (dispatch) => {
                    dispatch(deleteSubtitle(subtitleId, subtitlePosition, { undoable: false }));
                }
            }
            dispatch(addUndoAction(undoAction));
        }
    })
    .catch(err => {
        console.log(err);
        NotificationService.responseError(err);
    })
}


export const updateSubtitle = (subtitleId, subtitlePosition, changes, { undoable = true } = {}) => (dispatch, getState) => {
    const { subtitles, selectedSubtitleIndex, selectedSubtitle } = getState()[moduleName];
    const subtitleIndex = subtitles.subtitles.findIndex(s => s.position === subtitlePosition);
    const oldChangedValues = {};
    console.log('changes', changes, subtitles.subtitles[subtitleIndex])
    requestAgent
    .patch(Api.subtitles.updateSubtitle(subtitleId, subtitlePosition), changes)
    .then((res) => {
        const { position, ...changes } = res.body;
        Object.keys(changes).forEach((key) => {
            let change;
            if (key === 'startTime' || key === 'endTime') {
                oldChangedValues[key] = subtitles.subtitles[subtitleIndex][key] / 1000;
                change = changes[key] * 1000;
            } else {
                oldChangedValues[key] = subtitles.subtitles[subtitleIndex][key];
                change = changes[key];
            }

            subtitles.subtitles[subtitleIndex][key] = change;
            if (selectedSubtitleIndex === subtitleIndex && selectedSubtitle) {
                selectedSubtitle[key] = change;
            }
        });

        subtitles.subtitles[subtitleIndex] = { ...subtitles.subtitles[subtitleIndex] };

        dispatch(setSubtitles({...subtitles, subtitles: subtitles.subtitles.map(s => ({...s})), updated_at: Date.now() }));
        if (selectedSubtitleIndex === subtitleIndex && selectedSubtitle) {
            dispatch(setSelectedSubtitle({ ...selectedSubtitle }))
        } else {
            dispatch(setSelectedSubtitle(null));
        }

        if (undoable) {
            const undoAction = {
                type: 'update_subtitle',
                undo: (dispatch) => {
                    dispatch(updateSubtitle(subtitleId, subtitlePosition, oldChangedValues, { undoable: false }))
                },
                redo: (dispatch) => {
                    dispatch(updateSubtitle(subtitleId, subtitlePosition, changes, { undoable: false }));
                }
            }
            dispatch(addUndoAction(undoAction));
        }
    })
    .catch(err => {
        console.log(err);
        if (selectedSubtitleIndex === subtitleIndex) {
            dispatch(setSelectedSubtitle({ ...selectedSubtitle }))
        }
        NotificationService.responseError(err);
    })
}



export const splitSubtitle = (subtitleId, subtitlePosition, wordIndex, time, { undoable = true } = {}) => (dispatch, getState) => {

    requestAgent
    .post(Api.subtitles.splitSubtitle(subtitleId, subtitlePosition), { wordIndex, time })
    .then((res) => {
        const { subtitles } = res.body;
        dispatch(setSubtitles({ ...subtitles, subtitles: formatSubtitles(subtitles.subtitles)}));
        dispatch(setSelectedSubtitle(null));
        if (undoable) {
            const firstpartSplittedSubtitle = subtitles.subtitles.find(s => s.position === subtitlePosition);
            const secondPartSplittedSubtitle = subtitles.subtitles.find(s => s.position === (subtitlePosition +1));
            const positions = [firstpartSplittedSubtitle.position, secondPartSplittedSubtitle.position];
            const undoAction = {
                type: 'split_subtitle',
                undo: (dispatch) => {
                    dispatch(combineSubtitle(subtitleId, positions, { undoable: false }))
                },
                redo: (dispatch) => {
                    dispatch(splitSubtitle(subtitleId, subtitlePosition, wordIndex, time, { undoable: false }));
                }
            }
            dispatch(addUndoAction(undoAction));
        }
    })
    .catch(err => {
        console.log(err);
        NotificationService.responseError(err);
    })
}

export const combineSubtitle = (subtitleId, positions, { undoable = true } = {}) => (dispatch, getState) => {
    positions = positions.map(s => parseInt(s)).sort((a, b) => a - b);

    const { subtitles } = getState()[moduleName];
    const firstCombined = unformatSubtitle(subtitles.subtitles.find(s => s.position === positions[0]));

    requestAgent
    .post(Api.subtitles.combineSubtitles(subtitleId), { positions })
    .then((res) => {
        const { subtitles } = res.body;
        dispatch(setSubtitles({ ...subtitles, subtitles: formatSubtitles(subtitles.subtitles)}));
        dispatch(setSelectedSubtitle(null));
        if (undoable) {
            const undoAction = {
                type: 'combine_subtitles',
                undo: (dispatch) => {
                    dispatch(splitSubtitle(subtitleId, firstCombined.position, firstCombined.text.split(' ').length - 1, firstCombined.endTime, { undoable: false }));
                },
                redo: (dispatch) => {
                    dispatch(combineSubtitle(subtitleId, positions, { undoable: false }));   
                }
            }
            dispatch(addUndoAction(undoAction));
        }
    })
    .catch(err => {
        console.log(err);
        NotificationService.responseError(err);
    })
}

export const resetSubtitles = (subtitleId) => (dispatch) => {
    requestAgent
    .post(Api.subtitles.resetSubtitles(subtitleId))
    .then((res) => {
        const { subtitles } = res.body;
        dispatch(setSubtitles({ ...subtitles, subtitles: formatSubtitles(subtitles.subtitles)}));
        dispatch(setSelectedSubtitle(null));
        dispatch(setSubtitlesRedoStack([]));
        dispatch(setSubtitlesUndoStack([]));
    })
    .catch(err => {
        console.log(err);
        NotificationService.responseError(err);
    })
}

export const activateSubtitles = (subtitleId) => (dispatch, getState) => {
    const { subtitlesVideo } = getState()[moduleName];

    requestAgent
    .post(Api.subtitles.activateSubtitle(subtitleId), { activated: true })
    .then((res) => {
        dispatch(setActiveTabIndex(1));
        NotificationService.success(`Subtitles have been updated`)
    })
    .catch(err => {
        console.log(err);
        NotificationService.responseError(err);
    })
}
