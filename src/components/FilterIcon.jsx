// @flow

import React from 'react';

import { Icon } from 'antd';

type Props = {
    active: boolean,
    onClick?: ()=>void,
};

export default class FilterIcon extends React.PureComponent<void, Props, void> {
    render() {
        const { active, onClick } = this.props;
        return (
            <Icon
              type="filter"
              style={{
                  color: active ? '#108ee9' : '#aaa',
              }}
              onClick={onClick}
            />
        );
    }
}
