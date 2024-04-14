import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, Image, message  } from 'antd';
import { useRef } from 'react';
import { deleteUser, searchUsers } from '@/services/ant-design-pro/api';

export const waitTimePromise = async (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export const waitTime = async (time: number = 100) => {
  await waitTimePromise(time);
};

  const ondelete = async (id: number) => {
    try {
      // 登录
      const code = await deleteUser(id);
      if (code === 0) {
        message.success('删除成功');
      }
  
      // 如果失败去设置用户错误信息
    } catch (error) {
        console.log(error);
       message.error('删除失败');
    }
  };

const columns: ProColumns<API.CurrentUser>[] = [
  {
    dataIndex: 'index',
    valueType: 'indexBorder',
    width: 48,
  },
  {
    title: '用户名',
    dataIndex: 'username',
  },

  {
    title: '账号',
    dataIndex: 'userAccount',
  },

  {
    disable: true,
    title: '头像',
    dataIndex: 'avatar',
    hideInSearch: true,
        render: (_, record) => (
          <><Image src={record.avatar || 'https://img2.imgtp.com/2024/04/10/hzGzFX0G.png'} width={40}></Image></>
          
     
    ),
  },
   {
    title: '性别',
    dataIndex: 'gender',
    valueEnum: {
      0: { text: '男' },
      1: { text: '女' },
    },
  },

  {
    hideInSearch: true,
    title: '用户类型',
    dataIndex: 'authorizator',
    valueEnum: {
      'user::common': {
         text: '普通用户',
         status: 'default',
        },
      'user::admin': {
         text: '管理员',
         status: 'success', 

      },
    },
  },


    {
    title: '账号状态',
    dataIndex: 'state',
    valueEnum: {
      0: {
         text: '正常',
         status: 'Success',
        },
    },
  },

  

  {
    title: '创建时间',
    key: 'createTime',
    dataIndex: 'createTime',
    valueType: 'date',
    sorter: true,
    hideInSearch: true,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    valueType: 'dateRange',
    hideInTable: true,
    search: {
      transform: (value) => {
        return {
          startTime: value[0],
          endTime: value[1],
        };
      },
    },
  },
  {
    title: '更新时间',
    key: 'updateTime',
    dataIndex: 'updateTime',
    valueType: 'date',
    sorter: true,
    hideInSearch: true,
  },

  {
    title: '操作',
    valueType: 'option',
    key: 'option',
    render: (text, record, _, action) => [
      <a
        key="e"
        
        onClick={async () => {
          await ondelete(record.id);
          waitTime(1000)
          action?.reload();
        }}
      >
        删除
      </a>,
   
  
    ],
  },
];

export default () => {
  const actionRef = useRef<ActionType>();
  return (
    <ProTable<API.CurrentUser>
      columns={columns}
      actionRef={actionRef}
      cardBordered
      request={async (params, sort, filter) => {
        console.log(sort, filter);
        const msg = await searchUsers(params) 
        return {
          data: msg.items,

          success: true,
  
          total: msg.total,
        }
  
      }}
      editable={{
        type: 'multiple',
      }}
      columnsState={{
        persistenceKey: 'pro-table-singe-demos',
        persistenceType: 'localStorage',
        defaultValue: {
          option: { fixed: 'right', disable: true },
        },
        onChange(value) {
          console.log('value: ', value);
        },
      }}
      rowKey="id"
      search={{
        labelWidth: 'auto',
      }}
      options={{
        setting: {
          listsHeight: 400,
        },
      }}
      form={{
        // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
        syncToUrl: (values, type) => {
          if (type === 'get') {
            return {
              ...values,
              // created_at: [values.startTime, values.endTime],
            };
          }
          return values;
        },
      }}
      pagination={{
        pageSize: 5,
        onChange: (page) => console.log(page),
      }}
      dateFormatter="string"
      headerTitle=""
      toolBarRender={() => [
        <Button
          key="button"
          icon={<PlusOutlined />}
          onClick={() => {
            actionRef.current?.reload();
          }}
          type="primary"
        >
          新建
        </Button>,
        
      ]}
    />
  );
};