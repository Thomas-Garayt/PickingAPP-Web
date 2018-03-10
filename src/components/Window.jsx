// @flow
/* global document */

import React from 'react';
import { Button } from 'antd';

import WindowActions from 'actions/WindowActions';

type Size = {
    width: number,
    height: number,
};
type Position = {
    x: number,
    y: number,
};

type Props = {
    windowId: number,
    previousWindowId?: number,
    initialPos: Position,
    initialSize: Size,
    fullScreen: boolean,

    title: string,
    className: string,

    zIndex: number,

    children?: React.Element<*>,
};
type State = {
    pos: Position,
    size: Size,
    fullScreen: boolean,

    previousSize?: Size,
    previousPos?: Position,

    dragging: boolean,
    resizing: boolean,

    // position relative to the cursor
    rel: {
        x: number,
        y: number,
    },

    resizerInitialPosition?: {
        x: number,
        y: number,
    },
    // The size of the window before resizing
    initialSize?: {
        width: number,
        height: number,
    },
};

type WindowContentProps = {
    shouldUpdate: boolean,
    size: Size,
    children?: React.Element<*>,
};

/**
 * A function to collapse all the "Select" dropdowns of Ant Design selects.
 *
 * It's used because selects collapse only on mouse CLICK.
 * But when dragging or resizing a window, the mouse is only MOUSEDOWN.
 * So the select don't collapse durring dragging or resizing...
 */
function collapseAllAntDSelects() {
    const dropdowns = document.getElementsByClassName('ant-select-dropdown');
    for (let i = 0; i < dropdowns.length; i++) {
        dropdowns[i].style.width = '0';
    }

    const openedInputs = document.getElementsByClassName('ant-select-open');
    for (let i = 0; i < openedInputs.length; i++) {
        openedInputs[i].classList.remove('ant-select-open');
    }
}

/**
 * Get the page offset of a DOM element.
 * @param   {HTMLElement} elem The DOM element.
 * @returns {{top: number, left: number}} The offset of the element. {top: number, left: number}
 */
function offset(
    elem: HTMLElement,
): {
    top: number,
    left: number,
} {
    const defaultPosition = {
        top: 0,
        left: 0,
    };

    if (!elem) {
        return defaultPosition;
    }

    const docElem = elem.ownerDocument.documentElement;
    if (!docElem) {
        return defaultPosition;
    }

    const rect = elem.getBoundingClientRect();

    // Make sure element is not hidden (display: none) or disconnected
    if (rect.width || rect.height || elem.getClientRects().length) {
        return {
            top: rect.top + window.pageYOffset - docElem.clientTop,
            left: rect.left + window.pageXOffset - docElem.clientLeft,
        };
    }
    return defaultPosition;
}

export default class Window extends React.Component<void, Props, State> {
    props: Props;
    state: State;

    constructor(props: Props) {
        super();
        this.state = {
            pos: props.initialPos
                ? props.initialPos
                : {
                    x: 0,
                    y: 0,
                },
            size: props.initialSize
                ? props.initialSize
                : {
                    width: 200,
                    height: 200,
                },
            fullScreen: false,

            dragging: false,
            resizing: false,

            previousSize: {
                width: 0,
                height: 0,
            },
            rel: {
                x: 0,
                y: 0,
            },
        };
    }

    // we could get away with not having this (and just having the listeners on
    // our div), but then the experience would be possibly be janky. If there's
    // anything w/ a higher z-index that gets in the way, then you're toast,
    // etc.
    componentDidUpdate(props: Props, state: State): void {
        if (this.state.fullScreen && !state.fullScreen) {
            window.addEventListener('resize', this.onWindowRezise);
        } else if (!this.state.fullScreen && state.fullScreen) {
            window.removeEventListener('resize', this.onWindowRezise);
        }

        if (this.state.dragging && !state.dragging) {
            document.addEventListener('mousemove', this.doDrag);
            document.addEventListener('mouseup', this.stopDrag);
        } else if (!this.state.dragging && state.dragging) {
            document.removeEventListener('mousemove', this.doDrag);
            document.removeEventListener('mouseup', this.stopDrag);
        }

        if (this.state.resizing && !state.resizing) {
            document.addEventListener('mousemove', this.doResize);
            document.addEventListener('mouseup', this.stopResize);
        } else if (!this.state.resizing && state.resizing) {
            document.removeEventListener('mousemove', this.doResize);
            document.removeEventListener('mouseup', this.stopResize);
        }
    }

    componentDidMount(): void {
        if (this.props.fullScreen) {
            this.toggleFullScreen();
        }
    }

    onWindowRezise = (): void => {
        if (!this.state.fullScreen) {
            return;
        }
        this.setState({
            size: {
                width: window.innerWidth,
                height: window.innerHeight,
            },
            pos: {
                x: 0,
                y: 0,
            },
        });
    };

    toggleFullScreen = (): void => {
        const fullScreen = !this.state.fullScreen;

        if (fullScreen) {
            this.setState({
                fullScreen,
                previousSize: {
                    width: this.state.size.width,
                    height: this.state.size.height,
                },
                previousPos: {
                    x: this.state.pos.x,
                    y: this.state.pos.y,
                },
                size: {
                    width: window.innerWidth,
                    height: window.innerHeight,
                },
                pos: {
                    x: 0,
                    y: 0,
                },
            });
            window.addEventListener('resize', this.onWindowRezise);
        } else {
            const previousSize = this.state.previousSize
                ? this.state.previousSize
                : {
                    width: 0,
                    height: 0,
                };
            const previousPos = this.state.previousPos
                ? this.state.previousPos
                : {
                    x: 0,
                    y: 0,
                };

            this.setState({
                fullScreen,
                previousSize: {
                    width: 0,
                    height: 0,
                },
                size: previousSize,
                pos: previousPos,
            });
            window.removeEventListener('resize', this.onWindowRezise);
        }
    };

