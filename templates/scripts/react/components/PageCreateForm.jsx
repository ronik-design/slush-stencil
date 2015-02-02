import React from 'react';
import DocumentTitle from 'react-document-title';

import ClientActions from '../actions/ClientActions';

var PageCreateForm = React.createClass({
    handleSubmit(e) {
        e.preventDefault();
        ClientActions.createPage(this.state);
        this.setState({title: '', content: ''});
    },

    getInitialState() {
        return {
            title: '',
            content: ''
        };
    },

    handleTitleChange(event) {
        this.setState({title: event.target.value});
    },

    handleContentChange(event) {
        this.setState({content: event.target.value});
    },

    render() {
        let title = this.state.title;
        let content = this.state.content;

        return (
            <DocumentTitle title="Create a Page">
                <form onSubmit={this.handleSubmit}>
                    <input
                        ref="pageTitle"
                        type="text"
                        value={this.state.title}
                        placeholder="Page Title"
                        onChange={this.handleTitleChange}
                    />
                    <input
                        ref="pageContent"
                        type="text"
                        value={this.state.content}
                        placeholder="Page Content"
                        onChange={this.handleContentChange}
                    />
                    <button type="submit">Create Page</button>
                </form>
            </DocumentTitle>
        );
    }
});

export default PageCreateForm;
