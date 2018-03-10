// @flow

import React from 'react';
import { Form, Button, Row, Col } from 'antd';
import { InputItem, CheckboxItem, SelectItem, DatePickerItem } from 'components/forms/FormItems';
import DeleteButton from 'components/forms/DeleteButton.jsx';
import Locale from 'locale/LocaleFactory';
import FormBase from 'components/forms/FormBase.jsx';
import FormWrapperBase from 'components/forms/FormWrapperBase.jsx';

import DateConstants from 'constants/DateConstants';

class UserContractFormContent extends FormBase {
    componentDidMount() {
        // To disabled submit button at the beginning.
        this.props.form.validateFields();
    }

    handleSubmit = () => {
        const { form, onSubmit } = this.props;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }

            const contract = this.getUserContractFromValues(values);

            // Business Poles
            const allPoles = this.props.businessPoles;
            const initialPolesId =
                this.props.userContract && this.props.userContract.businessPoles
                    ? this.props.userContract.businessPoles.map(p => p.id.toString())
                    : [];
            const polesId = values.businessPolesId;

            const poles = {
                // We allow to create new groups directly.
                // If the new "id" isn't an existing one, it means that it's a new group.
                created: polesId.filter(id => initialPolesId.indexOf(id) < 0).map((id) => {
                    const pole = allPoles.find(g => g.id == id);
                    return pole ? { id: pole.id } : null;
                }),
                deleted: initialPolesId
                    .filter(id => polesId.indexOf(id) < 0)
                    .map(id => allPoles.find(p => p.id == id)),
            };

