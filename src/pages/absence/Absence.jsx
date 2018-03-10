// @flow

import React from 'react';
import { Icon, Tabs } from 'antd';
import Locale from 'locale/LocaleFactory';

import AbsencePlanning from 'pages/absence/AbsencePlanning.jsx';
import AbsenceCounter from 'pages/absence/AbsenceCounter.jsx';

const TabPane = Tabs.TabPane;

type Props = {
    userId: number,
    year: number,
    month: number,
    tab?: number,
};

type State = {
    userId: number,
    year: number,
    month: number,
    tab: number,
};

export default class Absence extends React.Component<void, Props, State> {
    state: State;

    constructor(props: Props) {
        super();
        this.state = {
            userId: props.userId,
            year: props.year,
            month: props.month,
            tab: props.tab ? props.tab : 1,
        };
    }

    render() {
        const { tab } = this.state;

        return (
            <Tabs defaultActiveKey={tab.toString()}>
                <TabPane
                  tab={
                      <span>
                          <Icon type="calendar" />
                          {Locale.trans('absence.menu.planning')}
                      </span>
                    }
                  key="1"
                >
                    <AbsencePlanning />
                </TabPane>
                <TabPane
                  tab={
                      <span>
                          <Icon type="hourglass" />
                          {Locale.trans('absence.menu.counter')}
                      </span>
                    }
                  key="2"
                >
                    <AbsenceCounter />
                </TabPane>
            </Tabs>
        );
    }
}
