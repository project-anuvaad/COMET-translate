import React from 'react';
import { TextArea, Button, Popup, Card } from 'semantic-ui-react';
import { debounce } from '../../utils/helpers';
import FindAndReplaceModal from '../../components/FindAndReplaceModal';

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
    const { loading } = this.props;
    const { value } = this.state;

    return (
      <Card style={{ margin: 0, width: '100%', marginTop: '2.7rem', borderRadius: 0 }}>
        <Card.Header style={{ backgroundColor: '#d4e0ed', color: '', borderRadius: 0 }}>
          <div
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <h4 style={{ color: '#333333', margin: 0, padding: '1rem' }}>
              Slide 1
            </h4>
            <Button
              basic
              loading={loading}
              disabled={loading || value.trim() === this.props.value.trim() || !value.trim()}
              style={{ backgroundColor: 'transparent', boxShadow: 'none', margin: 0, padding: '1rem' }}
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
          <TextArea
            disabled={this.props.disabled}
            style={{ padding: 20, paddingRight: 40, width: '100%', border: 'none' }}
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
    )
  }
}


export default TranslateBox;
