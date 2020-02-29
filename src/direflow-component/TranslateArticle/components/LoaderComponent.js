import React from 'react';

import { Loader } from 'semantic-ui-react';

export default class LoadingComponent extends React.Component {

    render() {

        return (
            this.props.active ? <Loader active/> : this.props.children
        )
    }
}