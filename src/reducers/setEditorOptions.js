const initialState={
    editor_language: null,
    editor_theme: null   
}

const setEditorOptions=(state=initialState, action)=>{
    switch(action.type){
        case 'set_editor_options':
            console.log(action.payload);
            return {
                editor_language: action.payload.editor_language,
                editor_theme: action.payload.editor_theme
            };

        default:
            return state;
    }
}

export default setEditorOptions;