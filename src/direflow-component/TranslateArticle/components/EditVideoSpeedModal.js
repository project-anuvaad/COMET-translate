import React from 'react';
import { Modal, Button, Input, Grid } from 'semantic-ui-react';

export default class EditVideoSpeedModal extends React.Component {
    state = {
        open: false,
        value: 1,
    }

    componentDidMount = () => {
        if (this.props.value) {
            this.setState({ value: this.props.value });
        }
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.value !== this.state.value) {
            this.setState({ vaue: nextProps.value })
        }
    }

    render() {
        return (
            <Modal
                size='tiny'
                open={this.state.open}
                trigger={
                    <span
                    >
                        <strong>
                            Video Speed: {parseFloat(this.state.value).toFixed(2)}x
                        </strong>
                        <Button
                            circular
                            basic
                            icon="edit"
                            style={{ marginLeft: 10 }}
                            onClick={() => this.setState({ open: true })}
                        />
                    </span>
                }
            >
                <Modal.Header>
                    Video Speed
                </Modal.Header>
                <Modal.Content>
                    <Grid>
                        <Grid.Row style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Grid.Column width={4}>
                                <h4>Video Speed:</h4>
                            </Grid.Column>
                            <Grid.Column width={4}>
                                <Input
                                    type='number'
                                    min={10}
                                    max={100}
                                    step={10}
                                    fluid
                                    value={this.state.value * 100}
                                    onChange={(e) => this.setState({ value: e.target.value / 100 })}
                                    label="%"
                                    labelPosition="right"
                                />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Modal.Content>
                <Modal.Actions>
                    <Button
                        onClick={() => this.setState({ open: false })}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            this.props.onSubmit(this.state.value);
                            this.setState({ open: false });
                        }}
                        primary
                    >
                        Save
                    </Button>
                </Modal.Actions>
            </Modal>
        )
    }
}