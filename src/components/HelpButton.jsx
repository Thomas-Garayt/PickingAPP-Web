// @flow

import React from 'react';

import { Button, Popover } from 'antd';

type Props = {
    title: string | React.Component<*>,
    content: string | React.Component<*>,
    className: string,
    style: Object
}

/**
 * A small help button that leads to a pop-up with more or less detailed documentation for a specific part of the application.
 */
export default class HelpButton extends React.Component<void, Props, void> {
    render() {
        const {content, title, className, style} = this.props;
        return (
            <Popover content={content} title={title} trigger="click">
                <Button className={className} type="info" shape="circle" icon="question" size="small" style={style} />
            </Popover>
        );
    }
}
