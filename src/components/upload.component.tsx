import { Upload, Tooltip  } from 'antd';
import ImgCrop from 'antd-img-crop';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import React, { useState, useEffect, useContext } from 'react';
import AuthService from "../services/auth.service";
import { Redirect } from "react-router-dom";
import { LogoutOutlined, TeamOutlined } from '@ant-design/icons';
import { TodoContext } from '../context/TodoContext';

export const UploadPictures = () => {
    const [redirect, setRedirect] = useState("")
    const [fileList, setFileList] = useState<UploadFile[]>([
        {
          uid: '-1',
          name: 'image.png',
          status: 'done',
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
      ]);
      const { Todo } = useContext( TodoContext );
  useEffect(() => {
    const userStr = Todo && Todo.username ? Todo.username : null;
  if (userStr == null) setRedirect("/");
  }, [])

  const onChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as RcFile);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const logOut = () => {
    AuthService.logout();
  }

  return (

    <div>
      <nav className="navbar navbar-expand nav-design-profile">
      <div className="navbar-nav ml-auto">
      <li className="nav-item">
        <a href="/#/employees" className="nav-link">
        <Tooltip placement="bottom" title="employees">
        <TeamOutlined />
        </Tooltip>
        </a>
      </li>
      <li className="nav-item">
        <a href="/login" className="nav-link" onClick={logOut}>
        <Tooltip placement="bottom" title="logOut">
        <LogoutOutlined />
        </Tooltip>
        </a>
      </li>
      </div>
  </nav> 
      {redirect ? <Redirect to={redirect}/> : 
      <div className='d-flex justify-content-center align-items-center'>
      <div>
      <ImgCrop rotate>
      <Upload
        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        listType="picture-card"
        fileList={fileList}
        onChange={onChange}
        onPreview={onPreview}
      >
        {fileList.length < 5 && '+ Upload'}
      </Upload>
    </ImgCrop>
    </div>
    </div>
      }
    </div>
    
  );
}
 
