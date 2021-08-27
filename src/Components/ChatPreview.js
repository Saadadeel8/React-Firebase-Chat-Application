import React from 'react'
import './Styles/chat.css'
import { Input } from 'antd';
import { SendOutlined } from '@ant-design/icons';


export default function ChatPreview() {
    const { TextArea } = Input;
    const handleMessage = () => {

    }
    return (
        <div className='chatScreen'>
            <div className='chatHistory'></div>
            <div className='chatSection'>
            <div className='chatMessages'></div>
            <div className='chatTyping'>
            <div className='textArea'><TextArea row={2} maxLength={100} bordered onPressEnter={handleMessage}/></div>
            <div className='sendIcon'><button><SendOutlined /></button></div>
            </div>
            </div>
        </div>
    )
}
