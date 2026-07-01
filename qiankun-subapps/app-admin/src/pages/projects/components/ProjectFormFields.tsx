import { Form, Input, Select } from 'antd';
import {
  PROJECT_CATEGORY,
  PROJECT_CATEGORY_LABEL,
} from '../../../../../_shared/projectCategory';

const { TextArea } = Input;

/** 项目分类下拉选项 */
const CATEGORY_OPTIONS = [
  { value: PROJECT_CATEGORY.personal, label: PROJECT_CATEGORY_LABEL.personal },
  { value: PROJECT_CATEGORY.enterprise, label: PROJECT_CATEGORY_LABEL.enterprise },
];

export default function ProjectFormFields() {
  return (
    <>
      <Form.Item name="name" label="项目名称" rules={[{ required: true, message: '请输入名称' }]}>
        <Input />
      </Form.Item>
      <Form.Item
        name="category"
        label="项目类型"
        rules={[{ required: true, message: '请选择项目类型' }]}
      >
        <Select options={CATEGORY_OPTIONS} placeholder="个人项目 / 企业项目" />
      </Form.Item>
      <Form.Item name="desc" label="项目描述" rules={[{ required: true, message: '请输入描述' }]}>
        <TextArea rows={3} />
      </Form.Item>
      <Form.Item name="techStack" label="技术栈">
        <Input placeholder="React, NestJS, Docker..." />
      </Form.Item>
      <Form.Item name="githubUrl" label="GitHub URL">
        <Input />
      </Form.Item>
      <Form.Item name="previewUrl" label="预览 URL">
        <Input />
      </Form.Item>
    </>
  );
}
