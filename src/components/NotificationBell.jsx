// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import { Badge, Icon } from 'antd';

/**
 * A notification bell that display a list of notifications.
 * Just a simple icon with a counter with the number of notifications are displayed.
 * When clicking on the icon, the full list of notifications is displayed.
 */
type Props = {
    notifications: Array<Notification>,
    className: string,
    onRemoveNotification?: ()=>void,
    onNotificationClicked?: ()=>void
}
type State = {
    isExpanded: boolean,

    shouldHandleNextNotificationClick: boolean
}
export default class NotificationBell extends React.Component<void, Props, State> {
    state: State

    constructor() {
        super();
        this.state = {
            isExpanded: false,
            shouldHandleNextNotificationClick: true
        };
    }

    componentDidMount(): void {
        window.addEventListener('click', this.handleWindowClick)
    }

    componentWillUnmount(): void {
        window.removeEventListener('click', this.handleWindowClick)
    }

    handleWindowClick = (evt: MouseEvent): void => {
        if(!this.state.isExpanded) {
            return;
        }

        const area = ReactDOM.findDOMNode(this.refs['notifications-list']);
        // $FlowFixMe
        if (area && !area.contains(evt.target)) {
            this.collapseNotifications();
        }
    }

    collapseNotifications = (): void => {
        this.setState({isExpanded: false });
    }
    toggleNotifications = (): void => {
        this.setState({isExpanded: !this.state.isExpanded });
    }

    removeNotification = (extra: Object): void => {
        const {onRemoveNotification} = this.props;
        this.state.shouldHandleNextNotificationClick = false;
        if(onRemoveNotification) {
            onRemoveNotification(extra.resourceId);
        }
    }

    handleNotificationClick = (type: string, extra: Object): void => {
        if(!this.state.shouldHandleNextNotificationClick) {
            this.state.shouldHandleNextNotificationClick = true;
            return;
        }
        const {onNotificationClicked} = this.props;
        if(onNotificationClicked) {
            onNotificationClicked(type,extra);
        }
    }

    render() {
        const {notifications, className, onRemoveNotification} = this.props;

        var notificationsEl = null;
        if(this.state.isExpanded) {
            notificationsEl = (
                    <ul className="notifications">
                        {notifications.map(n =>
                            <li key={n.id} className="notification" onClick={()=>{this.handleNotificationClick(n.type,n.extra)}}>
                                <div className="notification-icons">
                                    { onRemoveNotification ? n.type == "Reminder" ? <Icon type="close" onClick={()=>{this.removeNotification(n.extra)}}/> : null : null }
                                </div>
                                <div className="notification-title">{n.title}</div>
                                { n.content ? <div className="notification-content">{n.content}</div> : null }
                            </li>
                        )}
                    </ul>
                );
        }
        return (
                <div className={(className ? className : '') + " notification-bell"} ref='notifications-list'>
                    <div className="notification-button">
                        <Badge count={notifications.length} overflowCount={10}>
                            <a href="#" onClick={this.toggleNotifications}><Icon type="notification" /></a>
                        </Badge>
                    </div>
                    { notificationsEl }
                </div>
            );
    }
}
