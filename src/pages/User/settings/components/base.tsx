import { CheckOutlined, UploadOutlined } from '@ant-design/icons';
import {
  ProForm,
  ProFormInstance,
  ProFormSelect,
  ProFormText,

} from '@ant-design/pro-components';

import { Button, GetProp, message, Upload, UploadProps } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import useStyles from './index.style';
import { currentUser as queryCurrent } from '@/services/ant-design-pro/api';
import { updateUser } from '@/services/ant-design-pro/api';
import { RcFile } from 'antd/es/upload';

const isDev = process.env.NODE_ENV === 'development';

const BaseView: React.FC = () => {
  const { styles } = useStyles();
  const [currentUser, setCurrentUser] = useState<API.CurrentUser>(null);
  const [loading, setLoading] = useState(true);
  const [avatar, setAvatar] = useState<string>('');

  const [modifyPhone, setModifyPhone] = useState<boolean>(true);
  const [modifyEmail, setmodifyEmail] = useState<boolean>(true);

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];


const props: UploadProps = {
  name: 'avatar',
  action: isDev ? "/user-center/upload" : "http://47.109.85.240/user-center/upload" ,
  listType:"picture",
  defaultFileList: [],
  onChange(info) {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
      setAvatar(info.file.response.data)
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  beforeUpload(file: FileType){
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('只能上传 JPG/PNG 文件!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('文件大小必须小于 2MB!');
    }
    return isJpgOrPng && isLt2M;
  },


};

  // 头像组件 方便以后独立，增加裁剪之类的功能
  const AvatarView = ({ avatar }: { avatar: string }) => (
    <>
      <div className={styles.avatar_title}>头像</div>
      <div className={styles.avatar}>
        <img src={avatar} alt="avatar" />
      </div>
    
        <div className={styles.button_view}>/
          <Upload {...props}>
            <Button icon={<UploadOutlined />}>上传头像</Button>
          </Upload>
        </div>
      
    </>
  );

    const fetchData = async () => {
      try {
        const userData = await queryCurrent();
        setCurrentUser(userData);
        setLoading(false);
      } catch (error) {
        // 处理错误
      }
    };

    useEffect(() => {
    fetchData();
    // 清除副作用
    return () => {
      // 如果有需要，在组件卸载时进行清理工作
    };
  }, []); // 传入空的依赖数组，确保 useEffect 只在组件挂载时执行一次


  const getAvatarURL = () => {
    console.log('currentser', currentUser)
    if (currentUser) {
      if (currentUser.avatar) {
        return currentUser.avatar;
      }
      const url = 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
      return url;
    }
    return '';
  };
  const handleFinish = async (values: API.CurrentUser) => {

     try {
      // 登录
      const code = await updateUser({ ...values, avatar: avatar === '' ? currentUser.avatar : avatar, id: currentUser.id });
      if (code === 0) {
        message.success('更新基本信息成功');
        fetchData();
        return;
      }
      message.error('更新基本信息失败');
      // 如果失败去设置用户错误信息
    } catch (error) {
      console.log(error);
      message.error('更新基本信息失败');
    }
  };
const formRef = useRef<ProFormInstance>();
  return (
    <div className={styles.baseView}>
      {loading ? null : (
        <>
          <div className={styles.left}>
            <ProForm
              formRef={formRef}
              layout="vertical"
              onFinish={async (values) => {
                await handleFinish(values as API.CurrentUser);
              }}
              submitter={{
                searchConfig: {
                  submitText: '更新基本信息',
                },
                render: (_, dom) => dom[1],
              }}
              initialValues={{
                ...currentUser,
                phone: currentUser?.phone,
              }}
            >
            <ProFormText
                width="md"
                name="username"
                label="用户名"
                rules={[
                  {
                    required: true,
                    message: '请输入您的用户名!',
                  },
                ]}
              />

              <ProFormSelect
                width='md'
                options={[
                  {
                    value: 0,
                    label: '男',
                  },
                  {
                    value: 1,
                    label: '女',
                  },
                ]}
      
                name="gender"
                label="性别"
                
              />

            <div style={{ display: "flex", alignItems: "center" }}>
                  <ProFormText
                    width="md"
                    name="phone"
                    label="电话"
                    disabled={modifyPhone}
                  />
            
                {
                  modifyPhone ? 
                  <span style={{ marginLeft: "15px"}}>
                    <a key="Modify"
                      style={{ fontSize: 15, lineHeight: "32px"}}
                      onClick={()=>{
                        setModifyPhone(false);
                         formRef?.current?.setFieldsValue({phone: ''})

                      
                      }}

                    >修改</a>
                </span> :

                <CheckOutlined twoToneColor="#52c41a" style={{ marginLeft: "15px"}}
                   onClick={()=>{setModifyPhone(true)}}
                ></CheckOutlined>

                }
            </div>



            <div style={{ display: "flex", alignItems: "center" }}>
                  <ProFormText
                    width="md"
                    name="email"
                    label="邮箱"
                  disabled={modifyEmail}
                />
                {
                  modifyEmail ? 
                  <span style={{ marginLeft: "15px"}}>
                    <a key="Modify"
                      style={{ fontSize: 15, lineHeight: "32px"}}
                      onClick={()=>{
                        setmodifyEmail(false);
                         formRef?.current?.setFieldsValue({email: ''})

                      
                      }}

                    >修改</a>
                </span> :

                <CheckOutlined twoToneColor="#52c41a" style={{ marginLeft: "15px"}}
                   onClick={()=>{setmodifyEmail(true)}}
                ></CheckOutlined>

                }
            </div>

        

            
             
            </ProForm>
          </div>
          <div className={styles.right}>
            <AvatarView avatar={getAvatarURL()} />
          </div>
        </>
      )}
    </div>
  );
};
export default BaseView;
function getBase64(arg0: RcFile): void {
  throw new Error('Function not implemented.');
}

