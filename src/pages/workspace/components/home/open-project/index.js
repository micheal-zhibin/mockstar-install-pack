import React, { Component } from 'react';
import { connect } from 'react-redux';

import OpenForm from './open-form';
import { hideOpenProjectDlg, loadSaveOpenProject } from '../../../data/data-open-project';

import './index.less';

class LoadProject extends Component {
    constructor(props, context) {
        super(props, context);
    }

    openFormRef = (form) => {
        this.form = form;
    };

    handleOk = () => {
        this.form.validateFields((err, values) => {
            if (!err) {
                if (process.env.NODE_ENV !== 'production') {
                    console.log('Received values of step1 form: ', values);
                }

                const opts = Object.assign({
                    basePath: this.props.selectedDirectory
                }, values);

                // 首先保存，保存成功之后自动跳转
                this.props.loadSaveOpenProject(opts)
                    .then((data) => {
                        this.props.goProject(data.data.id);
                    });
            }
        });
    };

    handleCancel = () => {
        this.props.hideOpenProjectDlg();
    };

    render() {

        const { selectedDirectory, showDlg } = this.props;

        return (
            <div className="load-project">
                <div>{selectedDirectory}</div>

                <OpenForm
                    ref={this.openFormRef}
                    selectedDirectory={selectedDirectory}
                    showDlg={showDlg}
                    onCancel={this.handleCancel}
                    onOk={this.handleOk}
                />

            </div>
        );
    }
}

function mapStateToProps(state) {
    const { openProjectInfo } = state;

    return {
        selectedDirectory: openProjectInfo.selectedDirectory,
        showDlg: openProjectInfo.showDlg
    };
}

function mapDispatchToProps(dispatch) {
    return {
        hideOpenProjectDlg() {
            return dispatch(hideOpenProjectDlg());
        },

        loadSaveOpenProject(data) {
            return dispatch(loadSaveOpenProject(data));
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoadProject);
