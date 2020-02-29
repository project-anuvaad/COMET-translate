import React from 'react';
import { Modal, Button, Input, Icon } from 'semantic-ui-react';
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

export default class SpeakerTranslationEndtimeModal extends React.Component {
    state = {
        date: new Date()
    }

    componentDidMount = () => {
        if (this.props.value) {
            this.setState({ date: new Date(this.props.value)});
        }
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.value !== this.state.value) {
            this.setState({ date: new Date(nextProps.value) });
        }
    }
    
    handleChange = (date) => {
        this.setState({ date });
    }

    onSave = () => {
        this.props.onSave(this.state.date ? this.state.date.getTime() : new Date().getTime());
    }

    render() {
        return (
            <Modal open={this.props.open} size="tiny">
                <Modal.Content>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
                        <p>
                            This video will be completed by:
                        </p>
                        <div style={{ margin: 10 }}>
                            <DatePicker
                                // inline
                                ref={ref => this.datepickerRef = ref}
                                customInput={<Input ref={ref => this.inputRef = ref} />}
                                selected={this.state.date || new Date()}
                                onChange={this.handleChange} //only when value has changed
                            />
                            <Icon name="calendar alternate" style={{ marginLeft: 10, cursor: 'pointer' }} onClick={() => this.datepickerRef.setFocus(true)} size="large" />
                        </div>
                    </div>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={this.props.onClose}>
                        Cancel
                    </Button>
                    <Button
                        onClick={this.onSave}
                        primary
                    >
                        Save
                    </Button>
                </Modal.Actions>
            </Modal>
        )
    }
}