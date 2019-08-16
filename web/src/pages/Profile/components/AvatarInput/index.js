import React, { useState, useRef, useEffect } from 'react';
import { useField } from '@rocketseat/unform';
import { toast } from 'react-toastify';
import { Container } from './styles';
import defaultAvatar from '~/assets/default-user.jpg';
import api from '~/services/api';

export default function AvatarInput() {
  const { defaultValue, registerField } = useField('avatar');
  const [file, setFile] = useState(defaultValue && defaultValue.id);
  const [preview, setPreview] = useState(defaultValue && defaultValue.url);
  const ref = useRef();

  useEffect(() => {
    if (ref.current) {
      registerField({
        name: 'avatar_id',
        ref: ref.current,
        path: 'dataset.file',
      });
    }
  }, [ref, registerField]);

  async function handleChange(e) {
    const data = new FormData();
    data.append('file', e.target.files[0]);
    try {
      const response = await api.post('files', data);

      const { id, url } = response.data;
      setPreview(url);
      setFile(id);
    } catch (err) {
      toast.error('Ocorreu um erro ao fazer o upload do seu avatar.');
    }
  }
  return (
    <Container>
      <label htmlFor="avatar">
        <img src={preview || defaultAvatar} alt="User" />
        <input
          name="file"
          type="file"
          id="avatar"
          accept="image/*"
          data-file={file}
          onChange={handleChange}
          ref={ref}
        />
      </label>
    </Container>
  );
}
