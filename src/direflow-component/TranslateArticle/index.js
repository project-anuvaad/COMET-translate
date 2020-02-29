import React from 'react';
import { connect } from 'react-redux';
import { fetchUserData, fetchOrganizationData } from './modules/actions';

import TranslateArticle from './TranslateArticle';

class TranslateArticleIndex extends React.Component {

    componentWillMount = () => {

        this.props.fetchUserData();
        this.props.fetchOrganizationData(this.props.apiKey);
    }

    render() {
        const { user, organization } = this.props;
        if (!user || !organization) return null;

        return (
            <div style={{ backgroundColor: '#ecf5fe', minHeight: '100%' }}>
                <TranslateArticle
                    {...this.props}
                />
            </div>
        )
    }
}

const mapStateToProps = ({ translateArticle }) => ({
    user: translateArticle.user,
    organizationUsers: translateArticle.organizationUsers,
    organization: translateArticle.organization,
})

const mapDispatchToProps = (dispatch) => ({ 
    fetchUserData: () => dispatch(fetchUserData()),
    fetchOrganizationData: (apiKey) => dispatch(fetchOrganizationData(apiKey))
})

export default connect(mapStateToProps, mapDispatchToProps)(TranslateArticleIndex);