// @flow

import React from 'react';
import {Button} from 'antd';
import Locale from 'locale/LocaleFactory';

type Props = {
    dataSource: Array<Object>,
    rowDef: { height?: number, render: (record: ?Object)=>?React.Element<*>, key: string, sortBy: string },
    height: number,
    onRow?: (record: Object)=>Object
}

type State = {
    source: FormattedSource,
    visibleLetters: Array<AlphabeticalCharacter>,

    previousScrollTop: number,
    shouldScrollAfterUpdate?: boolean
}

type AlphabeticalCharacter = '#' | 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l' | 'm' | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x' | 'y' | 'z'
type FormattedSource = {
    '#': Array<Object>,
    a: Array<Object>,
    b: Array<Object>,
    c: Array<Object>,
    d: Array<Object>,
    e: Array<Object>,
    f: Array<Object>,
    g: Array<Object>,
    h: Array<Object>,
    i: Array<Object>,
    j: Array<Object>,
    k: Array<Object>,
    l: Array<Object>,
    m: Array<Object>,
    n: Array<Object>,
    o: Array<Object>,
    p: Array<Object>,
    q: Array<Object>,
    r: Array<Object>,
    s: Array<Object>,
    t: Array<Object>,
    u: Array<Object>,
    v: Array<Object>,
    w: Array<Object>,
    x: Array<Object>,
    y: Array<Object>,
    z: Array<Object>
}

/**
 * Scroll an HTMLElement to a specific position.
 * If the element is not height enought to scroll to the target, it will stop at is maximum.
 * @param  {HTMLElement} el             The HTML element to scroll.
 * @param  {number}      targetScroll   The target scroll position from the top of the element.
 * @param  {number}      scrollDuration [
 */
