import React from 'react';
import Locale from 'locale/LocaleFactory';
import { Form, Icon, Row, Col } from 'antd';
import { Select } from 'components/FormFields';

class AdvancedSearchForm extends React.Component {

    generateSelectField = (id, label, options, multiple) => {
        const { getFieldDecorator } = this.props.form;

        return getFieldDecorator(id)(<Select multiple={multiple} allowClear options={options} />);
    }

    generateFieldByFilterDef = (filterDef) => {
        var field = null;
        switch(filterDef.type){
            case 'choices':
                field = this.generateSelectField(filterDef.id, filterDef.label, filterDef.options, true);
                break;
            case 'choice':
                field = this.generateSelectField(filterDef.id, filterDef.label, filterDef.options, false);
                break;
            case 'text':
                // TODO
                break;
            default:
                // Do Nothing
        }

        return (
                <Col span={8} key={filterDef.id}>
                    <Form.Item label={filterDef.label} >
                        {field}
                    </Form.Item>
                </Col>);
    }

    render() {
        const {filterDefs} = this.props;
        return (
            <Form className="ant-advanced-search-form">
                <Row gutter={8}>
                    {filterDefs.map(def => this.generateFieldByFilterDef(def))}
                </Row>
            </Form>
        );
    }
}

export default class AdvancedSearch extends React.Component {
    constructor() {
        super();
        this.state = {
            isExpanded: false
        };
    }

    handleAdvancedSearchChange = (props, values) => {
        this.props.onFiltersChange(values);
    }

    filterDefsToFormFields = (filterDefs) => {
        var fields = {};
        for(var i=0; i<filterDefs.length; i++){
           const def = filterDefs[i];
           fields[def.id] = Form.createFormField({value: def.value});
        }
        return fields;
    }

    toggleAdvancedSearch = () => {
        const {onExpandeChange} = this.props;
        const isExpanded = !this.state.isExpanded;
        this.setState({isExpanded});

        if(onExpandeChange){
            onExpandeChange(isExpanded);
        }
    }

    render() {
        const {filterDefs} = this.props;

        if(this.state.isExpanded){
            const advancedSearchFields = this.filterDefsToFormFields(filterDefs);
            const WrappedAdvancedSearchForm = Form.create({onValuesChange: this.handleAdvancedSearchChange, mapPropsToFields: () => advancedSearchFields})(AdvancedSearchForm);

            return (
                <div>
                    <Row>
                        <Col span={24}>
                            <a style={{ fontSize: 12 }} onClick={this.toggleAdvancedSearch}>
                                <span>{Locale.trans('advancedSearch.hide')} <Icon type='up' /></span>
                            </a>
                        </Col>
                    </Row>
                    <WrappedAdvancedSearchForm filterDefs={filterDefs} />
                </div>);

        }else{
            return (
                <div>
                    <Row>
                        <Col span={24}>
                            <a style={{ fontSize: 12 }} onClick={this.toggleAdvancedSearch}>
                                <span>{Locale.trans('advancedSearch.show')} <Icon type='down' /></span>
                            </a>
                        </Col>
                    </Row>
                </div>);
        }
    }
}
