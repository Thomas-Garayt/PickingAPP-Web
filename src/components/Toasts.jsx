// @flow

import React from 'react';
import { notification } from 'antd';

import ToastStore from 'stores/ToastStore';

type State = {
    toasts: Array<Toast>
}

export default class Toasts extends React.Component<void, void, State> {
    state: State

    constructor() {
        super();
        this.state = {
            toasts: ToastStore.getAll()
        };
    }

    componentWillMount(): void {
        ToastStore.addChangeListener(this.getToasts);
    }

    componentWillUnmount(): void {
        ToastStore.removeChangeListener(this.getToasts);
    }

    componentDidUpdate(): void {
        this.state.toasts.map((toast: Toast): void => {
            notification[toast.type]({
                message: toast.message,
                description: toast.description,
            });
        });
    }

    getToasts = (): void => {
        this.setState({
            toasts: ToastStore.getAll()
        });
    }

    render() {
        return null;
    }
}
