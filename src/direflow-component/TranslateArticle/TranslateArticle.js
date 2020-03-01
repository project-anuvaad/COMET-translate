import React from 'react';
import { connect } from 'react-redux';
import { Button, Icon, Popup, Grid } from 'semantic-ui-react';

import Workstation from './TabsContent/Workstation';
import ExportHistory from './TabsContent/ExportHistory';

import { setActiveTabIndex } from './modules/actions';

import Tabs from './components/Tabs';
import Subtitles from './TabsContent/Subtitles';

import styles from './style.scss';

import { Styled } from 'direflow-component'

class TranslateArticle extends React.Component {

    componentWillUnmount = () => {
        this.props.setActiveTabIndex(0);
    }

    renderTabContent = () => {
        let comp;
        const { articleId } = this.props;

        switch (this.props.activeTabIndex) {
            case 0:
                comp = <Workstation articleId={articleId} />; break;
            case 1:
                comp = <Subtitles articleId={articleId} />; break;
            case 2:
                comp = <ExportHistory articleId={articleId} />; break;
            default:
                comp = <Workstation articleId={articleId} />; break;
        }
        return (
            <div style={{ width: '100%', marginTop: '3rem' }}>
                {comp}
            </div>
        )
    }

    getTabItems = () => {
        const generateSubtitleTitle = (props = {}) => this.props.subtitles ? (
            <Button {...props}>
                Generate Subtitles
            </Button>
        ) : (
                <Popup
                    // wide="very"
                    flowing
                    position="top center"
                    trigger={
                        <Button
                            circular
                            {...props}
                        >
                            <Icon name="lock" /> Generate Subtitles
                    </Button>
                    }
                    content={
                        <Grid
                            style={{ width: 800, height: 500 }}
                        >
                            <Grid.Row>
                                <Grid.Column width={10}>
                                    <img src="/img/undraw_security_o890.png" width="100%" />
                                </Grid.Column>
                                <Grid.Column width={6} style={{ display: 'flex', alignItems: 'center' }}>
                                    <h2>
                                        You can generate subtitles only after the ADMIN approves your video
                                </h2>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    }
                />
            );
        return [{ title: 'Workstation' }, { render: generateSubtitleTitle }, { title: 'Export History' }];
    }

    render() {
        const items = this.getTabItems();
        return (
            <Styled styles={styles}>
                <div style={{ width: '100%', padding: '2rem', }}>
                    {this.props.translatableArticle && (
                        <a href={this.props.backRoute || 'javascript:void(0)'} onClick={() => this.props.backRoute ? null : window.history.back()}>
                            <Button
                                basic
                                circular
                                icon="arrow left"
                                size="large"
                                id="back-btn"
                            />
                        </a>
                    )}
                    <Tabs
                        items={items}
                        activeIndex={this.props.activeTabIndex}
                        onActiveIndexChange={val => {
                            if (val === 1 && !this.props.subtitles) {
                                return;
                            }
                            this.props.setActiveTabIndex(val)
                        }}
                    />
                    {this.renderTabContent()}
                </div>
            </Styled>
        )
    }
}

const mapStateToProps = ({ translateArticle }) => ({
    activeTabIndex: translateArticle.activeTabIndex,
    translatableArticle: translateArticle.translatableArticle,
    subtitles: translateArticle.subtitles,
})

const mapDispatchToProps = (dispatch) => ({
    setActiveTabIndex: index => dispatch(setActiveTabIndex(index)),
})

export default connect(mapStateToProps, mapDispatchToProps)(TranslateArticle);