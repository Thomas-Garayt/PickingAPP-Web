// @flow

import React from 'react';
import { Input, Button, Icon, Menu, Checkbox } from 'antd';

type Props = {
    name: string,
    values: Array<{ text: string, value: string | number }>,
    selectedValues: ?Array<string | number>,
    onChange: (filterName: string, values: Array<string | number>) => void,
};

type State = {
    searchText: string,
    selectedValues: Array<string | number>,
};

export default class TableColumnFilter extends React.Component<void, Props, State> {
    state: State;

    constructor(props: Props) {
        super();
        this.state = {
            searchText: '',
            selectedValues: props.selectedValues || [],
        };
    }

    triggerChange = () => {
        if (this.props.onChange) {
            this.props.onChange(this.props.name, this.state.selectedValues);
        }
    };

    onInputChange = (e: *) => {
        const searchText = e.target.value;
        const searchTextUpper = searchText.toUpperCase();
        let selectedValues;
        if (searchText.length === 0) {
            selectedValues = [];
        } else {
            selectedValues = this.props.values
                .filter(v => v.text.toUpperCase().indexOf(searchTextUpper) !== -1)
                .map(v => v.value);
        }

        this.setState(
            {
                searchText,
                selectedValues,
            },
            this.triggerChange,
        );
    };

    selectValue = (value: string) => {
        const { selectedValues } = this.state;
        if (selectedValues.indexOf(value) === -1) {
            selectedValues.push(value);
            this.setState(
                {
                    selectedValues,
                },
                this.triggerChange,
            );
        }
    };

    deselectValue = (value: string) => {
        const { selectedValues } = this.state;
        const i = selectedValues.indexOf(value);
        if (i !== -1) {
            selectedValues.splice(i, 1);
            this.setState(
                {
                    selectedValues,
                },
                this.triggerChange,
            );
        }
    };

    render() {
        const { values } = this.props;
        const { selectedValues, searchText } = this.state;
        return (
            <div className="table-column-filter-dropdown">
                <Input placeholder="Search" value={searchText} onChange={this.onInputChange} />
                <Menu selectable={false}>
                    {values.map(v =>
                        (<Menu.Item key={v.value}>
                            <Checkbox
                              checked={selectedValues.indexOf(v.value) !== -1}
                              onChange={(e) => {
                                  if (e.target.checked) {
                                      this.selectValue(v.value);
                                  } else {
                                      this.deselectValue(v.value);
                                  }
                              }}
                            >
                                {v.text}
                            </Checkbox>
                        </Menu.Item>),
                    )}
                </Menu>
            </div>
        );
    }
}
