import React from 'react';
import PropTypes from 'prop-types';

import { formatTime } from '../../utils/helpers';


const SCALE = 1;
const SLIDE_DURATION_THREASHOLD = 500;
const DELTA_THREASHOLD = 30000;
const TIMELINE_SPEED = 20;
const STRETCH_SPEED = 35;
// 
const BACKGROUND_COLOR = '#293339'

function getNearestSubtitle(subtitles, startTime, endTime) {
    return subtitles.slice().reverse().find((s) => s.startTime < startTime && s.endTime < endTime)
}

function isInSubtitleRange(subtitle, startTime, endTime) {
    return subtitle.startTime <= startTime && subtitle.endTime >= endTime;
}

function sortSubtitles(subtitles) {
    return subtitles.slice().sort((a, b) => a.startTime - b.startTime);
}

function getPrevSubtitle(subtitles, subtitle) {
    return sortSubtitles(subtitles).reverse().find((s) => s.startTime < subtitle.startTime)
}

function getNextSubtitle(subtitles, subtitle) {
    return sortSubtitles(subtitles).find((s) => s.startTime > subtitle.startTime)
}

function durationToPixels(duration, scale) {
    return Math.floor(scale * duration / 10)
}

function pixelsToDuration(width, scale) {
    return width * 10 / scale
}

function drawSecond(ctx, xPos, t) {
    ctx.fillStyle = "white";
    let text = formatTime(t) + 's';
    let metrics = ctx.measureText(text);
    let x = xPos - metrics.width / 2;
    ctx.fillText(text, x, 25)
}

function drawTics(ctx, xPos, duration) {
    ctx.strokeStyle = "white";
    let divisions = duration / 250;
    let step = durationToPixels(1000, SCALE);
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 1; i < divisions; i++) {
        let x = Math.floor(.5 + xPos + step * i);
        x += .5;
        ctx.moveTo(x, 30);
        if (i === 2) {
            ctx.lineTo(x, 40)
        } else {
            ctx.lineTo(x, 40)
        }
    }
    ctx.stroke()
}
function drawCanvas(canvasElt, width, height, duration, startTime, endTime) {
    let ctx = canvasElt.getContext("2d");
    ctx.clearRect(0, 0, width, height);
    ctx.font = height / 3 + "px Open Sans";
    if (startTime < 0) {
        startTime = 0
    }
    if (duration) {
        endTime = Math.min(endTime, duration)
    }
    for (let t = startTime; t < endTime; t += 1e3) {
        let xPos = durationToPixels(t - startTime, SCALE);
        drawSecond(ctx, xPos, t);
        drawTics(ctx, xPos, Math.min(1e3, endTime - t))
    }
}

function removeMilliseconds(time) {
    return parseInt(time / 1000) * 1000;
}


class VideoTimelineV2 extends React.Component {

    state = {
        deltaMS: 0,
        deltas: [],
        left: 0,
        lastLeft: 0,
        barHalfSize: 0,
        currentTime: 0,
        subtitles: [],
    }

    componentDidMount = () => {
        let { duration, subtitles } = this.props;
        if (!subtitles) {
            subtitles = [];
        }
        drawCanvas(this.canvasRef, 6000, 40, duration || 0, 0, 60000)
        const barHalfSize = this.canvasRef.parentElement.offsetWidth / 2;
        const newLeft = this.state.barHalfSize - durationToPixels(this.props.currentTime, SCALE);
        this.setState({ barHalfSize, subtitles: subtitles.map((s) => ({ ...s })), left: newLeft, lastLeft: newLeft }, () => {
            if (this.props.currentTime !== 0) {
                this.handleCurrentTimeChange(this.props.currentTime, this.props.duration)
            }
        });
        window.onresize = () => {
            setTimeout(() => {
                this.setState(({ barHalfSize, left }) => {
                    const newBarHalfSize = this.canvasRef.parentElement.offsetWidth / 2;

                    return {
                        barHalfSize: newBarHalfSize,
                        left: left - barHalfSize + newBarHalfSize
                    };
                });
            }, 0);
        }
    }


