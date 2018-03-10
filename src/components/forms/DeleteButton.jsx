import React from 'react';
import Locale from 'locale/LocaleFactory';
import { Popconfirm, Button } from 'antd';

export default class DeleteButton extends React.Component {

    render() {
        const {onDelete, shape, className} = this.props;
        return (
                <Popconfirm title={Locale.trans('delete.confirm')} onConfirm={ onDelete } okText={Locale.Popconfirm.okText} cancelText={Locale.Popconfirm.cancelText}>
                    {shape == 'circle' ? <Button type="danger" shape="circle" icon="delete" className={className} /> :
                    <Button type="danger" className={className}>
                        {Locale.trans('delete')}
                    </Button>}
                </Popconfirm>
            );
    }
}
