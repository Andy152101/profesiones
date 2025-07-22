import React from 'react';
import PowerBIEmbed from './PowerBi';

const App = () => {
    const embedUrl = 'https://app.powerbi.com/view?r=eyJrIjoiMDcxOGIyODItNzRmZS00NDE2LTlmZjktM2Y3ZmYwNjVkYjg0IiwidCI6ImNiYzJjMzgxLTJmMmUtNGQ5My05MWQxLTUwNmM5MzE2YWNlNyIsImMiOjR9'; // Reemplaza con tu URL de inserción

    return (
        <div>
            <h1>Informe de Power BI</h1>
            <PowerBIEmbed embedUrl={embedUrl} />
        </div>
    );
};

export default App;