    componentWillReceiveProps(nextProps) {
        if (this.props.currentTime !== nextProps.currentTime) {

            this.setState(({ lastLeft }) => {
                const left = this.state.barHalfSize - durationToPixels(nextProps.currentTime, SCALE);
                return { left: left, lastLeft: lastLeft - TIMELINE_SPEED };
            }, () => {
                this.handleCurrentTimeChange(nextProps.currentTime, nextProps.duration)
            });
        }
        if (nextProps.subtitles !== this.props.subtitles) {
            let newSubtitles = nextProps.subtitles || [];
            this.setState({ subtitles: newSubtitles.map((s) => ({ ...s })) });
        }
    }

    handleCurrentTimeChange = (currentTime, duration) => {
        if ((currentTime - this.state.deltaMS + pixelsToDuration(this.state.barHalfSize, SCALE)) >= DELTA_THREASHOLD) {
            // this.setState(({deltaMS}) => ({ deltaMS: deltaMS + DELTA_THREASHOLD }));
            const startTime = removeMilliseconds(currentTime - pixelsToDuration(this.state.barHalfSize, SCALE));
            const endTime = removeMilliseconds(currentTime + DELTA_THREASHOLD);

            const deltaMS = startTime;
            this.setState(({ deltas }) => ({ currentTime, deltaMS, deltas: [...deltas, { deltaMS, startTime, endTime }] }), () => {
                drawCanvas(this.canvasRef, 6000, 40, duration, startTime, endTime);
            })
        } else if (this.state.deltaMS && (currentTime - pixelsToDuration(this.state.barHalfSize, SCALE)) <= this.state.deltaMS) {
            this.setState(({ deltas }) => {
                let startTime = 0;
                let endTime = 60000;
                let deltaMS = 0;
                let newDeltas = [...deltas];
                if (deltas.length > 0) {
                    const lastDelta = newDeltas.pop();
                    startTime = lastDelta.startTime;
                    endTime = lastDelta.endTime;
                    deltaMS = lastDelta.deltaMS;
                }

                drawCanvas(this.canvasRef, 6000, 40, duration, startTime, endTime);
                return { deltas: newDeltas, deltaMS, currentTime };
            }, () => {
                // console.log('trick trick')
                // DONT ASK ABOUT THIS, IT JUST WORKS!!
                // Wasted Time: 2 hours
                this.handleCurrentTimeChange(currentTime + 10, duration)
            })
        } else {
            this.setState({ currentTime });
        }
    }

    componentWillUnmount = () => {
        window.onresize = null;
    }

    onTimelineDrag = (e) => {
        e.stopPropagation();
        const currentleft = e.clientX;
        if (currentleft) {
            let ntime;
            this.setState(({ left, lastLeft, barHalfSize, deltaMS }) => {
                let newLeft = left;
                if (currentleft < lastLeft) {
                    newLeft = left - TIMELINE_SPEED;
                } else if (currentleft > lastLeft) {
                    newLeft = left + TIMELINE_SPEED;
                } else {
                    newLeft = left;
                }
                if (newLeft >= barHalfSize) {
                    newLeft = barHalfSize;
                }

                let newTime = pixelsToDuration(barHalfSize - newLeft, SCALE);
                if (newTime >= this.props.duration) {
                    newTime = this.props.duration;
                }
                // if (this.props.onTimeChange) {
                //     this.props.onTimeChange(newTime)
                // }
                ntime = newTime;
                return { left: newLeft, lastLeft: currentleft, currentTime: newTime };
            }, () => {
                this.handleCurrentTimeChange(ntime, this.props.duration);
            })
        }
    }

    onTimelineDragEnd = () => {
        setTimeout(() => {
            if (this.props.onTimeChange) {
                this.props.onTimeChange(this.state.currentTime);
            }
        }, 0);
    }

    onDragStart = (e) => {
        e.stopPropagation();
        let img = new Image();
        img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
        e.dataTransfer.setDragImage(img, 0, 0);
    }

