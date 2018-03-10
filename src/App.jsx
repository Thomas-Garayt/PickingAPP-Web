/* global document */

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import { LocaleProvider } from 'antd';
import frFR from 'antd/lib/locale-provider/fr_FR';

import LoginActions from 'actions/LoginActions';
import LoginStore from 'stores/LoginStore';

import Layout from 'pages/Layout.jsx';
import Login from 'pages/Login.jsx';
import Home from 'pages/Home.jsx';

/**
 * Use
 * @param {type} nextState
 * @param {type} replace
 * @returns {undefined}
 */
function requireAuth(nextState, replace) {
    if (!LoginStore.isLoggedIn()) {
        replace({ pathname: '/login', query: { return_to: nextState.location.pathname } });
    }
}

const app = document.getElementById('app');
const routes = (
    <LocaleProvider locale={frFR}>
        <Router history={hashHistory}>
            {/*
                <IndexRoute component={Desktop} onEnter={requireAuth} />
                */}
            <Route path="home" component={Home}></Route>
            {/* <Route path="login" component={Login} /> */}
        </Router>
    </LocaleProvider>
);

//LoginActions.loginUserIfRemembered();

ReactDOM.render(routes, app);
