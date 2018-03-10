import React from 'react';
import Locale from 'locale/LocaleFactory';

export default class Label extends React.Component {

    render() {
        const {children} = this.props;
        return (
                <div className="ant-form-item-label">
                    <label className="ant-form-item-required">
                        {children}
                    </label>
                </div>
            );
    }
}
