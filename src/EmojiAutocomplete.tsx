import * as React from "react";
import './EmojiAutocomplete.scss';
import Emoji from './emoji.json';
const EMOJI_LIST_LENGTH = 5;

export interface EmojiAutocompleteProps { 
    placeholder: string;
}

export interface EmojiAutocompleteState { 
    currentValue: string;
    currentEmojiQuery: string;
    suggestionList: Array<any>;
    emojiList: Array<any>;
    isEmojiListVisable: Boolean;
    selectedIndex: number;
}

export default class EmojiAutocomplete extends React.Component<EmojiAutocompleteProps, EmojiAutocompleteState> {
    

    constructor(props : any) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.updateSuggestionList = this.updateSuggestionList.bind(this);
        this.handleMouseOver = this.handleMouseOver.bind(this);
        this.selectEmoji = this.selectEmoji.bind(this);
        this.clear = this.clear.bind(this);
        // this.selectEmojiByIndex = this.selectEmojiByIndex.bind(this);
        
        this.state = {
            currentValue: '',
            currentEmojiQuery: '',
            suggestionList: [],
            emojiList: [],
            isEmojiListVisable: false,
            selectedIndex: 0
        };
    }

    private inputTextRef = React.createRef<HTMLInputElement>()

    async componentDidMount() {
        const node = this.inputTextRef.current;

        if (node) {
          node.focus();
        }

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
    };

//     selectEmojiByIndex(index : number) {
// const selectedSuggestion = this.state.suggestionList[this.state.selectedIndex];
//     }
    
    selectEmoji(value : string) {
        debugger;
        const selectedSuggestion = this.state.suggestionList[this.state.selectedIndex];
        // const emojiCode = selectedSuggestion.code;

        // const lastIndex = value.lastIndexOf(';');
        
        const parsedUnicodeEmoji = String.fromCodePoint.apply(null, selectedSuggestion.code.split(','));
        const lastColonIndex = value.lastIndexOf(':');
        // const replacementString = value.substr(lastColonIndex, value.length); // wrong...
        const replacementString = value.substr(lastColonIndex, value.length); // ...
        const lastIndexOfReplacementString = value.lastIndexOf(replacementString);
        // debugger;
        const newValue = value.substring(0, lastIndexOfReplacementString) + 
                parsedUnicodeEmoji + 
                value.substring(lastIndexOfReplacementString + replacementString.length, value.length);

        // const reverseReplacementString = replacementString.split('').reverse().join('');
        // const reverseValue = value.split('').reverse().join('');
        
        // str = str.substring(0,pos) + otherchar + str.substring(pos+1)
        // const newValueReverse = reverseValue.replace(reverseReplacementString, emojiCode); 

        debugger;
        // const newValue = newValueReverse.split('').reverse().join(''); // This isn't emoji friendly...
        // const newNewValue = newValue.replace(emojiCode, parsedUnicodeEmoji);
        // debugger;
        // debugger;

        this.setState({
            currentValue: newValue,
        });

        this.clear();
    };

    handleChange = (e : any) => {
        const value = e.target.value;

        this.setState({
            currentValue: value,
            // isEmojiListVisable: isEmojiListVisable,
        });
        
        // e.preventDefault();
    };

    handleKeyDown = (e : any) => {
        // const key = e.key;
        let isEmojiListVisable = this.state.isEmojiListVisable as Boolean;

        if(isEmojiListVisable) {
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
                    selectedIndex = this.state.suggestionList.length - 1;
                }
                else if(selectedIndex >= this.state.suggestionList.length) {
                    selectedIndex = 0;
                }

                this.setState({
                    selectedIndex: selectedIndex
                });

                e.preventDefault();
            }
            else if(e.keyCode === 13) {
                // debugger; // finsih?
                // Confirming selection of the emoji.
                const value = this.state.currentValue;

                this.selectEmoji(value);
            } 
            else if(e.keyCode === 8) { // Backspace.
                // Trim character off.
                const emojiQuery = this.state.currentEmojiQuery.substring(0, this.state.currentEmojiQuery.length - 1);
                let isEmojiListVisable = this.state.isEmojiListVisable as Boolean;
                debugger;

                if(emojiQuery === '') {
                    isEmojiListVisable = false; // If last :, hide dropdown.
                }

                this.setState({
                    currentEmojiQuery: emojiQuery,
                    isEmojiListVisable: isEmojiListVisable
                });
            }
        }
    };

    handleKeyPress = (e : any) => {
        const key = e.key;
        let isEmojiListVisable = this.state.isEmojiListVisable as Boolean;
        const value = this.state.currentValue;
        let newCurrentEmojiQuery = this.state.currentEmojiQuery;

        // If list is hidden, the next key is :, and 
        // current value is empty OR the preceeding character is an empty string.
        const preceedingCharacter = ' '; 
        // debugger;
        if(!isEmojiListVisable && key === ':' && (value === '' || preceedingCharacter === ' ')) {
            isEmojiListVisable = true; // Display emoji suggestion list.
            newCurrentEmojiQuery = key; // Start new emoji query.
            let query = this.getQuery(newCurrentEmojiQuery);
            this.updateSuggestionList(query);                           
        }
        else {
            newCurrentEmojiQuery = newCurrentEmojiQuery + key; // Add normal character.
            let query = this.getQuery(newCurrentEmojiQuery);
            this.updateSuggestionList(query);                 
        }        

        this.setState({
            currentEmojiQuery: newCurrentEmojiQuery,
            isEmojiListVisable: isEmojiListVisable,
        });
    };

    handleClick = (index : number) => {
        this.setState({
            selectedIndex: index
        });

        this.selectEmoji(this.state.currentValue);
    };

    handleMouseOver = (index : number) => {
        this.setState({
            selectedIndex: index
        });
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

    clear() {
        // todo clear.
        this.setState({
            isEmojiListVisable: false,
            suggestionList: [],
            selectedIndex: 0,
            // currentValue: newValue,
        });

        // Re-focus.
        const node = this.inputTextRef.current;

        if (node) {
          node.focus();
        }        

        // let balh = this.inputText
    };

    render() {
        // debugger;
        let suggestionList = null;

        if(this.state.isEmojiListVisable) {
            suggestionList = this.state.suggestionList.map((suggestion, index) => {
                const parsed_unicode_emoji = String.fromCodePoint.apply(null, suggestion.code.split(','));
    
                if(index == this.state.selectedIndex) {
                    return (
                        <div 
                            key={ suggestion.code } 
                            onClick={ () => this.handleClick(index) }
                            onMouseOver={ () => this.handleMouseOver(index) }
                            className={[ 'suggestion', 'selected'].join(' ')}
                        >
                            { parsed_unicode_emoji }
                            { suggestion.name }
                        </div>
                    );
                }
                else {
                    return (
                        <div 
                            key={ suggestion.code } 
                            onClick={ () => this.handleClick(index) }
                            onMouseOver={ () => this.handleMouseOver(index) }
                            className="suggestion"
                        >
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
                    // onInput={ this.handleChange }
                    onKeyPress={ this.handleKeyPress }
                    onKeyDown={ this.handleKeyDown }
                    placeholder={ this.props.placeholder }
                    className="input-text"
                    ref={ this.inputTextRef }
                />

{/* data-bind="event: {'keydown': on_input_key_down, 'keyup': on_input_key_up},
                             focus_on_keydown: true,
                             hasFocus: blinking_cursor,
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