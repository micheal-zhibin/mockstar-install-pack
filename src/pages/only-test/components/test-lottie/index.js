import React, { Component } from 'react';

import { Button, Divider, Table } from 'antd';
import './index.less';

export default class TestLottie extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            list: [],
            time: 0,
            total: 1000
        };
    }

    componentDidMount() {
        // const { BrowserWindow } = window.require('electron').remote;
        // const ipcRenderer = window.require('electron').ipcRenderer;
        // const path = window.require('path');
        //
        // const invisMsgBtn = document.getElementById('invis-msg');
        // const invisReply = document.getElementById('invis-reply');
        //
        //
        // ipcRenderer.on('factorial-computed', (event, input, output) => {
        //     const message = `The factorial of ${input} is ${output}`;
        //     invisReply.textContent = message;
        // });

    }

    handleClick = () => {
        this.requestOnce();
    };

    handleClickMulti = () => {

        this.tryManyTimes(0, 1000);
    };

    tryManyTimes() {
        const { time, total } = this.state;
        const that = this;
        const fs = window.require('fs');
        Promise.all(this.makeRequest(time)).then((result) => {
            result.forEach((item, index) => {
                // fs.writeFileSync(`result/times_${time}_blob_${index+1}.json`, JSON.stringify(item.performance))
            })
            if (time < total) {
                this.setState({
                    time: time + 1,
                });
                that.tryManyTimes(time+1, total);
            } else {
                alert('finish')
            }
        });
    }

    makeRequest(times) {
        const requestArr = [];
        for (let i = 1; i <= 7; i ++) {
            requestArr.push(this.requestOnce(i, times));
        }
        return requestArr;
    }

    requestOnce(blobNum = 1, times) {
        return this.getData(`https://now.qq.com/demo/lottie/index.html?blob=${blobNum}`, false)
            // .then((data) => {
            //     const jsonList = data.performance;
            //     const { list } = this.state;

            //     this.setState({
            //         list: [...list, ...jsonList]
            //     });
            // })
            // .catch((err) => {
            //     console.error(err);
            // });
    }

    getData(url, isShow) {
        return new Promise((resolve, reject) => {
            // console.log('--handleClick--', window.require('path'));
            const retData = {};

            const opts = {
                show: isShow,
                webPreferences: {
                    nodeIntegration: false
                }
            };

            if (isShow) {
                opts.width = 1000;
                opts.height = 600;
            }

            // const windowID = BrowserWindow.getFocusedWindow().id;
            const { BrowserWindow } = window.require('electron').remote;

            let win = new BrowserWindow(opts);

            if (isShow) {
                win.openDevTools();
            }

            win.loadURL(url);

            win.webContents.on('did-finish-load', () => {
                // const input = 100;
                // win.webContents.send('compute-factorial', input, windowID);

                // 如果有先去跳转的场景，则此处会触发两次，因此获取 cookie 时需要先核对域名
                retData.url = win.webContents.getURL();
                retData.title = win.webContents.getTitle();

                this.checkIfBlobReady(win)
                    .then(() => {
                        win.webContents.executeJavaScript('window._loadPerformanceStr', (result) => {
                            // console.log('-==-==222=====', typeof result, result);
                            retData.performance = JSON.parse(result);
                            if (!win.isDestroyed()) {
                                win.destroy();
                            }
                            resolve(retData);
                        });
                    })
                    .catch((err) => {
                        console.log('-------------catch err', err);
                    });

            });
        });
    }

    checkIfBlobReady(win) {
        let count = 0;
        return new Promise((resolve, reject) => {
            let checkT;

            checkT = setInterval(() => {
                if (count > 50) {
                    // !win.isDestroyed() && win.destroy();
                    clearInterval(checkT);
                    return resolve({});
                }
                count ++;
                win.webContents.executeJavaScript('document.querySelectorAll(\'#bodymovin > div\').length', (result) => {
                    if (result > 0) {
                        // console.log(win.isDestroyed())
                        // !win.isDestroyed() && win.destroy();
                        clearInterval(checkT);
                        resolve(result);
                    }
                });
            }, 100);
        });

    }

    render() {
        const { list } = this.state;

        const columns = [{
            title: 'name',
            dataIndex: 'name',
            key: 'name'
        }, {
            title: 'requestStart',
            dataIndex: 'requestStart',
            key: 'requestStart'
        }, {
            title: 'responseStart',
            dataIndex: 'responseStart',
            key: 'responseStart'
        }, {
            title: 'responseEnd',
            dataIndex: 'responseEnd',
            key: 'responseEnd'
        }, {
            title: 'cost',
            dataIndex: 'cost',
            key: 'cost',
            render: (text, record) => (
                <span>{record.responseEnd - record.requestStart}</span>
            )
        }];

        return (
            <div className="page-test-handle-other-site">
                <Button onClick={this.handleClick}>测试打开1次 www.qq.com</Button>
                <Button onClick={this.handleClickMulti}>测试打开3次 www.qq.com</Button>

                <Divider />

                <div>{`${this.state.time} / ${this.state.total}`}</div>

                <Table
                    rowKey="requestStart"
                    dataSource={list}
                    columns={columns}
                />
            </div>
        );
    }
}
