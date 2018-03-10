import React from "react";
import { Form, Icon, Button, Row, Col, Spin } from "antd";

import FormItem from "components/forms/FormItems";

import DeleteButton from "components/forms/DeleteButton.jsx";
import Label from "components/forms/Label.jsx";
import Locale from "locale/LocaleFactory";
import FormBase from "components/forms/FormBase.jsx";
import FormWrapperBase from "components/forms/FormWrapperBase.jsx";

class CompanyFormContent extends FormBase {
    constructor() {
        super();
        this.state = {
            loading: false,
            deletedAddresses: [],
            countNewAddresses: 0,
            deletedSocialNetworks: [],
            countNewSocialNetworks: 0
        };
    }

    componentDidMount() {
        // To disabled submit button at the beginning.
        this.props.form.validateFields();
    }

    // Addresses
    addAddress = () => {
        const { form } = this.props;

        this.state.countNewAddresses++;
        const id = `newAddress-${this.state.countNewAddresses}`;

        const addressIds = form.getFieldValue("addressesId");
        const nextAddressesId = addressIds.concat(id);
        form.setFieldsValue({
            addressesId: nextAddressesId
        });
        form.validateFields();
    };

    removeAddress = addressId => {
        const { form } = this.props;
        const addressIds = form.getFieldValue("addressesId");
        form.setFieldsValue({
            addressesId: addressIds.filter(a => a !== addressId)
        });

        // If the identifier is not an existing one,
        // we add the address to the list of addresses to delete.
        if (Number.isInteger(addressId)) {
            const deleteAddress = this.getAddress(addressId);
            this.state.deletedAddresses.push(deleteAddress);
        }

        form.validateFields();
    };

    getAddresses = () => {
        const { getFieldValue } = this.props.form;
        return getFieldValue("addresses") || [];
    };

    getAddress = id => this.getAddresses().find(a => a.id === id);

    // Social networks
    addSocialNetworks = () => {
        const { form } = this.props;

        this.state.countNewSocialNetworks++;
        const id = `newSocialnetwork-${this.state.countNewSocialNetworks}`;

        const socialnetworksIds = form.getFieldValue("socialnetworksId");
        const nextSocialNetworksId = socialnetworksIds.concat(id);
        form.setFieldsValue({
            socialnetworksId: nextSocialNetworksId
        });
        form.validateFields();
    };

    removeSocialNetworks = socialnetworkId => {
        const { form } = this.props;
        const socialnetworksIds = form.getFieldValue("socialnetworksId");

        form.setFieldsValue({
            socialnetworksId: socialnetworksIds.filter(
                a => a !== socialnetworkId
            )
        });

        // If the identifier is not an existing one,
        // we add the address to the list of addresses to delete.
        if (Number.isInteger(socialnetworkId)) {
            const deleteSocialNetworks = this.getSocialNetwork(socialnetworkId);
            this.state.deletedSocialNetworks.push(deleteSocialNetworks);
        }

        form.validateFields();
    };

    getSocialNetworks = () => {
        const { getFieldValue } = this.props.form;
        return getFieldValue("socialnetworks") || [];
    };

    getSocialNetwork = id => this.getSocialNetworks().find(a => a.id === id);

    handleSubmit = () => {
        this.setState({
            loading: true
        });

        const { form } = this.props;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }

            const company = this.getCompanyFromValues(values);
            const addresses = {
                created: this.getNewAddressesFromValues(values),
                edited: this.getEditedAddressesFromValues(values),
                deleted: this.state.deletedAddresses
            };

            const socialnetworks = {
                created: this.getNewSocialNetworksFromValues(values),
                edited: this.getEditedSocialNetworksFromValues(values),
                deleted: this.state.deletedSocialNetworks
            };

            const allGroups = this.props.groups;
            const initialGroupsId = this.props.company
                ? this.props.company.groups.map(g => g.id.toString())
                : [];
            const groupsId = values.groupsId;

            const groups = {
                // We allow to create new groups directly.
                // If the new "id" isn't an existing one, it means that it's a new group.
                created: groupsId
                    .filter(id => initialGroupsId.indexOf(id) < 0)
                    .map(id => {
                        const group = allGroups.find(g => g.id == id);
                        return group ? { id: group.id } : { name: id };
                    }),
                deleted: initialGroupsId
                    .filter(id => groupsId.indexOf(id) < 0)
                    .map(id => allGroups.find(g => g.id == id))
            };

