import { PageContainer } from '@ant-design/pro-components';
import '@umijs/max';
import React, {useEffect, useState} from 'react';
import ReactECharts from 'echarts-for-react';
import {listTopInvokeInterfaceInfoUsingGet} from "@/services/simple-api-backend/analysisController";
import {message} from "antd";

const InterfaceAnalysis: React.FC = () => {
  const [data, setData] = useState<API.InterfaceInfoVO[]>([]);
  const [loading, setLoading] = useState(false);

  const getTopInvokeInterfaceInfo =  async () => {
    setLoading(true);
    try {
      const res = await listTopInvokeInterfaceInfoUsingGet();
      setData(res?.data ?? []);
    } catch (error:any) {
      message.error(`请求失败，${error.error}`);
    }
    setLoading(false);
  }

  useEffect(() => {
    getTopInvokeInterfaceInfo();
  }, []);
  const chartData = data.map(item => {
    return {
      value: item.totalNum,
      name: item.name
    }
  })

  const option = {
    title: {
      text: '调用次数最多的接口Top3',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: '50%',
        data: chartData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

  return (
      <PageContainer>
        <ReactECharts showLoading={loading} option={option} />
      </PageContainer>
  );
};
export default InterfaceAnalysis;
