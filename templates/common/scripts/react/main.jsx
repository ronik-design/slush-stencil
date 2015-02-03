import React from 'react';
import Router from './router';

Router.run((Handler, state) => {
    React.render(
        <Handler {...state} />,
        document.body
    );
});
