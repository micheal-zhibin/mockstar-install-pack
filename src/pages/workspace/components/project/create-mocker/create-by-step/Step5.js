import React, { Component, Fragment } from 'react';
import { Button, Col, Row } from 'antd';
import { Result } from 'ant-design-pro';

export default class CreateStep5 extends Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        const { createMockerInfo, goProjectHome } = this.props;
        const information = (
            <div className="step-result-panel">
                <Row>
                    <Col xs={24} sm={8}>
                        路径：
                    </Col>
                    <Col xs={24} sm={16}>
                        {createMockerInfo.parentPath + '/mockstar-app/mock_server/mockers/' + createMockerInfo.mockerConfig.name}
                    </Col>
                </Row>
            </div>
        );

        const actions = (
            <Fragment>
                <Button type="primary">
                    继续创建
                </Button>

                <Button onClick={goProjectHome}>返回</Button>
            </Fragment>
        );

        return (
            <Result
                type="success"
                title="操作成功"
                description="预计两小时内到账"
                extra={information}
                actions={actions}
            />
        );
    }
}
