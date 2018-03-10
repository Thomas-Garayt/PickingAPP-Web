// @flow

import React from 'react';

type Props ={
    iconUrl: string,
    title: string,
    onOpenWindow: ()=>void
}

export default class DesktopIcon extends React.Component<void, Props, void> {
    render() {
        const {iconUrl, title, onOpenWindow} = this.props;

        const iconStyle = {
            backgroundImage: `url(${iconUrl})`
        };

        return (
            <div className="desktop-icon" onDoubleClick={onOpenWindow}>
                <div class="icon" style={iconStyle}></div>
                <div class="label">{title}</div>
            </div>
        );
    }
}
