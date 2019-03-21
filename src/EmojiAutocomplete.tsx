import * as React from "react";

export interface EmojiAutocompleteProps { 

}
export interface EmojiAutocompleteState { 
    currentText: string;
}

export default class EmojiAutocomplete extends React.Component<EmojiAutocompleteProps, EmojiAutocompleteState> {
    constructor(props : any) {
        super(props);
        
        this.state = {
            currentText: ''
        };
    }

    handleChange = (e : any) => {
        const value = e.target.value;
        debugger;
        // console.log(value);
    
        // this.state.onSelectChange(value);
      }    

    render() {
        return (
            <div>
                {/* <textarea class="conversation-input-text border-theme" value={this.state.currentText} onChange={this.handleChange}>
                </textarea>                 */}
                <textarea 
                    value={this.state.currentText}
                    onChange={this.handleChange}
                    className="conversation-input-text border-theme"
                >

                </textarea>
            </div>
        );
    };
}