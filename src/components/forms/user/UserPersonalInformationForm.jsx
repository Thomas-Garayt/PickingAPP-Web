import React from 'react';
import {Form, Icon, Button, Row, Col} from 'antd';
import {InputItem, CheckboxItem, SelectItem, DatePickerItem} from 'components/forms/FormItems';
import DeleteButton from 'components/forms/DeleteButton.jsx';
import Locale from 'locale/LocaleFactory';
import FormBase from 'components/forms/FormBase.jsx';
import FormWrapperBase from 'components/forms/FormWrapperBase.jsx';

import DateConstants from 'constants/DateConstants';

export default class UserPersonalInformationForm extends FormWrapperBase {
    constructor(props) {
        super();
        this.state = {
            entity: props.userPersonalInfo,
            formClass: UserPersonalInformationFormContent
        };
    }
}

class UserPersonalInformationFormContent extends FormBase {
    componentDidMount() {
        // To disabled submit button at the beginning.
        this.props.form.validateFields();
    }

    handleSubmit = () => {
        const {form, onSubmit} = this.props;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }

            const personalInfo = this.getUserPersonalInfoFromValues(values);

            onSubmit(personalInfo);
        });
    }

    getUserPersonalInfoFromValues = (values) => {
        var contract = {};
        for (var k in values) {
            if (values.hasOwnProperty(k)) {

                if(k == 'drivingLicenseDate-picker'){
                    contract.drivingLicenseDate = values[k]
                        ? values[k].format(DateConstants.API_DATE_FORMAT)
                        : null;
                }else{
                    contract[k] = values[k];
                }
                
            }
        }
        return contract;
    }

    render() {
        const {getFieldValue} = this.props.form;

        const familySituations = ['married', 'single'];

        return (
            <Form hideRequiredMark>
                <div className="full-size-form">
                    <div className="form-content">
                        <Row gutter={8}>
                            <Col span={8}>
                                <InputItem id="personalPhoneNumber" label={Locale.trans('user.personalPhoneNumber')} rules={[{
                                        type: 'string',
                                        pattern: /^(0|\+33)[1-9]([-. ]?[0-9]{2}){4}$/,
                                        message: Locale.trans('error.phone.invalid')
                                    }
                                ]} form={this.props.form}/>
                            </Col>
                            <Col span={8}>
                                <InputItem id="personalEmailAddress" label={Locale.trans('user.personalEmailAddress')} rules={[{
                                        type: 'email',
                                        message: Locale.trans('error.email.invalid')
                                    }
                                ]} form={this.props.form}/>
                            </Col>
                            <Col span={8}></Col>
                        </Row>

                        <Row gutter={8}>
                            <Col span={8}>
                                <SelectItem id="familySituation" label={Locale.trans('user.familySituation')} options={familySituations.map(s => ({
                                    value: s,
                                    label: Locale.trans('user.familySituations.' + s)
                                }))} form={this.props.form}/>
                            </Col>
                            <Col span={8}>
                                <InputItem id="countDependantChildren" label={Locale.trans('user.countDependantChildren')} form={this.props.form}/>
                            </Col>
                            <Col span={8}></Col>
                        </Row>

                        <Row gutter={8}>
                            <Col span={8}>
                                <DatePickerItem id="drivingLicenseDate-picker" label={Locale.trans('user.drivingLicenseDate')} initialValue={getFieldValue('drivingLicenseDate')} form={this.props.form}/>
                            </Col>
                            <Col span={8}></Col>
                            <Col span={8}></Col>
                        </Row>

                        <Row gutter={8}>
                            <Col span={8}>
                                <InputItem id="iban" label={Locale.trans('user.iban')} form={this.props.form}/>
                            </Col>
                            <Col span={8}>
                                <InputItem id="lastDiploma" label={Locale.trans('user.lastDiploma')} form={this.props.form}/>
                            </Col>
                            <Col span={8}></Col>
                        </Row>

                        <Row gutter={8}>
                            <Col span={8}>
                                <InputItem id="emergencyContact" label={Locale.trans('user.emergencyContact')} form={this.props.form}/>
                            </Col>
                            <Col span={8}>
                                <InputItem id="emergencyContactPhoneNumber" label={Locale.trans('user.emergencyContactPhoneNumber')} rules={[{
                                        type: 'string',
                                        pattern: /^(0|\+33)[1-9]([-. ]?[0-9]{2}){4}$/,
                                        message: Locale.trans('error.phone.invalid')
                                    }
                                ]} form={this.props.form}/>
                            </Col>
                            <Col span={8}></Col>
                        </Row>
                    </div>
                    <div className="form-action-barre">
                        {this.props.onSubmit
                            ? (
                                <Button type="primary" onClick={this.handleSubmit} disabled={this.hasErrors()}>
                                    {Locale.trans('save')}
                                </Button>
                            )
                            : null}
                        &nbsp; {this.props.onDelete
                            ? <DeleteButton onDelete={this.props.onDelete}/>
                            : null}
                    </div>
                </div>
            </Form>
        );
    }
}
