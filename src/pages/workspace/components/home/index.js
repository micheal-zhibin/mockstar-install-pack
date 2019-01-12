import React, { Component } from 'react';
import { connect } from 'react-redux';

import Header from './header';
import ProjectList from './project-list';

import { loadLocalDBData } from '../../../../data/data-local-db';

import './index.less';

class PageWorkspaceHome extends Component {
    componentDidMount() {
        console.log('---2--', this.props.match, this.props.history);
    }

    /**
     * 进入到某个指定的项目详情页中
     *
     * @param {Number} projectId 项目ID
     */
    handleGoProject = (projectId) => {
        this.props.history.push(`${this.props.match.url}/${projectId}`);
    };

    render() {
        return (
            <div className="page-workspace-home">
                <Header />

                <ProjectList goProject={this.handleGoProject}/>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { projectInfo } = state;

    return {
        isLoaded: projectInfo.isLoaded
    };
}

function mapDispatchToProps(dispatch) {
    return {
        loadLocalDBData() {
            return dispatch(loadLocalDBData());
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PageWorkspaceHome);