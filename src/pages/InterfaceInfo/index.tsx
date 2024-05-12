import { PageContainer } from '@ant-design/pro-components';

import {
  getInterfaceInfoByIdUsingGet,
  invokeInterfaceInfoUsingPost
} from '@/services/simple-api-backend/interfaceInfoController';
import { useParams } from '@@/exports';
import { Button, Card, Descriptions, Form, Input, message } from 'antd';
import React, { useEffect, useState } from 'react';

const Index: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [invokeLoading, setInvokeLoading] = useState(false);
  const [data, setData] = useState<API.InterfaceInfo>([]);
  const [invokeRes, setInvokeRes] = useState<any>();

  const params = useParams();
  const loadData = async () => {
    if (!params || Number(params.id) <= 0) {
      message.error('接口不存在');
      return;
    }

    setLoading(true);
    try {
      const res = await getInterfaceInfoByIdUsingGet({
        id: Number(params.id),
      });
      setData(res.data);
    } catch (error) {
      message.error('请求失败, ' + error.error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const onFinish = async (values:any) => {
    if (!params || Number(params.id) <= 0) {
      message.error('接口不存在');
      return;
    }
    setInvokeLoading(true);
    try {
      const res = await invokeInterfaceInfoUsingPost({
        id: params.id,
        ...values
      });
      setInvokeRes(res.data);
    } catch (error) {
      message.error('请求失败, ' + error.error);
    }
    setInvokeLoading(false);
  };

  return (
    <PageContainer title="查看接口文档">
      <Card loading={loading}>
        {data ? (
          <Descriptions title={data.name} column={1}>
            <Descriptions.Item label="接口状态">{data.status ? '正常' : '关闭'}</Descriptions.Item>
            <Descriptions.Item label="描述">{data.description}</Descriptions.Item>
            <Descriptions.Item label="请求地址">{data.url}</Descriptions.Item>
            <Descriptions.Item label="请求方式">{data.method}</Descriptions.Item>
            <Descriptions.Item label="请求头">{data.requestHeader}</Descriptions.Item>
            <Descriptions.Item label="响应头">{data.responseHeader}</Descriptions.Item>
            <Descriptions.Item label="创建时间">{data.createTime}</Descriptions.Item>
            <Descriptions.Item label="更新时间">{data.updateTime}</Descriptions.Item>
          </Descriptions>
        ) : (
          <>请求参数不存在</>
        )}
      </Card>
      <Card title="在线测试">
        <Form name="invoke" layout="vertical" onFinish={onFinish}>
          <Form.Item label="请求参数" name="userRequestParams">
            <Input.TextArea />
          </Form.Item>

          <Form.Item wrapperCol={{ span: 16 }}>
            <Button type="primary" htmlType="submit">
              调用
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Card title="返回结果" loading={invokeLoading}>
        {invokeRes}
      </Card>
    </PageContainer>
  );
};

export default Index;