function scrollTo(el: HTMLElement, targetScroll: number, scrollDuration: number): void {
    var delta = (targetScroll - el.scrollTop);
    const cosParameter = delta / 2;
    var scrollCount = 0;
    var oldTimestamp = performance.now();

    function step (newTimestamp) {
        scrollCount += Math.PI / (scrollDuration / (newTimestamp - oldTimestamp));
        if (scrollCount >= Math.PI) {
            delta = 0;
            el.scrollTop = targetScroll;
        }
        if (delta === 0) {
            return;
        }
        delta = Math.round(cosParameter + cosParameter * Math.cos(scrollCount));
        el.scrollTop = targetScroll - delta;
        oldTimestamp = newTimestamp;
        window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
}

/**
 * Check if a string start with a letter.
 * @param  {string}  str    The string to check.
 * @param  {string}  letter The letter we're looking for. If equals '#', we look for all non alphanumeric characters.
 * @return {boolean}        TRUE is the sring match, else FALSE.
 */
function beginWithLetter(str: string, letter: string): boolean {
    if(letter === '#'){
        const alphaMap = 'abcdefghijklmnopqrstuvwxyzéèêëàöï';
        return alphaMap.indexOf(str[0].toLowerCase()) === -1;
    }

    const accentMap = {
        'e': 'eéèêë',
        'a': 'aà',
        'o': 'oö',
        'i': 'iï'
    };

    return str[0].toLowerCase() === letter || (accentMap[letter] && accentMap[letter].indexOf(str[0]) > -1);
}

const LETTER_TITLE_HEIGHT = 27;
const DEFAULT_ROW_HEIGHT = 30;
const MIN_HEIGHT = 300;

// $FlowFixMe
const ALPHABET: Array<AlphabeticalCharacter> = '#abcdefghijklmnopqrstuvwxyz'.split('');

export default class AlphabeticalList extends React.Component<void, Props, State> {
    state: State
    list: HTMLElement

    constructor(props: Props) {
        super();

        const {dataSource} = props;
        const source = this.formatSource(dataSource, props);
        this.state = {
            source: source,
            visibleLetters: this.getVisibleLetters(source, ALPHABET[0], props),
            previousScrollTop: 0
        }
    }

    componentWillReceiveProps(nextProps: Props): void {
        const {dataSource} = nextProps;
        const {visibleLetters} = this.state;
        const source = this.formatSource(dataSource, nextProps);
        this.setState({source: source, visibleLetters: this.getVisibleLetters(source, visibleLetters[0], nextProps)});

        // We should scroll after update only is the size of the source change.
        this.state.shouldScrollAfterUpdate = nextProps.dataSource.length != this.props.dataSource.length;
    }

    componentDidUpdate(prevProps: Props, prevState: State): void {
        if(this.state.shouldScrollAfterUpdate && prevState.visibleLetters[0]){
            this.scrollTo(prevState.visibleLetters[0], 1);
        }
        this.state.shouldScrollAfterUpdate = false;
    }

    handleScroll = (e: Event): void => {

        // The scroll is not handled if the delta with previous scroll is too small.
        // This prevent some infinite loop to occure.
        // $FlowFixMe
        const scrollTopDelta = this.state.previousScrollTop - e.target.scrollTop;
        if(this.previousScrollTop && scrollTopDelta > -10 && scrollTopDelta < 10){
            return;
        }
        // $FlowFixMe
        this.state.previousScrollTop = e.target.scrollTop;

        // Here start the real stuff.
        const {rowDef} = this.props;
        const {source} = this.state;
        const rowHeight = rowDef.height || DEFAULT_ROW_HEIGHT;

        var tempScroll = 0;
        for(var i=0; i<ALPHABET.length; i++){
            if(source[ALPHABET[i]].length > 0) {
                tempScroll += LETTER_TITLE_HEIGHT + (source[ALPHABET[i]].length * rowHeight);
                // $FlowFixMe
                if(tempScroll > e.target.scrollTop){
                    break;
                }
            }
        }
        if(ALPHABET[i] != this.state.visibleLetters[0]){
            this.setState({visibleLetters: this.getVisibleLetters(source, ALPHABET[i], this.props)});
        }
    }

    scrollTo = (letter: string, delay?: number): void => {
        const {rowDef} = this.props;
        const {source} = this.state;
        const rowHeight = rowDef.height || DEFAULT_ROW_HEIGHT;

        var scrollTop = 0;
        for(var i=0; i<ALPHABET.length; i++){
            if(source[ALPHABET[i]].length > 0) {
                 const currentLetter = ALPHABET[i];
                if(currentLetter === letter){
                    break;
                }
                scrollTop += LETTER_TITLE_HEIGHT + (source[currentLetter].length * rowHeight);
            }
        }
        scrollTo(this.list, Math.trunc(scrollTop)+4, delay || 500);
    }

    getVisibleLetters = (source: FormattedSource, currentLetter: AlphabeticalCharacter, props: Props): Array<AlphabeticalCharacter> => {
        const {rowDef} = props;
        const height = (props.height > MIN_HEIGHT) ? props.height : MIN_HEIGHT;
        const rowHeight = rowDef.height || DEFAULT_ROW_HEIGHT;

        const showAll = (rowHeight * props.dataSource.length < height);

        var visibleLetters = [];
        var iCurrentLetter = currentLetter ? 999 : -1;
        var tmpHeight = 0;
        for(var i=0; i<ALPHABET.length; i++){

            if(showAll && source[ALPHABET[i]].length > 0){
                visibleLetters.push(ALPHABET[i]);
                continue;
            }

            if(ALPHABET[i] === currentLetter){
                if(source[currentLetter].length > 0){
                    visibleLetters.push(currentLetter);
                }
                iCurrentLetter = i;
            }

            if(source[ALPHABET[i]].length > 0 && i > iCurrentLetter) {
                visibleLetters.push(ALPHABET[i]);
                tmpHeight += LETTER_TITLE_HEIGHT + (source[ALPHABET[i]].length * rowHeight);
                if(tmpHeight > height) {
                    break;
                }
            }
        }

        return visibleLetters;
    }

    getHeight = (): number => {
        return (this.props.height > MIN_HEIGHT) ? this.props.height : MIN_HEIGHT;
    }
    getRowHeight = () => {
        return this.props.rowDef.height || DEFAULT_ROW_HEIGHT;
    }

    render() {
        const {source, visibleLetters} = this.state;

        const height = this.getHeight();
        const rowHeight = this.getRowHeight();

        const firstVisibleLetter = visibleLetters[0];
        var iFirstVisibleLetter = 999;
        const lastVisibleLetter = visibleLetters[visibleLetters.length-1];
        var iLastVisibleLetter = 999;
        var padBefore = 0;
        var padAfter = 0;
        for(var i=0; i<ALPHABET.length; i++){

            if(ALPHABET[i] === firstVisibleLetter){
                iFirstVisibleLetter = i;
            }
            if(ALPHABET[i] === lastVisibleLetter) {
                iLastVisibleLetter = i;
            }

            if(source[ALPHABET[i]].length === 0) {
                continue;
            }

            if(i < iFirstVisibleLetter){
                padBefore += LETTER_TITLE_HEIGHT + (source[ALPHABET[i]].length * rowHeight);
            }
            if(i > iLastVisibleLetter){
                padAfter += LETTER_TITLE_HEIGHT + (source[ALPHABET[i]].length * rowHeight);
            }
        }
        return (
                <div className="alphabetical-list" style={{maxHeight: height + 'px', minHeight: height + 'px', height: height + 'px'}}>
                    <div className="alphabetical-data" onScroll={this.handleScroll} ref={list => { this.list = list; }}>
                        <div style={{maxHeight: padBefore + 'px', minHeight: padBefore + 'px', height: padBefore + 'px'}}></div>
                        { this.renderAlphabeticalData() }
                        <div style={{maxHeight: padAfter + 'px', minHeight: padAfter + 'px', height: padAfter + 'px'}}></div>
                    </div>
                    <div className="alphabetical-scroll">
                        { this.renderAlphabeticalScroll() }
                    </div>
                </div>);
    }

    renderAlphabeticalData(): Array<?React.Element<*>> {
        const {rowDef, onRow} = this.props;
        const {source, visibleLetters} = this.state;
        const rowHeight = this.getRowHeight();
        return ALPHABET.map(letter => {
                if(visibleLetters.indexOf(letter) === -1) {
                    return null;
                }
                return (
                <div key={letter}>
                    <div class="alphabetical-letter">{letter}</div>
                    <div class="alphabetical-letter-content">
                        {source[letter].map((d: Object): ?React.Element<*> =>{
                            if(visibleLetters.indexOf(letter) == -1){
                                return null;
                            }
                            const rowProps = onRow(d);
                            return (
                            <div key={d[rowDef.key]} {...rowProps} style={{height: rowHeight + 'px', lineHeight: 'calc('+ rowHeight +'px - 1rem)'}}>
                                {rowDef.render(d)}
                            </div>)
                            }
                        )}
                    </div>
                </div>)
            });
    }

    renderAlphabeticalScroll(): Array<React.Element<*>> {
        const {source, visibleLetters} = this.state;
        return ALPHABET.map(letter => {
                if(source[letter].length === 0){
                    return (<div key={letter} className="disabled" >{letter}</div>);
                }
                // $FlowFixMe
                return (<div key={letter} className={letter===visibleLetters[0]?'active':''} onClick={() => this.scrollTo(letter)}>{letter}</div>);
            });
    }

    formatSource = (rawSource: Array<Object>, props: Props): FormattedSource => {
        const {rowDef} = props;

        const sortedSources = rawSource.concat().map(addSortString).sort(
            (d1, d2) => {
                return d1._sortStr.localeCompare(d2._sortStr);
            });

        var formatedSource = {'#':[], a:[], b:[], c:[], d:[], e:[], f:[], g:[], h:[], i:[], j:[], k:[], l:[], m:[], n:[], o:[], p:[], q:[], r:[], s:[], t:[], u:[], v:[], w:[], x:[], y:[], z:[]};

        ALPHABET.map(letter => {
            formatedSource[letter] = sortedSources.filter(s => beginWithLetter(s._sortStr, letter));
        });

        function addSortString(source){
            const sortBy = rowDef.sortBy;
            source._sortStr = '';
            if( Array.isArray(sortBy) ) {
                for(var i=0; i<sortBy.length; i++){
                    source._sortStr += source[sortBy[i]];
                }

            }else {
                source._sortStr = source[sortBy];
            }
            return source;
        }

        return formatedSource;
    }
}

AlphabeticalList.defaultProps = {
    onRow: ()=>({}),
    provinceList: [],
};
