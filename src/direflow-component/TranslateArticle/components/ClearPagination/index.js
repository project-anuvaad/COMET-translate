import React from 'react';
import { Pagination, Icon } from 'semantic-ui-react'

import { withStyles } from 'direflow-component';
import styles from './style.scss';

class ClearPagination extends React.Component {
    render() {
        const {
            activePage,
            onPageChange,
            totalPages,
        } = this.props;

        return (
            <Pagination
                activePage={activePage}
                onPageChange={onPageChange}
                totalPages={totalPages}
                firstItem={null}
                // id="videos-pagination"
                className='clear-pagination'
                lastItem={null}
                prevItem={{ content: <div><Icon name='angle left' /> Previous</div> }}
                nextItem={{ content: <div>Next <Icon name='angle right' /></div> }}
            />
        )
    }
}

export default withStyles(styles)(ClearPagination)