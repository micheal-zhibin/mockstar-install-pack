import React, { Component } from 'react';
import { connect } from 'react-redux';

import ShowErrorTips from '../../../../../components/show-error-tips';
import OpenForm from './open-form';

import { hideOpenProjectDlg, loadSaveOpenProject } from '../../../data/data-open-project';
import { loadLocalDBData } from '../../../../../data/data-local-db';

import './index.less';

class OpenProject extends Component {
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

                // 首先保存，刷新列表，然后自动跳转
                this.props.loadSaveOpenProject(opts)
                    .then((data) => {
                        // 刷新列表
                        this.props.loadLocalDBData();

                        // 跳转到工作台
                        this.props.goProject(data.data.id);
                    });
            }
        });
    };

    handleCancel = () => {
        this.props.hideOpenProjectDlg();
    };

    render() {

        const { selectedDirectory, showDlg, errMsg } = this.props;

        return (
            <div className="page-workspace-home-open-project">
                <ShowErrorTips message={errMsg} />

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
        showDlg: openProjectInfo.showDlg,
        errMsg: openProjectInfo.errMsg
    };
}

function mapDispatchToProps(dispatch) {
    return {
        loadLocalDBData() {
            return dispatch(loadLocalDBData());
        },

        hideOpenProjectDlg() {
            return dispatch(hideOpenProjectDlg());
        },

        loadSaveOpenProject(data) {
            return dispatch(loadSaveOpenProject(data));
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(OpenProject);
