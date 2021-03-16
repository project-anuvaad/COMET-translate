import React from 'react';
import PropTypes from 'prop-types'
import classnames from 'classnames';
import { Grid, Icon, Button, Card, Popup } from 'semantic-ui-react';

import { VIDEO_PLAYER_THUMBNAIL_IMAGE } from '../../constants';
import { reduceSlidesSubslides, getUserNamePreview, formatTime, getUserName } from '../../utils/helpers';

import { Styled } from 'direflow-component';
import styles from './style.scss';
import ReactAvatar from 'react-avatar';

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

class SlidesList extends React.Component {
  getWordLimit = (langCode, duration) => {
    const langWordsPerMinute = langsWordsPerMinute.find((l) => l.code === langCode);
    const wordsPerMinute = langWordsPerMinute ? langWordsPerMinute.limit : defaultWordsPerMinute;
    return Math.round(wordsPerMinute / 60 * duration);
  }

  textIsValid = (subslide) => {
    // this.getWordLimit(this.props.langCode, subslide.media[0].duration);
    if (subslide.text &&  subslide.text.split(' ').filter(t => t).length <= this.getWordLimit(this.props.langCode, subslide.media[0].duration)) return true;
  }

  getsubSlideBorderColor(subslide) {
    if (subslide.text && subslide.audio) {
      return 'green';
    } else {
      return 'gray';
    }
  }
  renderUserAvatar = user => {
        const username = getUserNamePreview(user)
        const usernameAndEmail = getUserName(user);

        return <Popup
            content={usernameAndEmail}
            trigger={
                <span style={{ display: 'flex' }}>
                    <ReactAvatar
                        round
                        size={20}
                        name={username}
                        // style={{ margin: '0 10px', display: 'inline-block' }}
                    />
                </span>
            }
        />
    }

  renderSubslide(subslide, index, maxIndex) {
    let comp;
    if (subslide.media && subslide.media.length > 0) {
      const url = subslide.media[0].smallThumb || subslide.media[0].url;
      if (subslide.media[0].smallThumb) {
        comp = <img src={url} alt="" />;
      // } else if (subslide.media[0].mediaType === 'video') {
      //   comp = <img src={VIDEO_PLAYER_THUMBNAIL_IMAGE} alt="" />
      //   // comp = <video preload={"false"} src={url} width="100%" height="100%" />;
      } else {
        comp = <img src={url} alt="" />;
      }
    } else {
      comp = null
    }
    const { speakerTranslatorsMap, textTranslator } = this.props;
    const userAvatar = speakerTranslatorsMap[subslide.speakerProfile.speakerNumber] ? this.renderUserAvatar(speakerTranslatorsMap[subslide.speakerProfile.speakerNumber]) : null;
    const textTranslatorAvatar = textTranslator ? this.renderUserAvatar(textTranslator) : null;
    const voiceIsValid = subslide.audioDuration ? (subslide.endTime - subslide.startTime) - subslide.audioDuration <= 1 : false;
    return (
      <Grid.Row
        key={`subslide-list-${subslide.position}-${subslide.slidePosition}`}
        onClick={() => this.props.onSubslideClick(subslide.slideIndex, subslide.subslideIndex, { index, maxIndex })}
      >
        <Grid.Column width={16}>
          <div
            className={classnames({ "slide-item": true, active: subslide.slideIndex === this.props.currentSlideIndex && subslide.subslideIndex === this.props.currentSubslideIndex })}
          >
            <span style={{ marginRight: 16 }}>
              Slide {index + 1} - <small>Speaker {subslide.speakerProfile.speakerNumber}</small>
            </span>
            <span style={{ display: 'flex', marginRight: 'auto' }}>
              {textTranslatorAvatar && (
                <span style={{  borderRadius: 10, display: 'flex', alignItems: 'center', backgroundColor: `${this.textIsValid(subslide) ? '#1bb248' : '#f99d25'}`, marginRight: 16 }}>
                  {textTranslatorAvatar}
                    <span style={{ color: "#fff", fontStyle: 'italic', fontWeight: 'bold', paddingLeft: 4, paddingRight: 8, fontSize: 12 }}>T</span>
                </span>
              )}
              {userAvatar && (
                <span style={{  borderRadius: 10, display: 'flex', alignItems: 'center', backgroundColor: `${voiceIsValid ? '#1bb248' : '#f99d25'}` }}>
                  {userAvatar}
                    {subslide.audioDuration ? (
                      <Icon name="microphone" size="small" style={{ color: "#fff", paddingLeft: 4, paddingRight: 10 }} />
                    ) : null}
                </span>
              )}
            </span>
            <div>
              <span className="timing">
                {formatTime(subslide.startTime * 1000)} - {formatTime(subslide.endTime * 1000)}
              </span>
              {((subslide.text && subslide.audio) || subslide.picInPicVideoUrl) && (
                <Icon className="marker-icons" name="check circle" color="green" />
              )}
            </div>
          </div>
        </Grid.Column>
      </Grid.Row>
    )
  }

  render() {
    const reducedSubslides = reduceSlidesSubslides(this.props.slides);
    return (
      <Styled styles={styles}>
        <Grid className="slides-container">
          {reducedSubslides.map((slide, index) => this.renderSubslide(slide, index, reducedSubslides.length - 1))}
        </Grid>
      </Styled>
    )
  }

}

SlidesList.propTypes = {
  slides: PropTypes.array,
  currentSlideIndex: PropTypes.number,
  translateable: PropTypes.bool,
  onSubslideClick: PropTypes.func,
}

SlidesList.defaultProps = {
  slides: [],
  currentSlideIndex: 0,
  translateable: false,
  onSubslideClick: () => { },
}

export default SlidesList;
