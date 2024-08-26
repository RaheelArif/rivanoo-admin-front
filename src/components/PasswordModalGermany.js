
import React, { useState } from 'react';
import { Modal, Input, Button } from 'antd';
import { useDispatch } from 'react-redux';
import { authenticateGer } from '../app/slices/passwordSlice';
import { toast } from 'react-hot-toast';

const PasswordModalGermany = ({ visible, onClose }) => {
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = () => {
    if (password === 'hadaya-germany') {
      dispatch(authenticateGer());
      onClose();
    } else {
      toast.error('Incorrect password');
    }
  };

  return (
    <Modal
      title="Enter Password"
      open={visible}
      footer={null}
      closable={false}
    >
      <Input.Password
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button type="primary" onClick={handleSubmit} style={{ marginTop: 10 }}>
        Submit
      </Button>
    </Modal>
  );
};

export default PasswordModalGermany;
