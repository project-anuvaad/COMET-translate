import React from 'react';
import { connect } from 'react-redux';
import { Grid, Icon, Button, Dropdown } from 'semantic-ui-react';
import ReactAvatar from 'react-avatar';

import *  as translationActions from '../../../modules/actions';

import { getUserNamePreview, reduceSlidesSubslides } from '../../../utils/helpers';
import SlideCommentsCard from './SlideCommentCard';
import CommentsDropdown from './CommentsDropdown';

import { Styled } from 'direflow-component';
import styles from './style.scss';

class CommentsSidebar extends React.Component {
    state = {
        newComment: '',
        prevListIndex: 0,
    }

    componentDidMount = () => {
        console.log('=============================== Did mount ===========================');
        this.props.setCommentsSlidesIndexes([0])
        this.props.setAddCommentSlideIndex(0);
        this.props.fetchComments()
    }


    loadComments = (slideIndex, subslideIndex) => {
        const { translatableArticle } = this.props;
        const slide = translatableArticle.slides[slideIndex];
        if (slide) {
            const slidePosition = translatableArticle.slides[slideIndex].position;
            const subslidePosition = translatableArticle.slides[slideIndex].content[subslideIndex].position;
            this.props.fetchComments({ slidePosition, subslidePosition });
        } else {
            this.props.fetchComments();
        }
    }

    onAddComment = () => {
        const { addCommentSlideIndex, translatableArticle } = this.props;
        const subslides = reduceSlidesSubslides(translatableArticle.slides)
        const slide = subslides[addCommentSlideIndex];
        if (slide && this.state.newComment) {
            const slidePosition = slide.slidePosition;
            const subslidePosition = slide.subslidePosition;
            this.props.addComment(slidePosition, subslidePosition, this.state.newComment);
            this.setState({ newComment: '' });
        }
    }

    onCommentsSlidesChange = (slidesIndexes) => {
        this.props.setCommentsSlidesIndexes(slidesIndexes)
        this.props.fetchComments();
        if (slidesIndexes && slidesIndexes.length === 1 && slidesIndexes[0] !== -1) {
            this.props.setAddCommentSlideIndex(slidesIndexes[0])
        }
    }

    renderAddComment = (options) => {
        return (
            <Grid.Row style={{ display: 'flex', alignItems: 'center', border: '1px dashed gray', padding: '0.2rem' }}>
                <Grid.Column width={3}>
                    <Dropdown
                        fluid
                        scrolling
                        options={options}
                        value={this.props.addCommentSlideIndex}
                        text={`Slide ${this.props.addCommentSlideIndex + 1}`}
                        onChange={(e, { value }) => this.props.setAddCommentSlideIndex(value)}
                        icon={<Icon name="chevron down" style={{ marginLeft: 5, color: '#0e7ceb' }} />}

                    />
                </Grid.Column>
                <Grid.Column width={10}>
                    <input
                        style={{ backgroundColor: 'transparent', width: '100%', border: 'none' }}
                        placeholder="Write something..."
                        value={this.state.newComment}
                        onChange={(e) => this.setState({ newComment: e.target.value })}
                    />
                </Grid.Column>
                <Grid.Column width={3}>
                    <Button
                        id="comment-btn"
                        disabled={this.props.addCommentLoading || !this.state.newComment}
                        loading={this.props.addCommentLoading}
                        basic
                        style={{ boxShadow: 'none', backgroundColor: 'transparent' }}
                        onClick={(e) => {
                            this.onAddComment()
                        }}
                    >
                        Comment
                    </Button>
                </Grid.Column>
            </Grid.Row>
        )
    }

    renderComments = () => {
        return this.props.comments.length == 0 ? <div>Nothing here yet :)</div> : this.props.comments.map((comment, index) => (
            <SlideCommentsCard
                key={`slide-card-${index}`}

                data={comment}
                loading={this.props.addCommentLoading}
                onAddComment={(content) => {
                    const { slidePosition, subslidePosition } = comment;
                    this.props.addComment(slidePosition, subslidePosition, content);
                }}
            />
        ));
    }

    render() {
        const { open, onClose } = this.props;
        const options = [
        ];
        const subslides = this.props.translatableArticle && this.props.translatableArticle.slides ? reduceSlidesSubslides(this.props.translatableArticle.slides) : [];

        if (subslides && subslides.length > 0) {
            subslides.forEach((subslide, i) => {
                options.push({ key: `slid-item-${i}`, value: i, text: `Slide ${i + 1}` })
            })
        }

        return (
            <Styled styles={styles}>

                <div
                    style={{ paddingBottom: '10rem' }}
                >
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={16}>
                                <h3>
                                    Comments ({this.props.comments ? this.props.comments.length : 0})
                            </h3>
                            </Grid.Column>

                            <Grid.Column width={16} >
                                <span style={{ color: '#999999', marginRight: 10 }}>
                                    Showing commets for
                            </span>
                                {subslides && (
                                    <CommentsDropdown
                                        value={this.props.commentsSlidesIndexes}
                                        options={[{ key: 'slide-item--1', value: -1, text: 'All Slides' }].concat(options)}
                                        onChange={this.onCommentsSlidesChange}
                                    />
                                )}
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={16} style={{ maxHeight: '300px', overflowY: 'scroll' }}>
                                {this.renderComments()}
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row style={{ marginLeft: '2rem', marginRight: 0, display: 'flex', alignItems: 'center' }}>
                            <Grid.Column width={2}>
                                <ReactAvatar
                                    round
                                    size={40}
                                    name={getUserNamePreview(this.props.user)}
                                />
                            </Grid.Column>
                            <Grid.Column width={12}>
                                <Grid>
                                    {this.renderAddComment(options)}
                                </Grid>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </div>
            </Styled>
        )
    }
}

const mapStateToProps = ({ translateArticle }) => ({
    currentSlideIndex: translateArticle.currentSlideIndex,
    currentSubslideIndex: translateArticle.currentSubslideIndex,
    listIndex: translateArticle.listIndex,
    addCommentLoading: translateArticle.addCommentLoading,
    translatableArticle: translateArticle.translatableArticle,
    comments: translateArticle.comments,
    subslides: translateArticle.subslides,
    commentsSlidesIndexes: translateArticle.commentsSlidesIndexes,
    addCommentSlideIndex: translateArticle.addCommentSlideIndex,
    user: translateArticle.user,
})

const mapDispatchToProps = (dispatch) => ({
    fetchComments: (params) => dispatch(translationActions.fetchComments(params)),
    addComment: (slidePosition, subslidePosition, content) => dispatch(translationActions.addComment(slidePosition, subslidePosition, content)),
    setListIndex: index => dispatch(translationActions.setListIndex(index)),
    setCommentsSlidesIndexes: indexes => dispatch(translationActions.setCommentsSlidesIndexes(indexes)),
    setAddCommentSlideIndex: index => dispatch(translationActions.setAddCommentSlideIndex(index)),

})

export default connect(mapStateToProps, mapDispatchToProps)(CommentsSidebar);