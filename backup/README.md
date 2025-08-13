# 邮件模板备份

这个文件夹包含了之前系统中的预设邮件模板备份。

## 文件说明

- `email-templates-backup.ts` - 完整的模板备份文件，包含6个预设模板

## 备份的模板

### 1. 用户注册模板 (`user-registration`)
- **用途**: 用户注册成功的欢迎邮件
- **特点**: 现代渐变设计，友好的欢迎语调
- **变量**: `{{username}}`, `{{login_url}}`

### 2. 登录成功模板 (`login-success`)
- **用途**: 用户成功登录的通知
- **特点**: 绿色安全主题，详细登录信息
- **变量**: `{{username}}`, `{{login_time}}`, `{{ip_address}}`, `{{device_info}}`, `{{dashboard_url}}`

### 3. 登录IP变更模板 (`login-ip-change`)
- **用途**: 异常登录IP的安全警告
- **特点**: 红色警告主题，安全提醒
- **变量**: `{{username}}`, `{{login_time}}`, `{{new_ip_address}}`, `{{location}}`, `{{device_info}}`, `{{change_password_url}}`, `{{contact_support_url}}`

### 4. 邮箱验证码模板 (`email-verification`)
- **用途**: 发送邮箱验证码
- **特点**: 紫色主题，突出验证码显示
- **变量**: `{{verification_code}}`, `{{verification_url}}`

### 5. 密码重置模板 (`password-reset`)
- **用途**: 密码重置邮件
- **特点**: 橙色主题，清晰的操作指引
- **变量**: `{{username}}`, `{{reset_url}}`

### 6. 空白模板 (`blank`)
- **用途**: 从空白开始创建自定义邮件
- **特点**: 简洁的起始模板

## 如何使用备份模板

### 方法1: 通过模板管理页面添加

1. 访问 `/templates` 页面
2. 点击"创建模板"按钮
3. 从备份文件中复制模板的信息：
   - 名称 (`name`)
   - 描述 (`description`) 
   - 缩略图 (`thumbnail`)
   - 设计内容 (`design`)
4. 保存模板

### 方法2: 使用JSON编辑器导入

1. 在模板管理页面创建新模板
2. 在JSON编辑器中点击"导入"按钮
3. 从备份文件中复制对应模板的 `design` 部分
4. 保存为JSON文件后导入

### 方法3: 程序化导入（开发者）

如果需要批量导入，可以编写脚本：

```typescript
import { BACKUP_EMAIL_TEMPLATES } from './backup/email-templates-backup'

// 示例：通过API批量导入模板
async function importBackupTemplates() {
  for (const template of BACKUP_EMAIL_TEMPLATES) {
    try {
      const response = await fetch('/api/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: template.name,
          description: template.description,
          thumbnail: template.thumbnail,
          design: template.design,
          isActive: template.isActive
        })
      })
      
      if (response.ok) {
        console.log(`✅ 成功导入模板: ${template.name}`)
      } else {
        console.error(`❌ 导入失败: ${template.name}`)
      }
    } catch (error) {
      console.error(`❌ 导入出错: ${template.name}`, error)
    }
  }
}
```

## 注意事项

1. **变量替换**: 模板中的变量（如 `{{username}}`）需要在发送邮件时替换为实际值
2. **缩略图**: 备份中的缩略图URL可能需要更新为实际可用的图片地址
3. **样式兼容性**: 这些模板使用了现代CSS，在某些老旧邮件客户端中可能显示效果有差异
4. **品牌定制**: 建议根据实际品牌需求调整颜色、Logo等元素

## 备份日期

- 创建时间: 2024年1月
- 最后更新: 删除系统模板时备份
- 模板数量: 6个

这些模板都经过精心设计，采用现代化的邮件设计最佳实践，支持响应式布局，可以作为创建新模板的良好起点。