import { useState, type FormEvent } from 'react';
import { TechAlert, TechButton, TechInput, TechPasswordInput } from '../../../components/tech-ui';
import type { LoginFormValues } from '../types';

export interface LoginFormProps {
  loading: boolean;
  error: string;
  onFinish: (values: LoginFormValues) => void;
}

/** 管理后台登录表单（Obsidian tech-ui） */
export default function LoginForm({ loading, error, onFinish }: LoginFormProps) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [fieldError, setFieldError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setFieldError('请输入用户名');
      return;
    }
    if (!password) {
      setFieldError('请输入密码');
      return;
    }
    setFieldError('');
    onFinish({ username: username.trim(), password });
  };

  return (
    <form className="admin-login-form" onSubmit={handleSubmit} noValidate>
      {error ? <TechAlert type="error" message={error} /> : null}
      {fieldError && !error ? <TechAlert type="error" message={fieldError} /> : null}

      <TechInput
        label="用户名"
        name="username"
        prefixIcon="mdi:account-outline"
        placeholder="管理员用户名"
        autoComplete="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        disabled={loading}
      />

      <TechPasswordInput
        label="密码"
        name="password"
        prefixIcon="mdi:lock-outline"
        placeholder="登录密码"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={loading}
      />

      <TechButton
        type="submit"
        variant="primary"
        loading={loading}
        icon="mdi:login"
        className="admin-login-form__submit"
      >
        登录
      </TechButton>
    </form>
  );
}
