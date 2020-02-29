import React from 'react';
import { Dropdown, Checkbox, Label, Icon } from 'semantic-ui-react';

export default class CommentsDropdown extends React.Component {
    state = {
        selectedIndexes: [],
    }

    onSelect = (e, index) => {
        e.stopPropagation();
        e.preventDefault();
        console.log(index)
        let selectedIndexes = this.props.value;
        if (index === -1 && selectedIndexes.indexOf(-1) === -1) {
            this.props.onChange([-1])
            return;
        }
        if (selectedIndexes.indexOf(index) === -1) {
            selectedIndexes.push(index);
        } else {
            selectedIndexes.splice(selectedIndexes.indexOf(index), 1);
        }
        if (selectedIndexes.indexOf(-1) !== -1) {
            selectedIndexes.splice(selectedIndexes.indexOf(-1), 1);
        }
        this.props.onChange(selectedIndexes.slice().sort((a, b) => a - b));
    }

    render() {
        const { value } = this.props;
        return (
            <span>
                <Dropdown
                    scrolling
                    className="comments-dropdown"
                    text={<span style={{ color: '#0e7ceb' }}>
                        {value.indexOf(-1) !== -1 || value.length === 0 ? 'All slides' : `Slides ${value.map(a => a+1).join(', ')}`}
                    </span>}
                    icon={<Icon name="chevron down" style={{ color: '#0e7ceb' }} />}
                >
                    <Dropdown.Menu
                        onClick={(e) => e.stopPropagation()}
                    >
                        {this.props.options.map((option) => (
                            <Dropdown.Item
                                key={option.key}
                                onClick={(e) => this.onSelect(e, option.value)}
                            >
                                <div
                                    style={{ display: 'flex', alignItems: 'center' }}
                                >
                                    <Checkbox
                                        style={{ marginRight: 10 }}
                                        onClick={e => this.onSelect(e, option.value)} checked={this.props.value.indexOf(option.value) !== -1}

                                    />
                                    <span>
                                        {option.text}
                                    </span>
                                </div>
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
                {this.props.value.map((s) => (
                    <Label
                        key={`seleced-slide-${s}`}
                        style={{ padding: '0.8rem 1.5rem', borderRadius: '1rem', marginRight: '1rem' }}
                    >
                        {s === -1 ? 'All slides' : `Slide ${s + 1}`}
                        <Icon name="close" style={{ cursor: 'pointer', paddingLeft: '10px' }} onClick={(e) => this.onSelect(e, s)} />
                    </Label>
                ))}
            </span>
        )
    }
}