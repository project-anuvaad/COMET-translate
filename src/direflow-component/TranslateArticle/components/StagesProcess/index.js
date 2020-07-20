import React from "react";
import PropTypes from "prop-types";
import { ARTICLE_STAGES, ARTICLE_STAGES_TITLES } from "../../constants";
import { Icon } from "semantic-ui-react";
import {Styled} from 'direflow-component';
import styles from './style.scss';

export default class StagesProcess extends React.Component {
  render() {
    const { activeStage } = this.props;
    const stagesArray = Object.keys(ARTICLE_STAGES).map(
      (k) => ARTICLE_STAGES[k]
    );
    const activeStageIndex = stagesArray.indexOf(activeStage);
    return (
        <Styled styles={styles}>

      <div>
        {Object.keys(ARTICLE_STAGES).map((stage, index) => (
          <div
            key={`stage-process-${stage}`}
            className="stage-processes__stage"
            onClick={(e) => {
                e.target.blur()
                this.props.onStageClick(ARTICLE_STAGES[stage])
            }}
            style={{ position: "relative", padding: '10px 5px', cursor: 'pointer', borderRadius: '1rem' }}
          >
            {index === activeStageIndex && (
              <Icon
                name="ellipsis horizontal"
                circular
                style={{ color: "white", backgroundColor: "orange" }}
                size="tiny"
              />
            )}
            {index < activeStageIndex && (
              <Icon
                name="check"
                circular
                style={{ color: "white", backgroundColor: "green" }}
                size="tiny"
              />
            )}
            {index > activeStageIndex && (
              <Icon
                name="check"
                circular
                style={{ color: "transparent", backgroundColor: "#d4e0ed" }}
                size="tiny"
              />
            )}
            {index !== 0 && (
              <div
                style={{
                  position: "absolute",
                  width: 1,
                  height: 28,
                  top: -12,
                  left: 11,
                  zIndex: -1,
                  background: index < activeStageIndex ? "green" : "#d4e0ed",
                }}
              ></div>
            )}
            {ARTICLE_STAGES_TITLES[ARTICLE_STAGES[stage]]}
            <Icon className="info-icon" name="info circle" />
          </div>
        ))}
      </div>
        </Styled>
    );
  }
}

StagesProcess.propTypes = {
  stages: PropTypes.object,
  activeStage: PropTypes.string,
};
