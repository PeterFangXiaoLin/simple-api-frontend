import {PageContainer} from '@ant-design/pro-components';

import React, {useEffect, useState} from 'react';
import {List, message} from "antd";
import {
    listInterfaceInfoByPageUsingGet
} from "@/services/simple-api-backend/interfaceInfoController";

const Index: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [list, setList] = useState<API.InterfaceInfo[]>([]);
    const [total, setTotal] = useState<number>(0);

    const loadData = async (current = 1, pageSize = 3) => {
        setLoading(true);
        try {
            const res = await listInterfaceInfoByPageUsingGet({
                current, pageSize
            });
            setList(res?.data?.records ?? []);
            setTotal(res?.data?.total ?? 0);
        } catch (error) {
            message.error('请求失败, ' + error.error);
        }
        setLoading(false);
    }

    useEffect(() => {
        loadData();
    }, []);

    return (
        <PageContainer title="在线接口开放平台">
            <List
                className="interface-list"
                loading={loading}
                itemLayout="horizontal"
                pagination={{
                    pageSize: 3,
                    total: total,
                    showTotal: (total) => {
                        return '总数：' + total;
                    },
                    onChange: (page, pageSize) => {
                        loadData(page, pageSize);
                    }
                }}
                dataSource={list}
                renderItem={(item) => {
                    const apiLink = `/interface_info/${item.id}`;
                    return (<List.Item
                        actions={[<a key={item.id} href={apiLink}>查看</a>]}
                    >
                        <List.Item.Meta
                            title={<a href={apiLink}>{item.name}</a>}
                            description={item.description}
                        />
                    </List.Item>
                    )
                }}
            />
        </PageContainer>
    );
};

export default Index;
