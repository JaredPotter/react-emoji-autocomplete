import * as React from "react";
import './EmojiAutocomplete.scss';
import { read } from "fs";
import Emoji from './emoji.json';
// import './EmojiAutocomplete.scss';
// import emojis from './emoji.tsv';
// import emojis from './emoji.tsv';
// const emojis = require('emoji.tsv');

const EMOJI_LIST_LENGTH = 5;

export interface EmojiAutocompleteProps { 

}
export interface EmojiAutocompleteState { 
    currentValue: string;
    suggestionList: Array<any>;
    emojiList: Array<any>;
    isEmojiListVisable: boolean;
    selectedIndex: number;
}

export default class EmojiAutocomplete extends React.Component<EmojiAutocompleteProps, EmojiAutocompleteState> {
    constructor(props : any) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleArrowNavigation = this.handleArrowNavigation.bind(this);
        this.updateSuggestionList = this.updateSuggestionList.bind(this);
        
        this.state = {
            currentValue: '',
            suggestionList: [],
            emojiList: [],
            isEmojiListVisable: false,
            selectedIndex: 0
        };
    }

    async componentDidMount() {
        const emojisList = Emoji;

        this.setState({
            emojiList: emojisList
        });
    }

    getQuery(value : string) {
        let query = value;
        query = query.split('').reverse().join(''); // Reverse
        query = query.split(':')[0];
        query = query.split('').reverse().join(''); // Reverse back and join.

        return query;
    }

    handleChange = (e : any) => {
        const value = e.target.value;
        let currentValue = this.state.currentValue;
        let newChar = value.substr(currentValue.length, 1);
        let isEmojiListVisable = this.state.isEmojiListVisable;

        if(newChar == ':') {
            // Display emoji suggestion list.
            isEmojiListVisable = true;
        }

        if(isEmojiListVisable) {            
            let query = this.getQuery(this.state.currentValue + newChar);

            this.updateSuggestionList(query);
        }

        this.setState({
            currentValue: value,
            isEmojiListVisable: isEmojiListVisable,
        });

        e.preventDefault();
    }

    handleArrowNavigation = (e : any) => {
        if (this.state.isEmojiListVisable) {            
            if(e.keyCode === 38 || e.keyCode === 40) {
                let selectedIndex = this.state.selectedIndex;

                if(e.keyCode === 38) {
                    // Key up.
                    selectedIndex = selectedIndex - 1;
                }
                else {
                    // Key down.
                    selectedIndex = selectedIndex + 1;
                }

                if(selectedIndex < 0) {
                    selectedIndex = EMOJI_LIST_LENGTH - 1;
                }
                else if(selectedIndex >= EMOJI_LIST_LENGTH) {
                    selectedIndex = 0;
                }

                this.setState({
                    selectedIndex: selectedIndex
                });
            }

            else if(e.keyCode === 13) {
                // Confirming selection of the emoji.
                const value = this.state.currentValue;
                const selectedSuggestion = this.state.suggestionList[this.state.selectedIndex];
                const parsed_unicode_emoji = String.fromCodePoint.apply(null, selectedSuggestion.code.split(','));
                const lastColonIndex = value.lastIndexOf(':');
                const replacementString = value.substr(lastColonIndex, value.length - 1);
debugger;


                // let query = ':' + this.getQuery(value);
                // query = query.split('').reverse().join('');
                // debugger;
                // let newValue = value.split('').reverse().join('')
                const newValue = value.replace(replacementString, parsed_unicode_emoji);
                // debugger;
                // newValue = newValue.split('').reverse().join('');
                // debugger;
                
                
                // const newValue = value + parsed_unicode_emoji;
                // this.updateSuggestionList(query);
                debugger;


                this.setState({
                    isEmojiListVisable: false,
                    suggestionList: [],
                    selectedIndex: 0,
                    currentValue: newValue,
                });
                debugger;
            }
        }
    };

    updateSuggestionList(query : string) {
        let searchQuery = '';

        if(!query) {
            searchQuery = '';            
        }
        else {
            searchQuery = query;
        }

        searchQuery = searchQuery.toLowerCase();

        const suggestionList = this.state.emojiList
            .filter((emoji) => emoji.name.toLowerCase().indexOf(searchQuery) !== -1)
            .slice(0, EMOJI_LIST_LENGTH);

        this.setState({
            suggestionList: suggestionList
        });
    }

    render() {
        // debugger;
        let suggestionList = null;

        if(this.state.isEmojiListVisable) {
            suggestionList = this.state.suggestionList.map((suggestion, index) => {
                const parsed_unicode_emoji = String.fromCodePoint.apply(null, suggestion.code.split(','));
    
                if(index == this.state.selectedIndex) {
                    return (
                        <div key={ suggestion.code } className={[ 'suggestion', 'selected'].join(' ')}>
                            { parsed_unicode_emoji }
                            { suggestion.name }
                        </div>
                    );
                }
                else {
                    return (
                        <div key={ suggestion.code } className="suggestion">
                            { parsed_unicode_emoji }
                            { suggestion.name }
                        </div>
                    );
                }
            });
        }


            // .map((emoji) => {
                // const [code, name] = emoji.split('\t');
                // const code = emoji.code;
                // const name = emoji.name;
                // const parsed_unicode_emoji = String.fromCodePoint.apply(null, code.split(','));
                // return `<div><span class='symbol'>${parsed_unicode_emoji}</span>${name}</div`;
                // return `<div class='emoji'><span class='symbol'>${parsed_unicode_emoji}</span><span class='name'>${name}</span></div>`;
            // })        

        return (
            <div>
                {/* <span> { this.state.currentValue } </span> */}
                <input 
                    value={ this.state.currentValue }
                    onChange={ this.handleChange }
                    onKeyUp={ this.handleArrowNavigation }
                    className="conversation-input-text border-theme"
                />

{/* data-bind="event: {'keydown': on_input_key_down, 'keyup': on_input_key_up},
                             focus_on_keydown: true,
                             css: {'ephemeral-input': has_ephemeral_timer()},
                             enter: on_input_enter,
                             hasFocus: blinking_cursor,
                             textInput: input,
                             resize: input,
                             resize_callback: scroll_message_list,
                             click: on_input_click,
                             attr: {'placeholder': input_tooltip},
                             paste_file: on_paste_files" */}

                <div className="suggestion-list">
                    { suggestionList }
                </div>
                <div>

                </div>
            </div>
        );
    };
}