import React from 'react';
import DocumentTitle from 'react-document-title';
import { RouteHandler, Link } from 'react-router';
import ListenerMixin from 'alt/mixins/ListenerMixin';
import Store from '../stores/Store';
import Data from '../services/Data';

var App = React.createClass({

    mixins: [ ListenerMixin ],

    getInitialState: function () {
        return {
            pages: Store.getPages(),
            loading: true
        };
    },

    componentWillMount() {
        this.listenTo(Store, this.onChange);
    },

    componentDidMount() {
        Data.getAllPages();
    },

    onChange() {
        if (!this.isMounted()) {
            return;
        }

        this.setState({
          pages: Store.getPages(),
          loading: false
        });
    },

    render() {
        var pages = this.state.pages.map(function (page) {
            return <li key={page.path}><Link to="page" params={page}>{page.title}</Link></li>;
        });

        return (
            <DocumentTitle title='Sample App'>
                <div className='App'>
                    <Link to="create">Create</Link>
                    <hr />
                    <ul>
                        {pages}
                    </ul>
                    <br />
                    <br />
                    <Link to="/nothing-here">Invalid Link (not found)</Link>
                    <hr />
                    <RouteHandler {...this.props} />
                </div>
            </DocumentTitle>
        );
    }
});

export default App;
