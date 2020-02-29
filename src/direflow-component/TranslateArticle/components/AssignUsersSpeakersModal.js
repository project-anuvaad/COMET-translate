import React from 'react';
import { Modal, Button } from 'semantic-ui-react';
import AssignTranslateUsersForm from './AssignTranslateUsersForm';

export default class AssignUsersSpeakersModal extends React.Component {

    state = {
        translators: [],
    }

    componentWillReceiveProps = (nextProps) => {
        if (this.props.article && nextProps.article && this.props.article.translators !== nextProps.article.translators) {
            this.setState({ translators: nextProps.article.translators })
        } else if (!this.props.article && nextProps.article && nextProps.article.translators) {
            this.setState({ translators: nextProps.article.translators });
        } else if (nextProps.article && this.state.translators.length === 0 && nextProps.article.translators.length > 0) {
            this.setState({ translators: nextProps.article.translators });
        }
    }
    
    render() {
        const { article, users } = this.props;

        return (
            <Modal open={this.props.open} onClose={this.props.onClose} size="small">
                <Modal.Header>
                    Assign Users
                </Modal.Header>
                {article && (

                    <Modal.Content>
                        <AssignTranslateUsersForm
                            users={users}
                            article={article}
                            speakersProfile={article.speakersProfile}
                            tts={article.tts}
                            translators={this.state.translators}
                            onChange={(translators) => this.setState({ translators })}
                        />
                    </Modal.Content>
                )}
                <Modal.Actions>
                    <Button
                        onClick={this.props.onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        primary
                        onClick={() => this.props.onSave(this.state.translators)}
                    >
                        Save
                    </Button>
                </Modal.Actions>
            </Modal>
        )
    }
}