            onSubmit(contract, poles);
        });
    };

    getUserContractFromValues = (values) => {
        const contract = {};
        const keys = Object.keys(values);
        for (let i = 0; i < keys.length; i++) {
            const k = keys[i];

            switch (k) {
            case 'businessPolesId':
                // Ignore it
                break;
            case 'dateOfArrival-picker':
                contract.dateOfArrival = values[k]
                        ? values[k].format(DateConstants.API_DATE_FORMAT)
                        : null;
                break;
            case 'dateOfDeparture-picker':
                contract.dateOfDeparture = values[k]
                        ? values[k].format(DateConstants.API_DATE_FORMAT)
                        : null;
                break;
            case 'managerId':
                contract.manager = values[k];
                break;
            case 'contractTypeId':
                contract.contractType = values[k];
                break;
            case 'professionalCategoryId':
                contract.professionalCategory = values[k];
                break;
            case 'professionalFunctionId':
                contract.professionalFunction = values[k];
                break;
            default:
                contract[k] = values[k];
                break;
            }
        }
        return contract;
    };

    render() {
        const {
            businessPoles,
            contractTypes,
            professionalCategories,
            professionalFunctions,
            managers,
        } = this.props;
        const { getFieldValue } = this.props.form;

        return (
            <Form hideRequiredMark>
                <div className="full-size-form">
                    <div className="form-content">
                        <Row gutter={8}>
                            <Col span={8}>
                                <DatePickerItem
                                  id="dateOfArrival-picker"
                                  required
                                  label={Locale.trans('user.dateOfArrival')}
                                  initialValue={getFieldValue('dateOfArrival')}
                                  form={this.props.form}
                                />
                            </Col>
                            <Col span={8}>
                                <SelectItem
                                  id="contractTypeId"
                                  required
                                  label={Locale.trans('user.contractType')}
                                  initialValue={
                                        getFieldValue('contractType')
                                            ? getFieldValue('contractType').id.toString()
                                            : null
                                    }
                                  options={contractTypes.map(c => ({
                                      value: c.id,
                                      label: c.title,
                                  }))}
                                  form={this.props.form}
                                />
                            </Col>
                            <Col span={8}>
                                <DatePickerItem
                                  id="dateOfDeparture-picker"
                                  label={Locale.trans('user.dateOfDeparture')}
                                  initialValue={getFieldValue('dateOfDeparture')}
                                  form={this.props.form}
                                />
                            </Col>
                        </Row>

                        <Row gutter={8}>
                            <Col span={8}>
                                <InputItem
                                  id="contractDuration"
                                  label={Locale.trans('user.contractDuration')}
                                  form={this.props.form}
                                />
                            </Col>
                            <Col span={8}>
                                <InputItem
                                  id="noticeDuration"
                                  label={Locale.trans('user.noticeDuration')}
                                  form={this.props.form}
                                />
                            </Col>
                            <Col span={8}>
                                <InputItem
                                  id="noticeExtension"
                                  label={Locale.trans('user.noticeExtension')}
                                  form={this.props.form}
                                />
                            </Col>
                        </Row>

                        <Row gutter={8}>
                            <Col span={8}>
                                <SelectItem
                                  id="managerId"
                                  label={Locale.trans('user.manager')}
                                  initialValue={
                                        getFieldValue('manager')
                                            ? getFieldValue('manager').id.toString()
                                            : null
                                    }
                                  options={managers.map((m: User) => ({
                                      value: m.id,
                                      label: `${m.lastname} ${m.firstname}`,
                                  }))}
                                  form={this.props.form}
                                />
                            </Col>
                            <Col span={8}>
                                <SelectItem
                                  id="professionalCategoryId"
                                  required
                                  label={Locale.trans('user.professionalCategory')}
                                  initialValue={
                                        getFieldValue('professionalCategory')
                                            ? getFieldValue('professionalCategory').id.toString()
                                            : null
                                    }
                                  options={professionalCategories.map(c => ({
                                      value: c.id,
                                      label: c.title,
                                  }))}
                                  form={this.props.form}
                                />
                            </Col>
                            <Col span={8}>
                                <SelectItem
                                  id="professionalFunctionId"
                                  required
                                  label={Locale.trans('user.professionalFunction')}
                                  initialValue={
                                        getFieldValue('professionalFunction')
                                            ? getFieldValue('professionalFunction').id.toString()
                                            : null
                                    }
                                  options={professionalFunctions.map(c => ({
                                      value: c.id,
                                      label: c.title,
                                  }))}
                                  form={this.props.form}
                                />
                            </Col>
                        </Row>

                        <Row gutter={8}>
                            <Col span={8}>
                                <SelectItem
                                  id="businessPolesId"
                                  tags
                                  label={Locale.trans('user.businessPoles')}
                                  initialValue={(getFieldValue('businessPoles') || []).map(p =>
                                        p.id.toString(),
                                    )}
                                  options={businessPoles.map(p => ({
                                      value: p.id,
                                      label: p.name,
                                  }))}
                                  form={this.props.form}
                                />
                            </Col>
                            <Col span={8}>
                                <br />
                                <CheckboxItem
                                  id="isExposedToRadiation"
                                  label={Locale.trans('user.isExposedToRadiation')}
                                  form={this.props.form}
                                />
                            </Col>
                            <Col span={8} />
                        </Row>

                        <Row gutter={8}>
                            <Col span={8}>
                                <InputItem
                                  id="carnaxNumber"
                                  label={Locale.trans('user.carnaxNumber')}
                                  form={this.props.form}
                                />
                            </Col>
                            <Col span={8}>
                                <InputItem
                                  id="medicalCardNumber"
                                  label={Locale.trans('user.medicalCardNumber')}
                                  form={this.props.form}
                                />
                            </Col>
                            <Col span={8} />
                        </Row>
                    </div>
                    <div className="form-action-barre">
                        {this.props.onSubmit ? (
                            <Button
                              type="primary"
                              onClick={this.handleSubmit}
                              disabled={this.hasErrors()}
                            >
                                {Locale.trans('save')}
                            </Button>
                        ) : null}
                        &nbsp;
                        {this.props.onDelete ? (
                            <DeleteButton onDelete={this.props.onDelete} />
                        ) : null}
                    </div>
                </div>
            </Form>
        );
    }
}

export default class UserContractForm extends FormWrapperBase {
    constructor(props) {
        super();
        this.state = {
            entity: props.userContract,
            formClass: UserContractFormContent,
        };
    }
}
