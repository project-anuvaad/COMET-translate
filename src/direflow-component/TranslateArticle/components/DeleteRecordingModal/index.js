import React from 'react';
import { Modal, Button } from 'semantic-ui-react';

export default class DeleteModalRecording extends React.Component {

    render() {
        return (
            <Modal
                size="tiny"
                open={this.props.open}
                onClose={this.props.onClose}
            >
                <Modal.Header>
                    <h3>Delete Recording</h3>
                </Modal.Header>
                <Modal.Content>
                    Are you sure you want to delete this recording?
            </Modal.Content>
                <Modal.Actions>
                    <Button
                        circular
                        onClick={this.props.onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        color="red"
                        circular
                        onClick={this.props.onConfirm}
                    >
                        Delete
                        </Button>
                </Modal.Actions>
            </Modal>
        )
    }
}