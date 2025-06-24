import React from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const TextArea: React.FC<TextAreaProps> = (props) => {
    return (
        <textarea
            {...props}
            className={`rounded-xl text-sm p-3 border focus:outline-none focus:ring-2 focus:ring-primary ${props.className || ''}`}
        />
    );
};

export default TextArea;