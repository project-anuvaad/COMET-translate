import * as actionTypes from './types';

const INITIAL_STATE = {
    jobs: {},
    users: {},
    user: null,
    organization: null,
    organizationUsers: [],

    stageLoading: false,
    translatableArticle: null,
    originalTranslatableArticle: null,

    originalArticle: null,
    originalViewedArticle: null,

    tmpViewedArticle: null,

    currentSlideIndex: 0,
    currentSubslideIndex: 0,
    
    currentSlide: null,
    currentSubslide: null,

    translationVersions: [],
    translationVersionsCount: 1,

    loadingSlides: [],
    subslides: [],
    commentsSlidesIndexes: [],
    addCommentSlideIndex: 0,
    recording: false,
    recordUploadLoading: false,

    editorPlaying: false,
    editorMuted: false,

    preview: false,

    selectedSpeakerNumber: null,
    translationSpeakerEndtimeModalVisible: false,
    ccVisible: true,

    translationExports: [],
    loading: false,
    activeTabIndex: 0,

    exportHistoryCurrentPageNumber: 1,
    exportHistoryTotalPages: 1,

    selectedBaseLanguage: {
        langCode: '',
        langName: '',
        tts: false,
    },
    baseLanguages: {
        originalLanguage: '',
        languages: [],
    },

    comments: [],
    addCommentLoading: false,
    commentsVisible: false,
    listIndex: 0,
    maxListIndex: 0,
    findAndReplaceModalVisible: false,
    video: null,
    syncAllLoading: false,
    uploadPictureInPictureLoading: false,
    signLanguageArticles: [],
    // Subtitles tab
    subtitles: null,
    subtitlesLoading: false,
    subtitlesVideo: null,
    subtitlesUndoStack: [],
    subtitlesRedoStack: [],
    subtitlesTranslationExport: null,
    selectedSubtitle: null,
    selectedSubtitleIndex: 0,
}

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case actionTypes.START_JOB:
            return { ...state, jobs: { ...state.jobs, [action.payload.jobName]: { id: action.payload.id } } };
        case actionTypes.STOP_JOB:
            const jobs = { ...state.jobs };
            delete jobs[action.payload.jobName];
            return { ...state, jobs };
        case actionTypes.SET_USER:
            return { ...state, user: action.payload };
        case actionTypes.SET_ORGANIZATION:
            return { ...state, organization: action.payload };
        case actionTypes.ADD_USER:
                const users = {...state.users};
                users[action.payload._id] = action.payload;
                return { ...state, users}
        case actionTypes.SET_STAGE_LOADING:
            return { ...state, stageLoading: action.payload };
        case actionTypes.SET_ORGANIZATION_USERS:
            return { ...state, organizationUsers: action.payload };
        case actionTypes.SET_CURRENT_SLIDE:
            return { ...state, currentSlide: action.payload };
        case actionTypes.SET_CURRENT_SUBSLIDE:
            return { ...state, currentSubslide: action.payload };
        case actionTypes.SET_ORIGINAL_ARTICLE:
            return { ...state, originalArticle: action.payload };
        case actionTypes.SET_ORIGINAL_VIEWED_ARTICLE:
            return { ...state, originalViewedArticle: action.payload };
        case actionTypes.SET_ORIGINAL_TRANSLATABLE_ARTICLE:
            return { ...state, originalTranslatableArticle: action.payload };
        case actionTypes.SET_TRANSLATION_VERSIONS:
            return { ...state, translationVersions: action.payload };
        case actionTypes.SET_TRANSLATION_VERSIONS_COUNT:
            return { ...state, translationVersionsCount: action.payload };
        case actionTypes.SET_TRANSLATABLE_ARTICLE:
            return { ...state, translatableArticle: action.payload };
        case actionTypes.SET_TEMP_VIEWED_ARTICLE:
            return { ...state, tmpViewedArticle: action.payload };
        case actionTypes.SET_CURRENT_SLIDE_INDEX:
            return { ...state, currentSlideIndex: action.payload };
        case actionTypes.SET_CURRENT_SUBSLIDE_INDEX:
            return { ...state, currentSubslideIndex: action.payload };
        case actionTypes.SET_CURRENT_EDITOR_INDEXES:
            return { ...state, currentSlideIndex: action.payload.currentSlideIndex, currentSubslideIndex: action.payload.currentSubslideIndex }
        case actionTypes.SET_TRANSLATION_RECORDING:
            return { ...state, recording: action.payload };
        case actionTypes.SET_RECORD_UPLOAD_LOADING:
            return { ...state, recordUploadLoading: action.payload };
        case actionTypes.SET_EDITOR_MUTED:
            return { ...state, editorMuted: action.payload };
        case actionTypes.SET_EDITOR_PLAYING:
            return { ...state, editorPlaying: action.payload };
        case actionTypes.SET_PREVIEW:
            return { ...state, preview: action.payload };
        case actionTypes.SET_SELECTED_SPEAKER_NUMBER:
            return { ...state, selectedSpeakerNumber: action.payload };
        case actionTypes.SET_TRANSLATION_EXPORTS:
            return { ...state, translationExports: action.payload };
        case actionTypes.SET_LOADING:
            return { ...state, loading: action.payload };
        case actionTypes.SET_ACTIVE_TAB_INDEX:
            return { ...state, activeTabIndex: action.payload };
        case actionTypes.SET_EXPORT_HISTORY_TOTAL_PAGES:
            return { ...state, exportHistoryTotalPages: action.payload };
        case actionTypes.SET_EXPORT_HISTORY_CURRENT_PAGE_NUMBER:
            return { ...state, exportHistoryCurrentPageNumber: action.payload };
        case actionTypes.ADD_LOADING_SLIDE:
            return { ...state, loadingSlides: state.loadingSlides.concat(action.payload) };
        case actionTypes.REMOVE_LOADING_SLIDe:
            const loadingSlides = state.loadingSlides.filter((slide) => slide.slideIndex !== action.payload.slideIndex && slide.subslideIndex !== action.payload.subslideIndex);
            return { ...state, loadingSlides };
        case actionTypes.BATCH_UPDATE_STATE:
            return { ...state, ...action.payload };
        case actionTypes.SET_SPEKAKER_TRANSLATION_ENDTIME_MODAL_VISIBLE:
            return { ...state, translationSpeakerEndtimeModalVisible: action.payload };
        case actionTypes.SET_ARTICLE_BASE_LANGUAGES:
            return { ...state, baseLanguages: action.payload };
        case actionTypes.SET_SELECTED_BASE_LANGUAGE:
            return { ...state, selectedBaseLanguage: action.payload };
        case actionTypes.SET_COMMENTS_VISIBLE:
            return { ...state, commentsVisible: action.payload };
        case actionTypes.SET_LIST_INDEX:
            return { ...state, listIndex: action.payload };
        case actionTypes.SET_MAX_LIST_INDEX:
            return { ...state, maxListIndex: action.payload };
        case actionTypes.SET_COMMENTS:
            return { ...state, comments: action.payload };
        case actionTypes.SET_ADD_COMMENT_LOADING:
            return { ...state, addCommentLoading: action.payload };
        case actionTypes.SET_FIND_AND_REPLACE_MODAL_VISIBLE:
            return { ...state, findAndReplaceModalVisible: action.payload };
        case actionTypes.SET_ARTICLE_VIDEO:
            return { ...state, video: action.payload };
        case actionTypes.SET_SYNC_ALL_LOADING:
            return { ...state, syncAllLoading: action.payload };
        case actionTypes.SET_UPLOAD_PICTURE_IN_PICTURE_LOADING:
            return { ...state, uploadPictureInPictureLoading: action.payload };
        case actionTypes.SET_SIGNLANG_ARTICLES:
            return { ...state, signLanguageArticles: action.payload };

        case actionTypes.SET_SUBTITLES:
            return { ...state, subtitles: action.payload };
        case actionTypes.SET_SUBTITLES_LOADING:
            return { ...state, subtitlesLoading: action.payload };
        case actionTypes.SET_SUBTITLES_VIDEO:
            return { ...state, subtitlesVideo: action.payload };
        case actionTypes.SET_SUBTITLES_TRANSLATION_EXPORT:
            return { ...state, subtitlesTranslationExport: action.payload };
        case actionTypes.SET_SELECTED_SUBTITLE:
            return { ...state, selectedSubtitle: action.payload };
        case actionTypes.SET_SELECTED_SUBTITLE_INDEX:
            return { ...state, selectedSubtitleIndex: action.payload };
        case actionTypes.SET_SUBTITLES_UNDO_STACK:
            return { ...state, subtitlesUndoStack: action.payload };
        case actionTypes.SET_SUBTITLES_REDO_STACK:
            return { ...state, subtitlesRedoStack: action.payload };
        case actionTypes.SET_SUBSLIDES:
            return { ...state, subslides: action.payload };
        case actionTypes.SET_COMMENTS_SLIDES_INDEXES:
            return { ...state, commentsSlidesIndexes: action.payload };
        case actionTypes.SET_ADD_COMMENT_SLIDE_INDEX:
            return { ...state, addCommentSlideIndex: action.payload };
        case actionTypes.SET_CC_VISIBLE:
            return { ...state, ccVisible: action.payload };
        default:
            return state;
    }
}