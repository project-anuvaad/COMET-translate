import React from 'react';
import { Button, Popup, Card, Label, Icon, TextArea } from 'semantic-ui-react';
import { debounce } from '../../../utils/helpers';
import FindAndReplaceModal from '../../../components/FindAndReplaceModal';
import { Styled } from 'direflow-component';
import { CircularProgressBar, buildStyles } from '../../../components/CircularProgressBar';
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
        this.setState({ wordLimit: this.getWordLimit(this.props.langCode, this.props.duration) });

        if (this.state.value !== this.props.value) {
            this.setState({ value: this.props.value });
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ wordLimit: this.getWordLimit(nextProps.langCode, nextProps.duration) });

        if (this.props.value !== nextProps.value) {
            if ((this.props.currentSlideIndex !== nextProps.currentSlideIndex || this.props.currentSubslideIndex !== nextProps.currentSubslideIndex) && this.props.value !== this.state.value) {
                this.props.onSave(this.state.value, this.props.currentSlideIndex, this.props.currentSubslideIndex);
            }
            this.setState({ value: nextProps.value });
        }
    }

    onValueChange = (value, currentSlideIndex, currentSubslideIndex) => {
        this.setState({ value });
        // this.saveValue(value, currentSlideIndex, currentSubslideIndex);
    }

    getWordLimit = (langCode, duration) => {
        const langWordsPerMinute = langsWordsPerMinute.find((l) => l.code === langCode);
        const wordsPerMinute = langWordsPerMinute ? langWordsPerMinute.limit : defaultWordsPerMinute;
        return Math.round(wordsPerMinute / 60 * duration);
    }


    getWordCount = () => {
        return this.state.value.split(' ').filter(v => v).length;
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
                            className="anything"
                        >
                            <h4 style={{ color: '#333333', margin: 0, padding: '1rem' }}>
                                {title}
                            </h4>
                            {!this.props.disabled && (
                                <Button
                                    basic
                                    className="translate-box__update-button"
                                    loading={loading}
                                    disabled={loading || value.trim() === this.props.value.trim() || !value.trim()}
                                    style={{ backgroundColor: 'transparent', boxShadow: 'none !important', margin: 0, padding: '1rem' }}
                                    onClick={() => this.props.onSave(value, this.props.currentSlideIndex, this.props.currentSubslideIndex)}
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

                        <TextArea
                            style={{ padding: 20, paddingRight: 40, marginBottom: 40, maxHeight: 100, width: '100%', border: 'none', resize: 'none', cursor: this.props.disabled ? 'not-allowed' : 'text' }}
                            disabled={this.props.disabled}
                            rows={6}
                            placeholder="Translate slide text"
                            value={value}
                            onChange={(e, { value }) => { this.onValueChange(value, this.props.currentSlideIndex, this.props.currentSubslideIndex) }}
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