    initDrag = (e: MouseEvent): void => {
        // only left mouse button
        if (e.button !== 0) {
            return;
        }

        collapseAllAntDSelects();

        this.focus();

        const pos = offset(this.refs.window);
        this.setState({
            dragging: true,
            rel: {
                x: e.pageX - pos.left,
                y: e.pageY - pos.top,
            },
        });
        e.stopPropagation();
        e.preventDefault();
    };
    stopDrag = (e: MouseEvent): void => {
        this.setState({ dragging: false });
        e.stopPropagation();
        e.preventDefault();
    };
    doDrag = (e: MouseEvent): void => {
        if (!this.state.dragging) {
            return;
        }

        if (this.state.fullScreen) {
            const previousWidth = this.state.previousSize ? this.state.previousSize.width : 0;
            const pos = {
                x: e.pageX - previousWidth * 0.33,
                y: e.pageY - 16,
            };
            this.state.previousPos = pos;
            this.state.rel = {
                x: e.pageX - pos.x,
                y: e.pageY - pos.y,
            };
            this.toggleFullScreen();
        }

        const x = e.pageX - this.state.rel.x;
        let y = e.pageY - this.state.rel.y;
        if (y < 0) {
            y = 0;
        }
        this.setState({
            pos: {
                x,
                y,
            },
        });
        e.stopPropagation();
        e.preventDefault();
    };

    initResize = (e: MouseEvent): void => {
        // only left mouse button
        if (e.button !== 0 || this.state.fullScreen) {
            return;
        }

        collapseAllAntDSelects();

        this.setState({ resizing: true });

        this.state.resizerInitialPosition = {
            x: e.clientX,
            y: e.clientY,
        };
        this.state.initialSize = this.state.size;

        document.addEventListener('mousemove', this.doResize);
        document.addEventListener('mouseup', this.stopResize);
        e.stopPropagation();
        e.preventDefault();
    };
    doResize = (e: MouseEvent): void => {
        if (!this.state.resizing) {
            return;
        }

        const resizerInitialPosition = this.state.resizerInitialPosition;
        const initialSize = this.state.initialSize;

        if (!resizerInitialPosition || !initialSize) {
            return;
        }

        let width = initialSize.width + e.clientX - resizerInitialPosition.x;
        if (width < 200) {
            width = 200;
        }
        let height = initialSize.height + e.clientY - resizerInitialPosition.y;
        if (height < 60) {
            height = 60;
        }

        this.setState({
            size: {
                width,
                height,
            },
        });
        e.stopPropagation();
        e.preventDefault();
    };

    stopResize = (e: MouseEvent): void => {
        this.setState({ resizing: false });
        document.removeEventListener('mousemove', this.doResize);
        document.removeEventListener('mouseup', this.stopResize);
        e.stopPropagation();
        e.preventDefault();
    };

    closeWindow = (): void => {
        WindowActions.closeWindow(this.props.windowId);
    };

    focus = (): void => {
        WindowActions.focusWindow(this.props.windowId);
    };

    shouldChildrenUpdate = (): boolean => {
        const { dragging, resizing } = this.state;
        return !dragging && !resizing;
    };

    goToPreviousWindow = (): void => {
        WindowActions.goToPreviousWindow(this.props.windowId);
    };

    render(): React.Element<*> {
        const {
            windowId,
            previousWindowId,
            zIndex,
            initialPos,
            initialSize,
            fullScreen,
            children,
            className,
            title,
            ...other
        } = this.props;

        return (
            <div
              {...other}
              className={`${className} window ant-layout`}
              ref="window"
              style={{
                  left: `${this.state.pos.x}px`,
                  top: `${this.state.pos.y}px`,
                  width: `${this.state.size.width}px`,
                  height: `${this.state.size.height}px`,
                  zIndex,
              }}
              onMouseDown={this.focus}
            >
                <div className="window-header">
                    {previousWindowId ? (
                        <Button
                          className="window-header-previous-action"
                          shape="circle"
                          icon="arrow-left"
                          onClick={this.goToPreviousWindow}
                          size="small"
                        />
                    ) : null}
                    <h1
                      className="window-header-title"
                      onMouseDown={this.initDrag}
                      onDoubleClick={this.toggleFullScreen}
                    >
                        {title}
                    </h1>
                    <div className="window-header-actions">
                        <Button
                          shape="circle"
                          icon="laptop"
                          onClick={this.toggleFullScreen}
                          size="small"
                        />
                        <Button
                          type="danger"
                          shape="circle"
                          icon="close"
                          onClick={this.closeWindow}
                          size="small"
                        />
                    </div>
                </div>
                <WindowContent size={this.state.size} shouldUpdate={this.shouldChildrenUpdate()}>
                    {children}
                </WindowContent>
                <div className="window-resize" onMouseDown={this.initResize} ref="resizer" />
            </div>
        );
    }
}

Window.defaultProps = {
    children: null,
    previousWindowId: null,
};

/**
 * Component used to manage window content.
 * Properties :
 *   - shouldUpdate : Check if the content of the window should update or not
 *   - children     : The content of the window
 *   - size         : The size of the window
 */
class WindowContent extends React.Component<void, WindowContentProps, void> {
    shouldComponentUpdate(nextProps: WindowContentProps): boolean {
        return nextProps.shouldUpdate;
    }

    render(): React.Element<*> {
        const { children, size } = this.props;
        const contentSize = {
            width: size.width,
            height: size.height - 32,
        };
        const childrenWithProps = React.Children.map(children, child =>
            React.cloneElement(child, { containerSize: contentSize }),
        );
        return <div className="window-content">{childrenWithProps}</div>;
    }
}
