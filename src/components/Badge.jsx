// @flow

import React from 'react';

type Props = {
    count: string | number,
};

export default class Badge extends React.PureComponent<void, Props, void> {
    render() {
        const { count } = this.props;
        return (
            <span className="ant-badge ant-badge-not-a-wrapper" title={count}>
                <sup className="ant-badge-count">
                    {count}
                </sup>
            </span>
        );
    }
}
