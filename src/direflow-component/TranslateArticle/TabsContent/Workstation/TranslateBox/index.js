import React from 'react';
import { TextArea, Button, Popup, Card, Label, Icon } from 'semantic-ui-react';
import { debounce } from '../../../utils/helpers';
import FindAndReplaceModal from '../../../components/FindAndReplaceModal';
import { Styled } from 'direflow-component';
import { CircularProgressBar, buildStyles } from '../../../components/CircularProgressBar';
import ContentEditable from "react-contenteditable";
import stripHtml from "string-strip-html";
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
            value: '',
            wordLimit: 0
        }
        this.saveValue = debounce((value, currentSlideIndex, currentSubslideIndex) => {
            this.props.onSave(value, currentSlideIndex, currentSubslideIndex)
        }, 2000)
    }

    componentDidMount() {
        const langWordsPerMinute = langsWordsPerMinute.find((l) => l.code === this.props.langCode);
        const wordsPerMinute = langWordsPerMinute ? langWordsPerMinute.limit : defaultWordsPerMinute;
        const wordLimit = Math.round(wordsPerMinute / 60 * this.props.duration);
        this.setState({ wordLimit });

        if (this.state.value !== this.props.value) {
            const valueArray= stripHtml(this.props.value.trim()).split(' ').filter(v => v);
            if (valueArray.length > wordLimit) {
                let removedItems = `<mark>${valueArray.splice(valueArray.length - (valueArray.length - wordLimit)).join(' ')}</mark>`;
                let newValue = `${valueArray.join(' ')} ${removedItems} `;
                this.setState({ value: newValue });
            } else {
                this.setState({ value: this.props.value });
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        const langWordsPerMinute = langsWordsPerMinute.find((l) => l.code === nextProps.langCode);
        const wordsPerMinute = langWordsPerMinute ? langWordsPerMinute.limit : defaultWordsPerMinute;
        const wordLimit = Math.round(wordsPerMinute / 60 * nextProps.duration);
        this.setState({ wordLimit });

        if (this.props.value !== nextProps.value) {
            if ((this.props.currentSlideIndex !== nextProps.currentSlideIndex || this.props.currentSubslideIndex !== nextProps.currentSubslideIndex) && this.props.value !== this.state.value) {
                this.props.onSave(stripHtml(this.state.value), this.props.currentSlideIndex, this.props.currentSubslideIndex);
            }
            const valueArray= stripHtml(nextProps.value.trim()).split(' ').filter(v => v);
            if (valueArray.length > wordLimit) {
                let removedItems = `<mark>${valueArray.splice(valueArray.length - (valueArray.length - wordLimit)).join(' ')}</mark>`;
                let newValue = `${valueArray.join(' ')} ${removedItems} `;
                this.setState({ value: newValue });
            } else {
                this.setState({ value: nextProps.value });
            }
        }
    }

    onValueChange = (value, currentSlideIndex, currentSubslideIndex) => {
        if (stripHtml(this.state.value) === stripHtml(value.trim())) {
            this.setState({ value });
        } else {
            const valueArray= stripHtml(value.trim()).split(' ').filter(v => v);
            if (valueArray.length > this.state.wordLimit) {
                let removedItems = `<mark>${valueArray.splice(valueArray.length - (valueArray.length - this.state.wordLimit)).join(' ')}</mark>`;
                let newValue = `${valueArray.join(' ')} ${removedItems} `;
                this.setState({ value: newValue });
            } else {
                this.setState({ value });
            }
        }

        // this.saveValue(value, currentSlideIndex, currentSubslideIndex);
    }

    getWordCount = () => {
        return this.state.value.trim().split(' ').filter(v => v).length;
    }

    render() {
        const { loading, title } = this.props;
        const { value } = this.state;
        console.log(value);
        
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
                                    disabled={loading || stripHtml(value.trim()) === stripHtml(this.props.value.trim()) || !value.trim()}
                                    style={{ backgroundColor: 'transparent', boxShadow: 'none !important', margin: 0, padding: '1rem' }}
                                    onClick={() => this.props.onSave(stripHtml(value), this.props.currentSlideIndex, this.props.currentSubslideIndex)}
                                >
                                    Update
                                </Button>
                            )}
                        </div>
                    </Card.Header>
                    <div
                        style={{ margin: 0, padding: 0, position: 'relative' }}
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
                                            <div style={{ width: '40px', height: '100%', borderRadius: '10px', display: 'flex', alignItems: 'center', background: 'rgb(249, 157, 37, 0.2)' }}>
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
                                                
                                                <div style={{ fontSize: '12px', color: '#f99d25', marginLeft: '3px' }}>{this.state.wordLimit - this.state.value.trim().split(' ').length}</div>
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

                        <ContentEditable
                            style={{ padding: '20px 40px 50px 20px', height: 'auto', width: '100%', border: 'none', cursor: this.props.disabled ? 'not-allowed' : 'text' }}
                            className="editable"
                            tagName="div"
                            html={value}
                            disabled={this.props.disabled}
                            onChange={(e) => { this.onValueChange(e.target.value, this.props.currentSlideIndex, this.props.currentSubslideIndex) }}
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
