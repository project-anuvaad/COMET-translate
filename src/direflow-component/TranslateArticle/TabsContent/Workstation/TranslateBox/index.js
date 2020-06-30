import React from 'react';
import { Button, Popup, Card, Label, Icon } from 'semantic-ui-react';
import { debounce } from '../../../utils/helpers';
import FindAndReplaceModal from '../../../components/FindAndReplaceModal';
import { Styled } from 'direflow-component';
import { CircularProgressBar, buildStyles } from '../../../components/CircularProgressBar';
import stripHtml from "string-strip-html";
import { TextEditor } from '../../../components/ReactQuillEditor';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import styles from './style.scss';

const defaultWordsPerMinute = 120;
const langsWordsPerMinute = [
    { code: 'hi', limit: 110 },
    { code: 'en', limit: 140 },
    { code: 'ur', limit: 120 },
    { code: 'mr', limit: 110 },
    { code: 'pa', limit: 150 },
    { code: 'gu', limit: 100 },
    { code: 'bn', limit: 150 },
    { code: 'or', limit: 120 },
    { code: 'as', limit: 130 },
    { code: 'te', limit: 110 },
    { code: 'kn', limit: 105 },
    { code: 'ta', limit: 80 },
    { code: 'ml', limit: 120 },
];

class TranslateBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            markup: '',
            value: '',
            editorState: EditorState.createEmpty(),
            wordLimit: 0
        }
        this.saveValue = debounce((value, currentSlideIndex, currentSubslideIndex) => {
            this.props.onSave(value, currentSlideIndex, currentSubslideIndex)
        }, 2000)
    }

    componentDidMount() {
        const contentBlock = htmlToDraft(this.props.value);
        console.log('contentBlock', contentBlock);
        
        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            this.setState({ editorState, markup: this.props.value });
        }

        // this.setState({ value: this.props.value });
        // if (this.state.value !== this.props.value) {
        //     this.setState({ value: this.props.value });
        // }

        const langWordsPerMinute = langsWordsPerMinute.find((l) => l.code === this.props.langCode);
        const wordsPerMinute = langWordsPerMinute ? langWordsPerMinute.limit : defaultWordsPerMinute;
        const wordLimit = Math.round(wordsPerMinute / 60 * this.props.duration);
        this.setState({ wordLimit });
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.value !== nextProps.value) {
            if ((this.props.currentSlideIndex !== nextProps.currentSlideIndex || this.props.currentSubslideIndex !== nextProps.currentSubslideIndex) && this.props.value !== this.state.value) {
                this.props.onSave(stripHtml(this.state.value), this.props.currentSlideIndex, this.props.currentSubslideIndex);
            }
            this.setState({ value: nextProps.value });
        }

        const langWordsPerMinute = langsWordsPerMinute.find((l) => l.code === nextProps.langCode);
        const wordsPerMinute = langWordsPerMinute ? langWordsPerMinute.limit : defaultWordsPerMinute;
        const wordLimit = Math.round(wordsPerMinute / 60 * nextProps.duration);
        this.setState({ wordLimit });
    }

    onValueChange = (value, currentSlideIndex, currentSubslideIndex) => {
        if (stripHtml(value) !== stripHtml(this.state.value)) {
            console.log('========================called=======================');
            this.setState({ value: `<p>some text</p>` });
            // this.setState({ value: `<p><span style="background-color: rgb(255, 255, 0);">${value}</span></p>` });
        }
    }

    getWordCount = () => {
        return 5;
        const count = stripHtml(this.state.value).split(' ').filter(v => v).length;
        return count;
    }

    render() {
        const { loading, title } = this.props;
        const { value } = this.state;
        
        return (
            <Styled styles={styles}>

                <Card style={{ margin: 0, width: '100%', marginTop: '2.7rem', borderRadius: 0 }} className="translate-box">
                    <Card.Header style={{ backgroundColor: '#d4e0ed', color: '', borderRadius: 0 }}>
                        <div
                            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                        >
                            <h4 style={{ color: '#333333', margin: 0, padding: '1rem' }}>
                                {title}
                            </h4>
                            {!this.props.disabled && (
                                <Button
                                    basic
                                    className="translate-box__update-button"
                                    loading={loading}
                                    // disabled={loading || value.trim() === this.props.value.trim() || !value.trim()}
                                    style={{ backgroundColor: 'transparent', boxShadow: 'none !important', margin: 0, padding: '1rem' }}
                                    onClick={() => this.props.onSave(value, this.props.currentSlideIndex, this.props.currentSubslideIndex)}
                                >
                                    Update
                                </Button>
                            )}
                        </div>
                    </Card.Header>
                    <div
                        style={{ margin: 0, padding: 0, position: 'relative', display: 'flex', flexDirection: 'column' }}
                    >
                        {!this.props.disabled && (
                            <React.Fragment>
                                <Popup
                                    trigger={
                                        <Button
                                            icon="edit"
                                            basic
                                            onClick={this.props.onFindAndReplaceOpen}
                                            style={{ position: 'absolute', right: -3, top: 1 }}
                                        />
                                    }
                                    content="Find and replace text"
                                />
                                <Label onClick={this.props.onOpenTranslationVersions} className="translate-box__versions-available">{this.props.translationVersionsCount} versions available <Icon name="chevron down" /></Label>
                                
                                {
                                    (this.state.wordLimit < this.getWordCount()) ?
                                        <div className="translate-box__word-limit" style={{ display: 'flex', alignItems: 'center' }}>
                                            <div style={{ width: `${(this.state.wordLimit - this.state.value.split(' ').filter(v => v).length).toString().length === 2 ? '40px' : '50px'}`, height: '100%', borderRadius: '10px', display: 'flex', alignItems: 'center', background: 'rgb(249, 157, 37, 0.2)' }}>
                                                <Popup 
                                                    trigger={
                                                        <div style={{ width: '20px', borderRadius: '10px', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', cursor: 'default' }}>
                                                            <CircularProgressBar
                                                                value={this.getWordCount() / this.state.wordLimit * 100}
                                                                text={'!'}
                                                                strokeWidth={6}
                                                                pathColor={'#f99d25'}
                                                                styles={buildStyles({
                                                                    textSize: "50px",
                                                                    textColor: "#f99d25",
                                                                    pathColor: "#f99d25"
                                                                })}
                                                            />
                                                        </div>
                                                    }
                                                    content={`The ideal word limit for this slide should be ${this.state.wordLimit}`}
                                                    position="bottom center"
                                                    style={{ fontSize: '10px', color: '#666666' }}
                                                />
                                                
                                                <div style={{ fontSize: '12px', color: '#f99d25', marginLeft: '3px' }}>{this.state.wordLimit - this.state.value.split(' ').filter(v => v).length}</div>
                                            </div>
                                            <div style={{ fontSize: '12px', color: '#999999', marginLeft: '8px' }}>
                                                <span style={{ marginRight: '8px' }}>|</span>
                                                Word limit: {this.state.wordLimit}
                                            </div>
                                        </div> :
                                        <div className="translate-box__word-limit" style={{ display: 'flex', alignItems: 'center' }}>
                                            <div style={{ width: '20px', borderRadius: '10px', backgroundColor: '#ffffff' }}>
                                                <CircularProgressBar 
                                                    value={this.getWordCount() / this.state.wordLimit * 100}
                                                    text={(this.state.wordLimit - this.getWordCount()).toString()}
                                                    strokeWidth={6}
                                                    pathColor={'#f99d25'}
                                                    styles={buildStyles({
                                                        textSize: "50px",
                                                        textColor: "#f99d25",
                                                        pathColor: "#f99d25"
                                                    })}
                                                />
                                            </div>
                                            <div style={{ fontSize: '12px', color: '#999999', marginLeft: '8px' }}>
                                                <span style={{ marginRight: '8px' }}>|</span>
                                                Word limit: {this.state.wordLimit}
                                            </div>
                                        </div>
                                }

                                


                            </React.Fragment>
                        )}

                        {/* <TextArea
                            style={{ padding: 20, paddingRight: 40, width: '100%', border: 'none', cursor: this.props.disabled ? 'not-allowed' : 'text' }}
                            disabled={this.props.disabled}
                            rows={6}
                            placeholder="Translate slide text"
                            value={value}
                            onChange={(e, { value }) => { this.onValueChange(value, this.props.currentSlideIndex, this.props.currentSubslideIndex) }}
                        /> */}

                        {/* <ContentEditable
                            style={{ padding: '20px 40px 50px 20px', height: 'auto', width: '100%', border: 'none', cursor: this.props.disabled ? 'not-allowed' : 'text' }}
                            className="editable"
                            tagName="div"
                            html={value}
                            disabled={this.props.disabled}
                            onChange={(e) => { this.onValueChange(e.target.value, this.props.currentSlideIndex, this.props.currentSubslideIndex) }}
                        /> */}

                        {/* <Editor 
                            theme={false}
                            value={value}
                            placeholder="Translate slide text"
                            onChange={(html) => { 
                                console.log('html', html);
                                console.log('strip', `"${stripHtml(html)}"`);
                                
                                
                                this.onValueChange(html, this.props.currentSlideIndex, this.props.currentSubslideIndex) 
                            }}
                        /> */}

                        <TextEditor
                            toolbarHidden={true}
                            editorState={this.state.editorState}
                            onEditorStateChange={(editorState) => {
                                // const rawContentState = convertToRaw(editorState.getCurrentContent());
                                // const markup = draftToHtml(rawContentState);
                                // if (stripHtml(markup) === this.state.markup) {
                                //     return;
                                // }

                                this.setState({
                                    editorState
                                  }, () => {
                                    console.log('editorState');
                                    const rawContentState = convertToRaw(this.state.editorState.getCurrentContent());
                                    const markup = draftToHtml(rawContentState);
                                    // console.log(stripHtml(markup), this.state.markup);
                                    // console.log(stripHtml(markup) === this.state.markup);
                                    console.log(this.state.markup);
                                    console.log(markup)
                                    console.log(stripHtml(markup));
                                    
                                    const markupArray = stripHtml(markup).split(' ');
                                    const colored = markupArray.splice(markupArray.length - 2);
                                    
                                    const contentBlock = htmlToDraft(`${markupArray.join(' ')} <span style="color: red">${colored}</span>`);
                                    if (contentBlock) {
                                        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                                        const editorState = EditorState.createWithContent(contentState);
                                        this.setState({ editorState, markup: stripHtml(markup) });
                                    }

                                  });
                                
                                // const markupArray = stripHtml(markup).split(' ').filter(v => v);
                                // const colored = markupArray.splice(markupArray.length - 2);
                                
                                // const contentBlock = htmlToDraft(`${markupArray.join(' ')} <span style="color: red">${colored}</span>`);
                                // if (contentBlock) {
                                //     const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                                //     const editorState = EditorState.createWithContent(contentState);
                                //     this.setState({ editorState, markup: stripHtml(markup) });
                                // }
                            }}
                        />


                        {/* {this._renderSlideTranslateBox()} */}
                    </div>

                    <FindAndReplaceModal
                        open={this.props.findAndReplaceModalVisible}
                        onSubmit={this.props.onFindAndReplaceSubmit}
                        onClose={this.props.onFindAndReplaceClose}
                    />
                </Card>
            </Styled>
        )
    }
}


export default TranslateBox;