    onSlideDrag = (e, index) => {
        e.stopPropagation();
        const currentleft = e.clientX;
        if (currentleft) {
            this.setState(({ subtitles }) => {
                const { startTime, endTime } = subtitles[index];
                let left = durationToPixels(startTime, SCALE);
                let { lastLeft } = subtitles[index];
                if (!lastLeft) {
                    lastLeft = 0
                }
                let newLeft = left;
                if (currentleft < lastLeft) {
                    newLeft = left - 3;
                } else if (currentleft > lastLeft) {
                    newLeft = left + 3;
                }
                if (newLeft <= 0) {
                    newLeft = 0;
                }
                const diff = subtitles[index].startTime - pixelsToDuration(newLeft, SCALE)

                subtitles[index].startTime -= diff;
                subtitles[index].endTime = endTime - diff;
                const crossedSubtitleBackward = subtitles.filter((s, i) => i !== index).find((s) => subtitles[index].startTime >= s.startTime & subtitles[index].startTime <= s.endTime)

                const crossedSubtitleForward = subtitles.filter((s, i) => i !== index).find((s) => subtitles[index].endTime >= s.startTime & subtitles[index].endTime <= s.endTime)
                if (crossedSubtitleForward) {
                    subtitles[index].startTime += diff;
                    subtitles[index].endTime = crossedSubtitleForward.startTime;
                } else if (crossedSubtitleBackward) {
                    subtitles[index].startTime = crossedSubtitleBackward.endTime;
                    subtitles[index].endTime = endTime;
                }
                if (subtitles[index].endTime > this.props.duration) {
                    subtitles[index].startTime = startTime
                    subtitles[index].endTime = this.props.duration;
                }
                subtitles[index].lastLeft = currentleft;
                return { subtitles };
            })
        }
    }

    onSlideDragEnd = (index) => {
        setTimeout(() => {
            this.props.onSubtitleChange(this.state.subtitles[index], index, { startTime: this.state.subtitles[index].startTime / 1000, endTime: this.state.subtitles[index].endTime / 1000 });
        }, 0);
    }

    onIncreaseStartTime = (e, index) => {
        e.stopPropagation();
        const currentleft = e.clientX;
        if (currentleft) {
            this.setState(({ subtitles }) => {

                let { lastLeft } = subtitles[index];
                if (!lastLeft) {
                    lastLeft = 0;
                }
                if (currentleft < lastLeft) {
                    subtitles[index].startTime -= STRETCH_SPEED;
                } else if (currentleft > lastLeft) {
                    subtitles[index].startTime += STRETCH_SPEED;
                }
                if ((subtitles[index].endTime - subtitles[index].startTime) < SLIDE_DURATION_THREASHOLD) {
                    subtitles[index].endTime = subtitles[index].startTime + SLIDE_DURATION_THREASHOLD;
                }
                if (subtitles[index].startTime < 0) {
                    subtitles[index].startTime = 0;
                }

                const crossedSubtitle = subtitles.filter((s, i) => i !== index).find((s) => subtitles[index].startTime >= s.startTime & subtitles[index].startTime <= s.endTime)
                if (crossedSubtitle) {
                    subtitles[index].startTime = crossedSubtitle.endTime;
                }
                subtitles[index].lastLeft = currentleft;

                // const startTime = removeMilliseconds(this.state.currentTime - pixelsToDuration(this.state.barHalfSize, SCALE));
                // const endTime = removeMilliseconds(this.state.currentTime + DELTA_THREASHOLD);
                // drawCanvas(this.canvasRef, 6000, 40, this.props.duration, startTime, endTime);
                return { subtitles };
            })
        }
    }

    onIncreaseStartTimeEnd = (index) => {
        setTimeout(() => {
            this.props.onSubtitleChange(this.state.subtitles[index], index, { startTime: this.state.subtitles[index].startTime / 1000 });
        }, 0);
    }

    onIncreaseEndTime = (e, index) => {
        e.stopPropagation();
        const currentleft = e.clientX;
        if (currentleft) {
            this.setState(({ subtitles }) => {
                let { lastLeft } = subtitles[index];
                if (!lastLeft) {
                    lastLeft = 0;
                }
                if (currentleft < lastLeft) {
                    subtitles[index].endTime -= STRETCH_SPEED;
                } else if (currentleft > lastLeft) {
                    subtitles[index].endTime += STRETCH_SPEED;
                }

                if ((subtitles[index].endTime - subtitles[index].startTime) < SLIDE_DURATION_THREASHOLD) {
                    subtitles[index].endTime = subtitles[index].startTime + SLIDE_DURATION_THREASHOLD;
                }
                const crossedSubtitle = subtitles.filter((s, i) => i !== index).find((s) => subtitles[index].endTime >= s.startTime & subtitles[index].endTime <= s.endTime)
                if (crossedSubtitle) {
                    subtitles[index].endTime = crossedSubtitle.startTime;
                }
                if (subtitles[index].endTime > this.props.duration) {
                    subtitles[index].endTime = this.props.duration
                }
                subtitles[index].lastLeft = currentleft;

                // const startTime = removeMilliseconds(this.state.currentTime - pixelsToDuration(this.state.barHalfSize, SCALE));
                // const endTime = removeMilliseconds(this.state.currentTime + DELTA_THREASHOLD);

                // drawCanvas(this.canvasRef, 6000, 40, this.props.duration, startTime, endTime);
                return { subtitles };
            })
        }
    }

