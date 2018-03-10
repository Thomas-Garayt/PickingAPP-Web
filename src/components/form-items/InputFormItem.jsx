import React from 'react';
import ReactDOM from 'react-dom';
import Locale from 'locale/LocaleFactory';
import FormItemBase from 'components/form-items/FormItemBase.jsx';
import ReactMarkdown from 'react-markdown';
import { Form, Input } from 'antd';

export default class InputFormItem extends FormItemBase {

    constructor() {
        super();
        this.state = {
            markdownVisible: true,
        };
    }

    componentDidUpdate(){
        const {
            type,
            autosize
        } = this.props;

        if(type === 'textarea') {
            const thisNode = ReactDOM.findDOMNode(this);
            for(let i=0; i<thisNode.children.length; i++) {
                const child = thisNode.children[i];
                if(child.className === 'form-field-markdown') {
                    child.removeEventListener('click', this.handleMarkdownClick);
                    child.addEventListener('click', this.handleMarkdownClick);
                    child.style = autosize ? `min-height: ${autosize.minRows}rem` : null;
                }
            }
        }
    }

    handleMarkdownClick = () => {
        this.setState(
            {
                markdownVisible: false,
            },
            () => {
                if (this.input) {
                    this.input.focus();
                }
            },
        );
    };

    handleInputBlur = () => {
        this.setState({
            markdownVisible: true,
        });
    };

    render() {
        const { id, initialValue, readOnly, markdown, className } = this.props;
        // Form.Item extra props
        const { label, labelCol, wrapperCol, extra, validateStatus, help } = this.props;
        // Input props
        const {
            type,
            placeholder,
            disabled,
            autosize,
            prefix,
            suffix,
            addonBefore,
            addonAfter,
            maxLength,
            onChange,
        } = this.props;

        let inputClassName = className;
        let md = null;
        if (type === 'textarea' && markdown && this.state.markdownVisible) {
            const value = this.props.form.getFieldValue(id);
            md = (
                <ReactMarkdown
                  className="form-field-markdown"
                  source={value || ''}
                  escapeHtml
                  containerProps={{
                      onClick: this.handleMarkdownClick,
                      style: autosize ? { minHeight: `${autosize.minRows}rem` } : null,
                  }}
                />
            );

            inputClassName += ' hidden';
        }

        if (type === 'textarea') {
            return (
                <div>
                    {this.renderTextAreaFormItem(inputClassName)}
                    {md}
                </div>
            );
        }
        return this.renderFormItem(inputClassName);
    }

    renderFormItem(inputClassName) {
        const { id, initialValue, readOnly } = this.props;
        // Form.Item extra props
        const { label, labelCol, wrapperCol, extra, validateStatus, help } = this.props;
        // Input props
        const {
            type,
            placeholder,
            disabled,
            prefix,
            suffix,
            addonBefore,
            addonAfter,
            maxLength,
            onChange,
        } = this.props;

        return (
            <Form.Item
              className={inputClassName}
              validateStatus={validateStatus || this.getValidateStatus(id)}
              help={help || this.getHelp(id)}
              hasFeedback
              label={label}
              labelCol={labelCol}
              wrapperCol={wrapperCol}
              extra={extra}
            >
                {this.getFieldDecorator(id, {
                    initialValue,
                    rules: this.getRules(),
                })(
                    <Input
                      placeholder={placeholder}
                      disabled={disabled}
                      readOnly={readOnly}
                      type={type}
                      prefix={prefix}
                      suffix={suffix}
                      addonBefore={addonBefore}
                      addonAfter={addonAfter}
                      maxLength={maxLength}
                      onChange={onChange}
                      onBlur={this.handleInputBlur}
                      ref={n => (this.input = n)}
                    />,
                )}
            </Form.Item>
        );
    }

    renderTextAreaFormItem(inputClassName) {
        const { id, initialValue, readOnly } = this.props;
        // Form.Item extra props
        const { label, labelCol, wrapperCol, extra, validateStatus, help } = this.props;
        // Input props
        const {
            type,
            placeholder,
            disabled,
            autosize,
            maxLength,
            onChange,
        } = this.props;

        return (
            <Form.Item
              className={inputClassName}
              validateStatus={validateStatus || this.getValidateStatus(id)}
              help={help || this.getHelp(id)}
              hasFeedback
              label={label}
              labelCol={labelCol}
              wrapperCol={wrapperCol}
              extra={extra}
            >
                {this.getFieldDecorator(id, {
                    initialValue,
                    rules: this.getRules(),
                })(
                    <Input.TextArea
                      placeholder={placeholder}
                      disabled={disabled}
                      readOnly={readOnly}
                      type={type}
                      autosize={autosize}
                      maxLength={maxLength}
                      onChange={onChange}
                      onBlur={this.handleInputBlur}
                      ref={n => (this.input = n)}
                    />,
                )}
            </Form.Item>
        );
    }
}
