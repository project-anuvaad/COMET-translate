import React from 'react';
import { Grid, Dropdown } from 'semantic-ui-react';
import { Styled } from 'direflow-component';
import styles from './style.scss';

export default class AssignTranslateUsersForm extends React.Component {
    state = {
        translators: [],
    }

    onTranslatorChange = (speakerNumber, userId) => {
        const { translators } = this.props;
        if (translators.find((t) => t.speakerNumber === speakerNumber)) {
            translators.find((t) => t.speakerNumber === speakerNumber).user = userId;
        } else {
            translators.push({ speakerNumber, user: userId });
        }
        this.props.onChange(translators)
    }

    render() {
        const { tts, speakersProfile, users } = this.props;
        const dropdownOptions = !users ? [] : users.map((user) => ({ value: user._id, text: `${user.firstname} ${user.lastname} (${user.email})` }))

        return (
            <Styled styles={styles}>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={8}>
                            <h3>
                                Speaker(s)
                        </h3>
                        </Grid.Column>

                        <Grid.Column width={8}>
                            <h3>
                                Translator(s)
                        </h3>
                        </Grid.Column>
                    </Grid.Row>
                    {tts && (
                        <Grid.Row key={`assign-speaker-text`}>
                            <Grid.Column width={8}>
                                Text
                        </Grid.Column>
                            <Grid.Column width={8} style={{ textAlign: 'left' }}>
                                <div>
                                    <Dropdown
                                        fluid
                                        search
                                        selection
                                        clearable
                                        options={dropdownOptions}
                                        className="translate-users-dropdown"
                                        placeholder="Translator"
                                        value={this.props.translators && this.props.translators[0] ? this.props.translators[0].user : null}
                                        onChange={(e, { value }) => {
                                            let newTranslators = [];
                                            speakersProfile.forEach((s) => {
                                                newTranslators.push({
                                                    user: value,
                                                    speakerNumber: s.speakerNumber,
                                                })
                                            })
                                            this.props.onChange(newTranslators)
                                            // this.setState({ translators: newTranslators });
                                        }}
                                    />
                                </div>
                            </Grid.Column>
                        </Grid.Row>
                    )}
                    {!tts && speakersProfile && speakersProfile.filter((s) => s.speakerNumber !== -1).map((speaker) => {
                        const assignedTranslator = this.props.translators.find((t) => speaker.speakerNumber === t.speakerNumber);
                        return (
                            <Grid.Row key={`assign-speaker-${speaker.speakerNumber}`}>
                                <Grid.Column width={8}>
                                    Speaker {speaker.speakerNumber} ({speaker.speakerGender})
                            </Grid.Column>
                                <Grid.Column width={8} style={{ textAlign: 'left' }}>
                                    <div>
                                        <Dropdown
                                            fluid
                                            search
                                            selection
                                            clearable
                                            className="translate-users-dropdown"
                                            options={dropdownOptions}
                                            placeholder="Translator"
                                            value={assignedTranslator ? assignedTranslator.user : null}
                                            onChange={(e, { value }) => this.onTranslatorChange(speaker.speakerNumber, value)}
                                        />
                                    </div>
                                </Grid.Column>
                            </Grid.Row>
                        )
                    })}
                </Grid>
            </Styled>
        )
    }
}