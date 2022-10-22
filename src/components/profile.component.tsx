import { useEffect, useState, useContext } from 'react';
import AuthService from "../services/auth.service";
import { Redirect } from "react-router-dom";
import moment from 'moment';
import { Input, Form, Tooltip, Popconfirm, Table, Typography, DatePicker} from 'antd';
import { UploadOutlined, LogoutOutlined} from '@ant-design/icons';
import { TodoContext } from '../context/TodoContext';

const { Search } = Input;
const dateFormat = 'YYYY/MM/DD';

interface Item {
  key: string;
  name: string;
  last_name: string;
  birthday: string;
}

interface Date {
  date: string;
}

let originData: Item[] = [];
let dateData: Date[] = [];

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'text';
  record: Item;
  index: number;
  children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <Input.Group>
  <DatePicker style={{ width: '50%' }} defaultValue={moment(record.birthday, dateFormat)} format={dateFormat} onChange={(date, dateString) => onChange(date, dateString)}/>
</Input.Group> : <Input />;

const onChange = (date: any, dateString: any) => {
  dateData = [dateString];
};

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

export const Profile = () => {
  const [redirect, setRedirect] = useState("")
  const [form] = Form.useForm();
  const [data, setData] = useState(originData);
  const [dataUsers, setDataUsers] = useState(originData);
  const [editingKey, setEditingKey] = useState('');
  const { Todo } = useContext( TodoContext );

  useEffect(() => {
  const userStr = Todo && Todo.username ? Todo.username : null;
  if (userStr == null) setRedirect("/");
    handlePeople();
  }, [])

  const handlePeople = () => {    
    AuthService.getPeople().then(
      (res) => {        
          let origin: any = [];
          res.data.employees.forEach((element: any) => {
             origin.push({
              key: element.id.toString(),
              name: element.name,
              last_name: element.last_name,
              birthday: moment(new Date(element.birthday), 'YYYY/MM/DD').format('YYYY/MM/DD'),
            });
          });
          setData(origin);
          setDataUsers(origin);
        }
        );
  }

  const logOut = () => {
    AuthService.logout();
  }

  const isEditing = (record: Item) => record.key === editingKey;

  const edit = (record: Partial<Item> & { key: React.Key }) => {
    form.setFieldsValue({ name: '', age: '', address: '', ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key: React.Key) => {
    try {
      let row = (await form.validateFields()) as Item;
      if (dateData[0]) {
        row.birthday = String(dateData[0]);
      }

      const newData = [...data];
      const index = newData.findIndex(item => key === item.key);
      if (index > -1) {
        const item = newData[index];
        AuthService.postEdit(row).then(
          (res) => {
            }
            );

        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        setDataUsers(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setDataUsers(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      width: '25%',
      editable: true,
    },
    {
      title: 'Apellidos',
      dataIndex: 'last_name',
      width: '15%',
      editable: true,
    },
    {
      title: 'Fecha de nacimiento',
      dataIndex: 'birthday',
      width: '40%',
      editable: true,
    },
    {
      title: 'operation',
      dataIndex: 'operation',
      render: (_: any, record: Item) => {        
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link onClick={() => save(record.key)} style={{ marginRight: 8 }}>
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
            Edit
          </Typography.Link>
        );
      },
    },
  ];

  const mergedColumns = columns.map(col => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: Item) => ({
        record,
        inputType: col.dataIndex === 'birthday' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const onSearch = (value: string) => {
    if (value) {
      let res = dataUsers.filter(function (el) {
        return el.name.includes(value) || el.last_name.includes(value); 
      });
      setData(res);
    }
  }  
  
  return (
    <div>
      <nav className="navbar navbar-expand nav-design-profile">
        <div className='d-flex justify-content-center align-items-center div-pagination'>
        <Tooltip placement="bottom" title="Buscar por nombre o apellido">
        <Search placeholder="Buscar por nombre o apellido" onSearch={onSearch} style={{ width: 200 }} />
      </Tooltip>
        </div>
      <div className="navbar-nav ml-auto">
      <li className="nav-item">
        <a href="/#/upload" className="nav-link">
        <Tooltip placement="bottom" title="Upload">
        <UploadOutlined />
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
      <div>
        <div className='CardsPeople-div-container'>
      <Form form={form} component={false}>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={{
          onChange: cancel,
        }}
      />
    </Form>
        </div>
      </div>
      }
    </div>
  )
}