    onIncreaseEndTimeEnd = (index) => {
        setTimeout(() => {
            this.props.onSubtitleChange(this.state.subtitles[index], index, { endTime: this.state.subtitles[index].endTime / 1000 });
        });
    }

    onWordDrop = (e, subtitle, wordIndex) => {
        e.stopPropagation();
        try {
            const data = e.dataTransfer.getData('text');
            if (data && JSON.parse(data) && JSON.parse(data).split) {
                console.log(wordIndex)
                if (wordIndex) {
                    this.props.onSubtitleSplit(subtitle, wordIndex);
                }
            }
        } catch (e) {

        }
    }

    renderSubtitles = () => {
        const TOP = 40;
        const HEGIHT = '100%';
        const MINHEIGHT = 30;
        const draggable = !this.props.disableEditing;
        // const left = this.state.barHalfSize - durationToPixels(this.state.currentTime - this.state.deltaMS, SCALE);
        // Render only the current viewed subtitles
        return this.state.subtitles.map((slide, index) =>
            ((slide.endTime + pixelsToDuration(this.state.barHalfSize, SCALE)) > this.state.currentTime) && slide.startTime - pixelsToDuration(this.state.barHalfSize, SCALE) < this.state.currentTime ? (
                <React.Fragment key={slide._id + 'fragment'}>
                    <div
                        // key={slide.text + }
                        style={{
                            display: 'inline-block',
                            position: 'absolute',
                            overflow: 'hidden',
                            top: TOP,
                            borderRadius: 25,
                            minHeight: MINHEIGHT,
                            background: slide.backgroundColor || 'white',
                            color: slide.color || 'white',
                            paddingLeft: 20,
                            paddingRight: 20,
                            cursor: 'pointer',

                            width: durationToPixels(slide.endTime, SCALE) - durationToPixels(slide.startTime, SCALE),
                            left: durationToPixels(slide.startTime - this.state.deltaMS, SCALE),
                        }}
                        onClick={() => this.props.onSubtitleSelect(slide, index)}
                    >
                        {this.props.splitterDragging ?
                            slide.text.split(' ').map((t, i) => (
                                <span
                                    style={{
                                        display: 'inline-block',
                                        paddingTop: '0.5rem',
                                        paddingBottom: '0.5rem',
                                        paddingLeft: 2,
                                        paddingRight: 2,
                                    }}
                                    onDragOver={(e) => {
                                        e.target.style['border-left'] = '5px solid red';
                                    }}
                                    onDragLeave={(e) => e.target.style['border-left'] = 'none'}
                                    onDropCapture={(e) => e.target.style['border-left'] = 'none' && this.onWordDrop(e, slide, i)}
                                    key={t + i}>{t}</span>
                            ))
                            : (
                                <span
                                    style={{
                                        paddingTop: '0.5rem',
                                        paddingBottom: '0.5rem',
                                        display: 'inline-block',
                                        width: '100%',
                                        minHeight: MINHEIGHT,
                                    }}
                                    draggable={draggable}
                                    onDragStart={this.onDragStart}
                                    onDragCapture={(e) => this.onSlideDrag(e, index)}
                                    onDragEnd={() => this.onSlideDragEnd(index)}
                                >
                                    {slide.text}
                                </span>
                            )}
                        {this.props.selectedSubtitleIndex === index && (
                            <React.Fragment>

                                <div
                                    // key={slide.text + 'left-handler'}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        height: HEGIHT,
                                        width: 15,
                                        left: 0,
                                        zIndex: 5,
                                        opacity: 0.7,
                                    }}
                                >
                                    <span
                                        href="javascript:void(0)"
                                        style={{
                                            background: '#A2A3A4',
                                            position: 'absolute',
                                            cursor: draggable ? 'col-resize' : 'normal',
                                            height: '100%',
                                            width: 15,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',

                                        }}
                                        draggable={draggable}
                                        onDragStart={this.onDragStart}
                                        onDragCapture={(e) => this.onIncreaseStartTime(e, index)}
                                        onDragEnd={() => this.onIncreaseStartTimeEnd(index)}
                                    >
                                        {'<'}
                                    </span>
                                </div>
                                <div
                                    // key={slide.text + 'right-handler'}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        height: HEGIHT,
                                        width: 15,
                                        right: 0,
                                        zIndex: 5,
                                        opacity: 0.7,
                                    }}
                                >
                                    <span
                                        href="javascript:void(0)"
                                        style={{
                                            background: '#A2A3A4',
                                            position: 'absolute',
                                            cursor: draggable ? 'col-resize' : 'normal',
                                            height: '100%',
                                            width: 15,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                        draggable={draggable}
                                        onDragStart={this.onDragStart}
                                        onDragCapture={(e) => this.onIncreaseEndTime(e, index)}
                                        onDragEnd={() => this.onIncreaseEndTimeEnd(index)}
                                    >
                                        {'>'}
                                    </span>
                                </div>

                            </React.Fragment>
                        )}
                    </div>
                </React.Fragment>
            ) : null)
    }

    onItemDrop = (e) => {
        e.preventDefault();
        try {
            if (e.dataTransfer.getData('text') && JSON.parse(e.dataTransfer.getData('text')).speaker) {
                const { subtitles } = this.props
                const left = this.state.barHalfSize - durationToPixels(this.state.currentTime - this.state.deltaMS, SCALE) + this.containerRef.getBoundingClientRect().x;
                const deltaDur = Math.abs(parseFloat(((left - e.clientX) / 100)) * 1000);
                const startTime = Math.abs(this.state.deltaMS + deltaDur - pixelsToDuration(this.containerRef.getBoundingClientRect().x, SCALE) / 10);
                // debugger;
                const { speaker } = JSON.parse(e.dataTransfer.getData('text'));
                const newSubtitle = {
                    startTime: startTime,
                    endTime: startTime + 1000,
                    text: '',
                    speakerProfile: speaker,
                }

                // Check if the new subtitle has enough length and doesnt overflow with other subtitles
                const crossedBackwardIndex = subtitles.findIndex((s) => newSubtitle.startTime > s.startTime && newSubtitle.startTime < s.endTime);
                const crossedForwardIndex = subtitles.findIndex((s) => newSubtitle.endTime > s.startTime && newSubtitle.endTime < s.endTime);
                const crossedSubtitleBackward = subtitles[crossedBackwardIndex];
                const crossedSubtitleForward = subtitles[crossedForwardIndex];
                // const crossed = subtitles.find(s => newSubtitle.endTime < s.endTime && newSubtitle.startTime > s.startTime)
                if (!crossedSubtitleBackward && !crossedSubtitleForward) {
                    // Find nearest subtitle to add the new one to it's slide
                    const nearestSubtitle = getNearestSubtitle(subtitles, newSubtitle.startTime, newSubtitle.endTime)
                    // If the nearest subtitle doesn't exist, then there's no subtitle before that ( it's in the first slide )
                    if (nearestSubtitle) {
                        newSubtitle.slidePosition = nearestSubtitle.slidePosition;
                        newSubtitle.subslidePosition = nearestSubtitle.subslidePosition;
                    } else {
                        newSubtitle.slidePosition = 0;
                        newSubtitle.subslidePosition = 0;
                    }

                    newSubtitle.startTime /= 1000;
                    newSubtitle.endTime /= 1000;
                    this.props.onAddSubtitle(newSubtitle);
                } else {
                    if (crossedSubtitleForward && !(isInSubtitleRange(crossedSubtitleForward, newSubtitle.startTime, newSubtitle.endTime))) {
                        // If it's crossed forward, see if we can make the endtime of the 
                        // new slide as the start time of the crossed slide
                        const prevSubtitle = getPrevSubtitle(subtitles, crossedSubtitleForward);
                        if (prevSubtitle && prevSubtitle.endTime + 1000 <= (crossedSubtitleForward.startTime)) {
                            newSubtitle.endTime = crossedSubtitleForward.startTime;
                            newSubtitle.startTime = newSubtitle.endTime - 1000;
                            const nearestSubtitle = getNearestSubtitle(subtitles, newSubtitle.startTime, newSubtitle.endTime)
                            if (nearestSubtitle) {
                                newSubtitle.slidePosition = nearestSubtitle.slidePosition;
                                newSubtitle.subslidePosition = nearestSubtitle.subslidePosition;
                            }
                            newSubtitle.startTime /= 1000;
                            newSubtitle.endTime /= 1000;
                            this.props.onAddSubtitle(newSubtitle);
                        } else {
                            alert('Invalid slide position');
                        }
                    } else if (crossedSubtitleBackward && !(isInSubtitleRange(crossedSubtitleBackward, newSubtitle.startTime, newSubtitle.endTime))) {
                        // If it's crossed backward, see if we can make the startTime of the 
                        // new slide as the end time of the crossed slide
                        const nextSubtitle = getNextSubtitle(subtitles, crossedSubtitleBackward);
                        if (nextSubtitle && nextSubtitle.startTime - 1000 >= (crossedSubtitleBackward.endTime)) {
                            newSubtitle.startTime = crossedSubtitleBackward.endTime;
                            newSubtitle.endTime = newSubtitle.startTime + 1000;
                            const nearestSubtitle = getNearestSubtitle(subtitles, newSubtitle.startTime, newSubtitle.endTime)
                            if (nearestSubtitle) {
                                newSubtitle.slidePosition = nearestSubtitle.slidePosition;
                                newSubtitle.subslidePosition = nearestSubtitle.subslidePosition;
                            }
                            newSubtitle.startTime /= 1000;
                            newSubtitle.endTime /= 1000;
                            this.props.onAddSubtitle(newSubtitle);
                        } else {
                            alert('Invalid slide position');
                        }
                    } else {
                        alert('Invalid slide position');
                    }
                }
            }
        } catch (e) {

        }
    }

    render() {
        const left = this.state.barHalfSize - durationToPixels(this.state.currentTime - this.state.deltaMS, SCALE);
        return (
            <div
                ref={(ref) => this.containerRef = ref}
            >
                <div
                    style={{ position: 'relative', width: '100%', height: 40, background: BACKGROUND_COLOR }}
                >
                    <canvas
                        ref={(ref) => this.canvasRef = ref}
                        onDrag={this.onTimelineDrag}
                        onDragEnd={this.onTimelineDragEnd}
                        onDragStart={this.onDragStart}
                        draggable={true}
                        width={6000}
                        height={40}
                        style={{ background: BACKGROUND_COLOR, position: 'absolute', left }}
                    />
                    <div style={{ content: '', dispaly: 'block', height: '100%', left: '50%', position: 'absolute', width: 2, zIndex: 3, borderRight: '1px solid #FC0D1B' }}>
                    </div>
                    <div
                        onDrag={this.onTimelineDrag}
                        onDragEnd={this.onTimelineDragEnd}
                        onDragStart={this.onDragStart}
                        draggable={true}
                        style={{ position: 'absolute', left, width: 6000, height: 80, color: 'white', zIndex: 2 }}
                        onDrop={(e, data) => this.onItemDrop(e, data)}
                        onDragOver={(e) => e.preventDefault()}
                    >
                        {this.renderSubtitles()}
                    </div>
                </div>
            </div>
        )
    }
}

VideoTimelineV2.propTypes = {
    currentTime: PropTypes.number,
    duration: PropTypes.number,
    subtitles: PropTypes.array,
    onTimeChange: PropTypes.func,
    onSubtitleSelect: PropTypes.func,
    onSubtitleChange: PropTypes.func,
}

VideoTimelineV2.defaultProps = {
    currentTime: 0,
    duration: 10000,
    subtitles: [],
    onTimeChange: () => { },
    onSubtitleSelect: () => { },
    onSubtitleChange: () => { },
}


export default VideoTimelineV2;