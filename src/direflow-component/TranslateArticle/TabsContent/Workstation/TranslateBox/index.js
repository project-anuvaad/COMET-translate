import React from 'react';
import { TextArea, Button, Popup, Card, Label, Icon } from 'semantic-ui-react';
import { debounce } from '../../../utils/helpers';
import FindAndReplaceModal from '../../../components/FindAndReplaceModal';
import { Styled } from 'direflow-component';
import styles from './style.scss';

class TranslateBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
        }
        this.saveValue = debounce((value, currentSlideIndex, currentSubslideIndex) => {
            this.props.onSave(value, currentSlideIndex, currentSubslideIndex)
        }, 2000)
    }

    componentDidMount() {
        if (this.state.value !== this.props.value) {
            this.setState({ value: this.props.value });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.value !== nextProps.value) {
            if ((this.props.currentSlideIndex !== nextProps.currentSlideIndex || this.props.currentSubslideIndex !== nextProps.currentSubslideIndex) && this.props.value !== this.state.value) {
                this.props.onSave(this.state.value, this.props.currentSlideIndex, this.props.currentSubslideIndex);
            }
            this.setState({ value: nextProps.value });
        }
    }

    onValueChange = (value, currentSlideIndex, currentSubslideIndex) => {
        this.setState({ value })
        // this.saveValue(value, currentSlideIndex, currentSubslideIndex);
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
                        </div>
                    </Card.Header>
                    <div
                        style={{ margin: 0, padding: 0, position: 'relative' }}
                    >
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
                        <TextArea
                            style={{ padding: 20, paddingRight: 40, width: '100%', border: 'none' }}
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
