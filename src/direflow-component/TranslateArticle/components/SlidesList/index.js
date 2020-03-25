import React from 'react';
import PropTypes from 'prop-types'
import classnames from 'classnames';
import { Grid, Icon, Button, Card } from 'semantic-ui-react';

import { VIDEO_PLAYER_THUMBNAIL_IMAGE } from '../../constants';
import { reduceSlidesSubslides, getUserNamePreview, formatTime } from '../../utils/helpers';

import { Styled } from 'direflow-component';
import styles from './style.scss';

class SlidesList extends React.Component {
  getsubSlideBorderColor(subslide) {
    if (subslide.text && subslide.audio) {
      return 'green';
    } else {
      return 'gray';
    }
  }

  renderSubslide(subslide, index, maxIndex) {
    let comp;
    if (subslide.media && subslide.media.length > 0) {
      const url = subslide.media[0].smallThumb || subslide.media[0].url;
      if (subslide.media[0].smallThumb) {
        comp = <img src={url} alt="" />;
      } else if (subslide.media[0].mediaType === 'video') {
        comp = <img src={VIDEO_PLAYER_THUMBNAIL_IMAGE} alt="" />
        // comp = <video preload={"false"} src={url} width="100%" height="100%" />;
      } else {
        comp = <img src={url} alt="" />;
      }
    } else {
      comp = null
    }
    const { speakerTranslatorsMap } = this.props;
    return (
      <Grid.Row
        key={`subslide-list-${subslide.position}-${subslide.slidePosition}`}
        onClick={() => this.props.onSubslideClick(subslide.slideIndex, subslide.subslideIndex, { index, maxIndex })}
      >
        <Grid.Column width={16}>
          <div
            className={classnames({ "slide-item": true, active: subslide.slideIndex === this.props.currentSlideIndex && subslide.subslideIndex === this.props.currentSubslideIndex })}
          >
            <span>
              Slide {index + 1} - <small>Speaker {subslide.speakerProfile.speakerNumber}</small>
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
