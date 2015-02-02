import React from 'react';
import Router from 'react-router';
import ListenerMixin from 'alt/mixins/ListenerMixin';
import DocumentTitle from 'react-document-title';
import Store from '../stores/Store';

export default React.createClass({

    propTypes: {
        title: React.PropTypes.string,
        content: React.PropTypes.string,
        path: React.PropTypes.string
    },

    mixins: [ ListenerMixin, Router.Navigation, Router.State ],

    getStateFromStore: function (path) {
        path = this.getParams().path;
        return Store.getPage(path);
    },

    getInitialState: function () {
        return this.getStateFromStore();
    },

    componentWillMount() {
        this.listenTo(Store, this.onChange);
    },

    componentWillReceiveProps() {
        this.setState(this.getStateFromStore());
    },

    onChange() {
        this.setState(this.getStateFromStore());
    },

    render() {
        let title = this.state.title;
        let content = this.state.content;

        return (
            <DocumentTitle title={title}>
                <div>
                    <h1>{title}</h1>
                    <p>{content}</p>
                </div>
            </DocumentTitle>
        );
    }
});
