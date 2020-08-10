import React from 'react';
import { Modal, Button, Input, Grid, Dropdown } from 'semantic-ui-react';

export default class EditVideoSpeedModal extends React.Component {
    state = {
        open: false,
        slideValue: 'slide',
        value: 1,
    }

    componentDidMount = () => {
        if (this.props.value) {
            this.setState({ value: this.props.value });
        }
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.value !== this.state.value) {
            this.setState({ value: nextProps.value })
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
                            Video Speed: {parseFloat(this.props.value).toFixed(2)}x
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
                              <Dropdown
                                value={this.state.slideValue}
                                options={[{ key: 'video-speed-' + this.props.slideIndex, value: 'slide', text: `Slide ${this.props.slideIndex + 1}`},{ key: 'video-speed-all', value: 'all', text: 'All Slides'}]} 
                                onChange={(e, data) => this.setState({ slideValue: data.value })}
                            />
                            </Grid.Column>
                            <Grid.Column width={4}>
                                <Input
                                    type='number'
                                    min={50}
                                    max={200}
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
                            this.props.onSubmit(this.state.value, this.state.slideValue);
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