            this.props.onSubmit(company, addresses, groups, socialnetworks);

            /* Reset the deleted state */
            this.setState({
                deletedAddresses: [],
                deletedSocialNetworks: []
            });

            this.setState({
                loading: false
            });
        });
    };

    getCompanyFromValues = values => {
        const company = {};
        for (const k in values) {
            if (
                !k.startsWith("addresses") &&
                !k.startsWith("groupsId") &&
                !k.startsWith("socialnetworks")
            ) {
                company[k] = values[k];
            }
        }
        return company;
    };

    getNewAddressesFromValues = values => {
        const newAddresses = [];
        for (const k in values) {
            if (!k.startsWith("addresses-new")) {
                continue;
            }

            const splitKey = k.split("-");
            if (splitKey.length === 4) {
                const id = splitKey[2];
                const fieldName = splitKey[3];

                if (!newAddresses[id]) {
                    newAddresses[id] = {};
                }
                newAddresses[id][fieldName] = values[k];
            }
        }
        return newAddresses;
    };

    getEditedAddressesFromValues = values => {
        const editedAddresses = [];
        for (const k in values) {
            if (!k.startsWith("addresses-")) {
                continue;
            }

            const splitKey = k.split("-");
            if (splitKey.length === 3) {
                const id = parseInt(splitKey[1], 10);
                const fieldName = splitKey[2];

                if (!editedAddresses[id]) {
                    editedAddresses[id] = { id };
                }
                editedAddresses[id][fieldName] = values[k];
            }
        }
        return editedAddresses;
    };

    getNewSocialNetworksFromValues = values => {
        const newSocialNetworks = [];
        for (const k in values) {
            if (!k.startsWith("socialnetworks-new")) {
                continue;
            }

            const splitKey = k.split("-");
            if (splitKey.length === 4) {
                const id = splitKey[2];
                const fieldName = splitKey[3];

                if (!newSocialNetworks[id]) {
                    newSocialNetworks[id] = {};
                }
                newSocialNetworks[id][fieldName] = values[k];
            }
        }

        return newSocialNetworks;
    };

    getEditedSocialNetworksFromValues = values => {
        const editedSocialnetworks = [];
        for (const k in values) {
            if (!k.startsWith("socialnetworks-")) {
                continue;
            }

            const splitKey = k.split("-");
            if (splitKey.length === 3) {
                const id = parseInt(splitKey[1], 10);
                const fieldName = splitKey[2];

                if (!editedSocialnetworks[id]) {
                    editedSocialnetworks[id] = { id };
                }
                editedSocialnetworks[id][fieldName] = values[k];
            }
        }
        return editedSocialnetworks;
    };

    render() {
        const { groups } = this.props;
        const { getFieldDecorator, getFieldValue } = this.props.form;

        // Addresses
        getFieldDecorator("addressesId", {
            initialValue: this.getAddresses().map(p => p.id)
        });
        const addressesId = getFieldValue("addressesId");
        const addressesFormItems = addressesId.map(id => {
            const address = this.getAddress(id);

            const name = `addresses-${id}-name`;
            const phone = `addresses-${id}-phone`;
            const fax = `addresses-${id}-fax`;
            const street = `addresses-${id}-street`;
            const postalCode = `addresses-${id}-postalCode`;
            const city = `addresses-${id}-city`;
            const country = `addresses-${id}-country`;
            const siret = `addresses-${id}-siret`;
            const isHeadquarters = `addresses-${id}-isHeadquarters`;
            const isBilling = `addresses-${id}-isBilling`;

            return (
                <div
                    className="ant-row ant-form-item inline-form-group"
                    style={{marginBottom: '32px'}}
                    key={id}
                >
                    <Row>
                        <Col span={24}>
                            <FormItem.Checkbox
                                id={isHeadquarters}
                                initialValue={address && address.isHeadquarters}
                                label={Locale.trans(
                                    "company.address.isHeadquarters"
                                )}
                                wrapperCol={{ span: 12 }}
                                form={this.props.form}
                            />
                            <FormItem.Checkbox
                                id={isBilling}
                                initialValue={address && address.isBilling}
                                label={Locale.trans(
                                    "company.address.isBilling"
                                )}
                                className="isBilling-checkbox"
                                wrapperCol={{ span: 12 }}
                                form={this.props.form}
                            />
                            <Button
                                className="delete-button"
                                shape="circle"
                                icon="delete"
                                size="small"
                                type="danger"
                                onClick={() => this.removeAddress(id)}
                            />

                            <FormItem.Input
                                id={name}
                                initialValue={address ? address.name : ""}
                                required
                                placeholder={Locale.trans(
                                    "company.address.name"
                                )}
                                wrapperCol={{ span: 24 }}
                                form={this.props.form}
                            />
                            <FormItem.Input
                                id={siret}
                                initialValue={address ? address.siret : ""}
                                required
                                addonBefore={getFieldValue("siren")}
                                placeholder={Locale.trans(
                                    "company.address.siret"
                                )}
                                wrapperCol={{ span: 24 }}
                                form={this.props.form}
                            />
                            <FormItem.Input
                                id={street}
                                initialValue={address ? address.street : ""}
                                required
                                type="textarea"
                                autosize={{ minRows: 1, maxRows: 5 }}
                                placeholder={Locale.trans(
                                    "company.address.street"
                                )}
                                wrapperCol={{ span: 24 }}
                                form={this.props.form}
                            />
                            <FormItem.Input
                                id={city}
                                initialValue={address ? address.city : ""}
                                required
                                placeholder={Locale.trans(
                                    "company.address.city"
                                )}
                                wrapperCol={{ span: 24 }}
                                form={this.props.form}
                            />
                            <FormItem.Input
                                id={postalCode}
                                initialValue={address ? address.postalCode : ""}
                                required
                                placeholder={Locale.trans(
                                    "company.address.postalCode"
                                )}
                                wrapperCol={{ span: 24 }}
                                form={this.props.form}
                            />
                            <FormItem.Input
                                id={country}
                                initialValue={
                                    address ? address.country : "FRANCE"
                                }
                                required
                                placeholder={Locale.trans(
                                    "company.address.country"
                                )}
                                wrapperCol={{ span: 24 }}
                                form={this.props.form}
                            />
                        </Col>
                    </Row>
                    <Row gutter={8}>
                        <Col span={12}>
                            <FormItem.Input
                                id={phone}
                                initialValue={address ? address.phone : ""}
                                rules={[
                                    {
                                        type: "string",
                                        pattern: /^(0|\+33)[1-9]([-. ]?[0-9]{2}){4}$/,
                                        message: Locale.trans("error.phone.invalid")
                                    }
                                ]}
                                label={Locale.trans("company.phone")}
                                form={this.props.form}
                            />
                        </Col>
                        <Col span={12}>
                            <FormItem.Input
                                id={fax}
                                initialValue={address ? address.fax : ""}
                                rules={[
                                    {
                                        type: "string",
                                        pattern: /^(0|\+33)[1-9]([-. ]?[0-9]{2}){4}$/,
                                        message: Locale.trans("error.fax.invalid")
                                    }
                                ]}
                                label={Locale.trans("company.fax")}
                                form={this.props.form}
                            />
                        </Col>
                    </Row>
                </div>
            );
        });
        const addAddressButton = (
            <Form.Item>
                <Button onClick={() => this.addAddress()}>
                    <Icon type="plus" />{" "}
                    {Locale.trans("company.addAddress.button")}
                </Button>
            </Form.Item>
        );

        // Socialnetworks
        getFieldDecorator("socialnetworksId", {
            initialValue: this.getSocialNetworks().map(p => p.id)
        });
        const socialnetworksId = getFieldValue("socialnetworksId");
        const socialnetworksFormItems = socialnetworksId.map(id => {
            const socialnetwork = this.getSocialNetwork(id);

            const type = `socialnetworks-${id}-type`;
            const url = `socialnetworks-${id}-url`;

            return (
                <div
                    className="ant-row ant-form-item inline-form-group with-delete-button"
                    key={id}
                >
                    <Row>
                        <Col span={24}>
                            <FormItem.Select
                                id={type}
                                initialValue={
                                    socialnetwork ? socialnetwork.type : ""
                                }
                                options={[
                                    {
                                        value: "facebook",
                                        label: Locale.trans("facebook")
                                    },
                                    {
                                        value: "twitter",
                                        label: Locale.trans("twitter")
                                    },
                                    {
                                        value: "linkedin",
                                        label: Locale.trans("linkedin")
                                    }
                                ]}
                                required
                                wrapperCol={{ span: 24 }}
                                form={this.props.form}
                            />

                            <FormItem.Input
                                id={url}
                                initialValue={
                                    socialnetwork ? socialnetwork.url : ""
                                }
                                required
                                placeholder={Locale.trans(
                                    "company.socialnetwork.url"
                                )}
                                wrapperCol={{ span: 24 }}
                                form={this.props.form}
                            />
                        </Col>
                        <Button
                            className="delete-button"
                            shape="circle"
                            icon="delete"
                            size="small"
                            type="danger"
                            onClick={() => this.removeSocialNetworks(id)}
                        />
                    </Row>
                </div>
            );
        });
        const addSocialnetworkButton = (
            <Form.Item>
                <Button onClick={() => this.addSocialNetworks()}>
                    <Icon type="plus" />{" "}
                    {Locale.trans("company.addSocialnetwork.button")}
                </Button>
            </Form.Item>
        );

        const siren = getFieldValue("siren");
        return (
            <Form hideRequiredMark>
                <div className="full-size-form company-form">
                    <div className="form-content">
                        <FormItem.Input
                            id="name"
                            required
                            label={Locale.trans("company.name")}
                            form={this.props.form}
                        />

                        <FormItem.Input
                            id="siren"
                            required
                            label={Locale.trans("company.siren")}
                            form={this.props.form}
                        />

                        <FormItem.Input
                            id="apeCode"
                            required
                            label={Locale.trans("company.apeCode")}
                            form={this.props.form}
                        />

                        <FormItem.Input
                            id="apeLabel"
                            required
                            placeholder={Locale.trans("company.apeLabel")}
                            form={this.props.form}
                        />

                        <FormItem.Input
                            id="website"
                            label={Locale.trans("company.website")}
                            form={this.props.form}
                        />

                        <FormItem.Checkbox
                            id="isClient"
                            label={Locale.trans("company.isClient")}
                            form={this.props.form}
                        />

                        <FormItem.Checkbox
                            id="isSupplier"
                            label={Locale.trans("company.isSupplier")}
                            form={this.props.form}
                        />

                        <Label>{Locale.trans("company.address")}</Label>
                        {addressesId.length > 0 ? (
                            <Button
                                className="add-button pull-right"
                                shape="circle"
                                icon="plus"
                                size="small"
                                onClick={() => this.addAddress()}
                            />
                        ) : null}
                        {addressesId.length > 0
                            ? addressesFormItems
                            : addAddressButton}
                        <Label>{Locale.trans("company.socialnetwork")}</Label>
                        {socialnetworksId.length > 0 ? (
                            <Button
                                className="add-button pull-right"
                                shape="circle"
                                icon="plus"
                                size="small"
                                onClick={() => this.addSocialNetworks()}
                            />
                        ) : null}
                        {socialnetworksId.length > 0
                            ? socialnetworksFormItems
                            : addSocialnetworkButton}

                        <FormItem.Select
                            id="groupsId"
                            tags
                            label={Locale.trans("company.groups")}
                            placeholder={Locale.trans(
                                "company.groups.placeholder"
                            )}
                            initialValue={(getFieldValue("groups") || []).map(
                                g => g.id.toString()
                            )}
                            options={groups.map(g => ({
                                value: g.id,
                                label: g.name
                            }))}
                            form={this.props.form}
                        />
                    </div>
                    <div className="form-action-barre">
                        {this.props.onSubmit ? (
                            <Button
                                type="primary"
                                onClick={this.handleSubmit}
                                disabled={this.hasErrors()}
                                loading={this.state.loading}
                            >
                                {Locale.trans("save")}
                            </Button>
                        ) : null}
                        &nbsp;
                        {this.props.onDelete ? (
                            <DeleteButton onDelete={this.props.onDelete} />
                        ) : null}
                        &nbsp;
                        {siren && siren.length > 0 ? (
                            <a
                                className="ant-btn"
                                href={
                                    "https://www.infogreffe.fr/infogreffe/ficheIdentite.do?siren=" +
                                    siren.replace(/\s/g, "")
                                }
                                target="_blank"
                            >
                                Fiche Infogreffe
                            </a>
                        ) : null}
                    </div>
                </div>
            </Form>
        );
    }
}

export default class CompanyForm extends FormWrapperBase {
    constructor(props) {
        super();
        this.state = {
            entity: props.company,
            formClass: CompanyFormContent
        };
    }
}
