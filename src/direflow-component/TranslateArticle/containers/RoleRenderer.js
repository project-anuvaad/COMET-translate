import React from 'react';
import {connect} from 'react-redux';
import { getUserOrganziationRole } from '../utils/helpers';

class RoleRenderer extends React.Component {

    canView = () => {
        if (!this.props.user || !this.props.user.organizationRoles) return false;
        const userRole = getUserOrganziationRole(this.props.user, this.props.organization);
        if (userRole && userRole.organizationOwner) {
            return true;
        } else if (userRole) {
            if (userRole && userRole.permissions.some(p => this.props.roles.indexOf(p) !== -1)) {
                return true;
            }
        }
        return false;
    }

    render() {
        if (this.canView()) {
            return this.props.children;
        } else if (this.props.message) {
            return <div>{this.props.message}</div>
        } else {
            return null;
        }
    }
}

const mapStateToProps = ({ translateArticle }) => ({
    user: translateArticle.user,
    organization: translateArticle.organization,
})
export default connect(mapStateToProps)(RoleRenderer);