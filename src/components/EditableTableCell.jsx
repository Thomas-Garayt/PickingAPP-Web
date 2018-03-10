// @flow

import React from 'react';

import moment from 'moment';
import DateConstants from 'constants/DateConstants';
import DateService from 'services/utils/DateService';

import { Input, Tooltip } from 'antd';
import { Select, DatePicker, Checkbox } from 'components/FormFields';

type Props = {
    value: mixed,
    type: string,
    onChange: (value: mixed) => void,
    defaultValue?: mixed,
    renderDisplay?: (value: mixed) => void,
    options?: Array<{ label: string, value: mixed }>,
    disabled?: boolean,
    isFullyAbsenceDay?: boolean,
    style?: Object,
    fieldStyle?: Object,
    readOnly?: boolean,
    tooltip?: string | React.Element<*>,
};
type State = {
    isEditing: boolean,
    value: mixed,
};
export default class EditableTableCell extends React.Component<void, Props, State> {
    state: State;

    input: *;

    constructor(props: Props) {
        super();
        this.state = {
            isEditing: false,
            value: props.value,
        };
    }

    componentWillReceiveProps(props: Props): void {
        this.setState({ value: props.value });
    }

    componentDidUpdate(): void {
        if (this.input) {
            this.input.focus();
        }
    }

    showEditMode = (): void => {
        const { isEditing, value } = this.state;
        const { readOnly, defaultValue, type } = this.props;
        if (isEditing || readOnly) {
            return;
        }

        if (type === 'checkbox') {
            this.state.value = !value;
            this.submitChange();
        } else {
            this.setState({
                isEditing: true,
                value: value || defaultValue,
            });
        }
    };

    _handleChange = (event: Event): void => {
        // $FlowFixMe
        this.setState({ value: event.target.value });
    };

    _handleBlur = (): void => {
        this.submitChange();
    };

    submitChange(): void {
        this.props.onChange(this.state.value);
        this.setState({ isEditing: false });
    }

    _handleKeyPress = (e: Event): void => {
        if (e.key === 'Enter') {
            this.submitChange();
        }
    };

    _renderDisplay = (): mixed => {
        const { renderDisplay, type, tooltip } = this.props;
        const { value } = this.state;
        if (renderDisplay) {
            return renderDisplay(value);
        }

        let displayedElement = null;
        switch (type) {
        case 'date':
            displayedElement = value
                    ? moment(value, DateConstants.API_DATE_FORMAT).format(
                          DateConstants.DISPLAY_DATE_FORMAT,
                      )
                    : null;
            break;

        case 'list': {
            const option = this.props.options
                    ? this.props.options.find(o => o.value === value)
                    : null;
            displayedElement = option ? option.label : null;
            break;
        }
        case 'checkbox':
            displayedElement = value ? <Checkbox checked={value} /> : null;
            break;

        default:
            displayedElement = value;
        }

        if (tooltip) {
            return <Tooltip title={tooltip}>{displayedElement}</Tooltip>;
        }
        return displayedElement;
    };

    _renderFormField = (): React.Element<*> => {
        const { type } = this.props;
        const { value } = this.state;

        switch (type) {
        case 'date':
            return this._renderDatePicker(value);

        case 'list':
            return this._renderSelect(value);

        default:
            return this._renderInput(value);
        }
    };

    _renderSelect = (value: mixed): React.Element<*> => {
        const { options, fieldStyle } = this.props;

        function handleChange(v) {
            this.state.value = v;
            this.submitChange();
        }

        return (
            <Select
              style={fieldStyle}
              value={value}
              onChange={handleChange.bind(this)}
              onBlur={() => {
                  this.setState({ isEditing: false });
              }}
              options={options}
            />
        );
    };

    _renderDatePicker = (value: mixed): React.Element<*> => {
        const { fieldStyle } = this.props;

        const handleChange = (date) => {
            this.state.value = DateService.formatApi(date);
            this.submitChange();
        };
        const handleOpenChange = (open) => {
            if (!open) {
                this.setState({ isEditing: false });
            }
        };

        return (
            <DatePicker
              style={fieldStyle}
              value={value}
              onChange={handleChange}
              onOpenChange={handleOpenChange}
            />
        );
    };

    _renderInput = (value: mixed): React.Element<*> => {
        const { fieldStyle } = this.props;
        const defaultStyle = { width: '100%' };

        return (
            <Input
              style={{ ...defaultStyle, ...fieldStyle }}
              value={value}
              onChange={this._handleChange}
              onBlur={this._handleBlur}
              onFocus={(e) => {
                  e.target.select();
              }}
              onKeyPress={this._handleKeyPress}
              ref={n => (this.input = n)}
            />
        );
    };

    render() {
        const { disabled, isFullyAbsenceDay, style } = this.props;
        const { isEditing, value } = this.state;

        const defaultStyle = {
            padding: '4px 0',
        };

        return (
            <td
              className={`editable-cell${disabled ? ' disabled' : ''}${isFullyAbsenceDay
                    ? ' disabledConge'
                    : ''}`}
              onClick={this.showEditMode}
              style={{ ...defaultStyle, ...style }}
            >
                {isEditing ? this._renderFormField(value) : this._renderDisplay(value)}
            </td>
        );
    }
}
