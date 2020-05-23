import React from 'react';
import { getUserNamePreview } from '../../../utils/helpers';
import moment from 'moment';
import ReactAvatar from 'react-avatar';

export default class SlideCommentsCard extends React.Component {

    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.data && nextProps.data.comments && this.props.data && this.props.data.comments && this.props.data.comments !== nextProps.data.comments) {
            // this.scrollToBottom();
        }
    }

    render() {
        const { data } = this.props;
        return (
            <div>
                {data.comments.map((comment, index) => (
                    <div style={{ display: 'flex', alignItems: 'center', margin: '2rem', marginBottom: 0 }} key={`comment-item-${index}`}>
                        <div style={{ flex: 1 }}>
                            {comment.user ? (
                                <ReactAvatar
                                    round
                                    size={40}
                                    name={getUserNamePreview(comment.user)}
                                />
                            ) : (
                                <ReactAvatar
                                    round
                                    size={40}
                                    name={'V W'}
                                />
                            )}
                        </div>
                        <div
                            style={{ flex: 12, marginLeft: '2rem' }}
                        >
                            <small>Slide {data.index + 1}</small>
                            <p style={{ margin: 0 }}>
                                {comment.isWhatsappComment && comment.whatsappContactNumber ? `Whatsapp Contact: ${comment.whatsappContactNumber}` : ''}
                                {comment.user ? getUserNamePreview(comment.user) : ''}
                            </p>
                            <p style={{ backgroundColor: '#d4e0ed', color: '#666666', padding: '1rem', marginBottom: 0 }}>
                                {comment.content}
                            </p>
                            <p style={{ margin: 0 }}>
                                <small>{moment(comment.created_at).format('hh:mm:ss a DD MMM YYYY')}</small>
                            </p>
                        </div>
                    </div>
                ))}
                <div
                    style={{ float: "left", clear: "both" }}
                    ref={(el) => { this.messagesEnd = el; }}
                >
                </div>
            </div>
        )
    }
}