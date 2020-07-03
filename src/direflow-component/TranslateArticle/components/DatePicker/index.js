import React from "react";
import style from "react-datepicker/dist/react-datepicker.css";
import ReactDatePicker from "react-datepicker";
import { Styled } from "direflow-component";

export default class DatePicker extends React.Component {
  render() {
    const { datepickerRef, ...rest } = this.props;
    return (
      <Styled styles={style}>
        <span>
          <ReactDatePicker ref={datepickerRef} {...rest} />
        </span>
      </Styled>
    );
  }
}
