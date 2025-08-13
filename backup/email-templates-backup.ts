import { EmailDesign } from '@/types'

// 系统邮件模板备份 - 2024年创建
// 这些是之前删除的预设模板，可以根据需要重新添加到系统中
export const BACKUP_EMAIL_TEMPLATES: EmailDesign[] = [
  {
    id: 'user-registration',
    name: '用户注册',
    description: '用户注册成功的欢迎邮件模板',
    thumbnail: '/templates/registration-thumb.png',
    isActive: true,
    design: {
      "counters": {
        "u_column": 1,
        "u_row": 3,
        "u_content_text": 4,
        "u_content_image": 1,
        "u_content_button": 1,
        "u_content_divider": 1
      },
      "body": {
        "id": "registration-body",
        "rows": [
          {
            "id": "registration-content",
            "cells": [1],
            "columns": [
              {
                "id": "registration-content-col",
                "contents": [
                  {
                    "id": "registration-title",
                    "type": "text",
                    "values": {
                      "containerPadding": "40px 40px 20px",
                      "fontSize": "28px",
                      "textAlign": "center",
                      "lineHeight": "130%",
                      "fontWeight": "bold",
                      "text": "<h1 style=\"margin: 0; color: #1e293b; font-size: 28px; line-height: 36.4px; font-weight: 700;\">🎉 欢迎加入我们！</h1>"
                    }
                  },
                  {
                    "id": "registration-greeting",
                    "type": "text",
                    "values": {
                      "containerPadding": "0px 40px 30px",
                      "fontSize": "16px",
                      "textAlign": "center",
                      "lineHeight": "150%",
                      "text": "<p style=\"margin: 0; color: #64748b; font-size: 16px; line-height: 24px;\">您好 <strong style=\"color: #1e293b;\">{{username}}</strong>，</p><p style=\"margin: 10px 0 0 0; color: #64748b; font-size: 16px; line-height: 24px;\">感谢您注册我们的服务！您的账户已成功创建。</p>"
                    }
                  },
                  {
                    "id": "registration-features",
                    "type": "text",
                    "values": {
                      "containerPadding": "0px 40px 30px",
                      "fontSize": "16px",
                      "textAlign": "left",
                      "lineHeight": "150%",
                      "text": "<div style=\"background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; padding: 30px; color: white;\"><h3 style=\"margin: 0 0 20px 0; color: white; font-size: 18px; font-weight: 600;\">✨ 现在您可以：</h3><ul style=\"margin: 0; padding: 0; list-style: none;\"><li style=\"margin: 0 0 12px 0; padding: 0 0 0 24px; position: relative;\"><span style=\"position: absolute; left: 0; top: 2px;\">🚀</span> 探索我们的完整功能</li><li style=\"margin: 0 0 12px 0; padding: 0 0 0 24px; position: relative;\"><span style=\"position: absolute; left: 0; top: 2px;\">📊</span> 访问个人仪表板</li><li style=\"margin: 0 0 12px 0; padding: 0 0 0 24px; position: relative;\"><span style=\"position: absolute; left: 0; top: 2px;\">🔧</span> 自定义您的偏好设置</li><li style=\"margin: 0; padding: 0 0 0 24px; position: relative;\"><span style=\"position: absolute; left: 0; top: 2px;\">💬</span> 获得专业技术支持</li></ul></div>"
                    }
                  },
                  {
                    "id": "registration-cta",
                    "type": "button",
                    "values": {
                      "containerPadding": "0px 40px 40px",
                      "href": {
                        "name": "web",
                        "values": {
                          "href": "{{login_url}}",
                          "target": "_blank"
                        }
                      },
                      "buttonColors": {
                        "color": "#ffffff",
                        "backgroundColor": "#3b82f6",
                        "hoverColor": "#ffffff",
                        "hoverBackgroundColor": "#2563eb"
                      },
                      "size": {
                        "autoWidth": true,
                        "width": "100%"
                      },
                      "fontSize": "16px",
                      "textAlign": "center",
                      "lineHeight": "120%",
                      "padding": "16px 32px",
                      "borderRadius": "8px",
                      "text": "<span style=\"line-height: 19.2px; font-weight: 600;\">立即开始使用</span>"
                    }
                  }
                ],
                "values": {
                  "backgroundColor": "#ffffff",
                  "padding": "0px",
                  "borderRadius": "12px"
                }
              }
            ],
            "values": {
              "backgroundColor": "#f8fafc",
              "padding": "20px"
            }
          },
          {
            "id": "registration-footer",
            "cells": [1],
            "columns": [
              {
                "id": "registration-footer-col",
                "contents": [
                  {
                    "id": "registration-divider",
                    "type": "divider",
                    "values": {
                      "containerPadding": "20px 40px",
                      "width": "100%",
                      "border": {
                        "borderTopWidth": "1px",
                        "borderTopStyle": "solid",
                        "borderTopColor": "#e2e8f0"
                      }
                    }
                  },
                  {
                    "id": "registration-footer-text",
                    "type": "text",
                    "values": {
                      "containerPadding": "0px 40px 40px",
                      "fontSize": "14px",
                      "textAlign": "center",
                      "lineHeight": "150%",
                      "text": "<p style=\"margin: 0; color: #94a3b8; font-size: 14px; line-height: 21px;\">如果您有任何问题，请随时 <a href=\"mailto:support@example.com\" style=\"color: #3b82f6; text-decoration: none;\">联系我们的支持团队</a></p><p style=\"margin: 10px 0 0 0; color: #94a3b8; font-size: 12px; line-height: 18px;\">© 2024 Your Company. 保留所有权利。</p>"
                    }
                  }
                ]
              }
            ],
            "values": {
              "backgroundColor": "#f8fafc",
              "padding": "0px"
            }
          }
        ],
        "values": {
          "contentWidth": "600px",
          "fontFamily": {
            "label": "Inter",
            "value": "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          },
          "textColor": "#1e293b",
          "backgroundColor": "#f8fafc"
        }
      }
    }
  },
  {
    id: 'login-success',
    name: '登录成功',
    description: '用户成功登录的通知邮件模板',
    thumbnail: '/templates/login-success-thumb.png',
    isActive: true,
    design: {
      "counters": {
        "u_column": 1,
        "u_row": 2,
        "u_content_text": 3,
        "u_content_button": 1
      },
      "body": {
        "id": "login-success-body",
        "rows": [
          {
            "id": "login-success-header",
            "cells": [1],
            "columns": [
              {
                "id": "login-success-header-col",
                "contents": [
                  {
                    "id": "login-success-title",
                    "type": "text",
                    "values": {
                      "containerPadding": "40px 40px 20px",
                      "fontSize": "24px",
                      "textAlign": "center",
                      "lineHeight": "130%",
                      "fontWeight": "bold",
                      "text": "<h1 style=\"margin: 0; color: #059669; font-size: 24px; line-height: 31.2px; font-weight: 700;\">✅ 登录成功</h1>"
                    }
                  }
                ],
                "values": {
                  "backgroundColor": "#ffffff",
                  "padding": "0px",
                  "borderRadius": "12px 12px 0 0"
                }
              }
            ]
          },
          {
            "id": "login-success-content",
            "cells": [1],
            "columns": [
              {
                "id": "login-success-content-col",
                "contents": [
                  {
                    "id": "login-success-message",
                    "type": "text",
                    "values": {
                      "containerPadding": "0px 40px 30px",
                      "fontSize": "16px",
                      "textAlign": "left",
                      "lineHeight": "150%",
                      "text": "<p style=\"margin: 0; color: #374151; font-size: 16px; line-height: 24px;\">您好 <strong style=\"color: #1f2937;\">{{username}}</strong>，</p><p style=\"margin: 15px 0 0 0; color: #374151; font-size: 16px; line-height: 24px;\">您已成功登录到您的账户。</p>"
                    }
                  },
                  {
                    "id": "login-success-details",
                    "type": "text",
                    "values": {
                      "containerPadding": "0px 40px 30px",
                      "fontSize": "14px",
                      "textAlign": "left",
                      "lineHeight": "150%",
                      "text": "<div style=\"background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px;\"><h4 style=\"margin: 0 0 15px 0; color: #166534; font-size: 16px; font-weight: 600;\">登录详情：</h4><table style=\"width: 100%; border-collapse: collapse;\"><tr><td style=\"padding: 8px 0; color: #374151; font-size: 14px; border-bottom: 1px solid #d1fae5;\"><strong>登录时间：</strong></td><td style=\"padding: 8px 0; color: #374151; font-size: 14px; border-bottom: 1px solid #d1fae5; text-align: right;\">{{login_time}}</td></tr><tr><td style=\"padding: 8px 0; color: #374151; font-size: 14px; border-bottom: 1px solid #d1fae5;\"><strong>IP 地址：</strong></td><td style=\"padding: 8px 0; color: #374151; font-size: 14px; border-bottom: 1px solid #d1fae5; text-align: right;\">{{ip_address}}</td></tr><tr><td style=\"padding: 8px 0; color: #374151; font-size: 14px;\"><strong>设备：</strong></td><td style=\"padding: 8px 0; color: #374151; font-size: 14px; text-align: right;\">{{device_info}}</td></tr></table></div>"
                    }
                  },
                  {
                    "id": "login-success-security",
                    "type": "text",
                    "values": {
                      "containerPadding": "0px 40px 30px",
                      "fontSize": "14px",
                      "textAlign": "left",
                      "lineHeight": "150%",
                      "text": "<p style=\"margin: 0; color: #6b7280; font-size: 14px; line-height: 21px;\">如果这次登录不是您本人操作，请立即更改密码并联系我们的支持团队。</p>"
                    }
                  },
                  {
                    "id": "login-success-cta",
                    "type": "button",
                    "values": {
                      "containerPadding": "0px 40px 40px",
                      "href": {
                        "name": "web",
                        "values": {
                          "href": "{{dashboard_url}}",
                          "target": "_blank"
                        }
                      },
                      "buttonColors": {
                        "color": "#ffffff",
                        "backgroundColor": "#059669",
                        "hoverColor": "#ffffff",
                        "hoverBackgroundColor": "#047857"
                      },
                      "size": {
                        "autoWidth": true,
                        "width": "100%"
                      },
                      "fontSize": "16px",
                      "textAlign": "center",
                      "lineHeight": "120%",
                      "padding": "14px 28px",
                      "borderRadius": "8px",
                      "text": "<span style=\"line-height: 19.2px; font-weight: 600;\">访问仪表板</span>"
                    }
                  }
                ],
                "values": {
                  "backgroundColor": "#ffffff",
                  "padding": "0px",
                  "borderRadius": "0 0 12px 12px"
                }
              }
            ]
          }
        ],
        "values": {
          "contentWidth": "600px",
          "fontFamily": {
            "label": "Inter",
            "value": "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          },
          "textColor": "#1f2937",
          "backgroundColor": "#f9fafb"
        }
      }
    }
  },
  {
    id: 'login-ip-change',
    name: '登录IP变更',
    description: '检测到异常登录IP的安全警告邮件模板',
    thumbnail: '/templates/ip-change-thumb.png',
    isActive: true,
    design: {
      "counters": {
        "u_column": 1,
        "u_row": 2,
        "u_content_text": 4,
        "u_content_button": 2
      },
      "body": {
        "id": "ip-change-body",
        "rows": [
          {
            "id": "ip-change-header",
            "cells": [1],
            "columns": [
              {
                "id": "ip-change-header-col",
                "contents": [
                  {
                    "id": "ip-change-title",
                    "type": "text",
                    "values": {
                      "containerPadding": "40px 40px 20px",
                      "fontSize": "24px",
                      "textAlign": "center",
                      "lineHeight": "130%",
                      "fontWeight": "bold",
                      "text": "<h1 style=\"margin: 0; color: #dc2626; font-size: 24px; line-height: 31.2px; font-weight: 700;\">🔐 安全警告</h1>"
                    }
                  }
                ],
                "values": {
                  "backgroundColor": "#ffffff",
                  "padding": "0px",
                  "borderRadius": "12px 12px 0 0"
                }
              }
            ]
          },
          {
            "id": "ip-change-content",
            "cells": [1],
            "columns": [
              {
                "id": "ip-change-content-col",
                "contents": [
                  {
                    "id": "ip-change-alert",
                    "type": "text",
                    "values": {
                      "containerPadding": "0px 40px 30px",
                      "fontSize": "16px",
                      "textAlign": "left",
                      "lineHeight": "150%",
                      "text": "<div style=\"background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); border-left: 4px solid #dc2626; border-radius: 8px; padding: 20px;\"><p style=\"margin: 0; color: #991b1b; font-size: 16px; line-height: 24px; font-weight: 600;\">⚠️ 检测到异常登录活动</p><p style=\"margin: 15px 0 0 0; color: #7f1d1d; font-size: 14px; line-height: 21px;\">我们检测到您的账户从一个新的IP地址登录。</p></div>"
                    }
                  },
                  {
                    "id": "ip-change-message",
                    "type": "text",
                    "values": {
                      "containerPadding": "0px 40px 30px",
                      "fontSize": "16px",
                      "textAlign": "left",
                      "lineHeight": "150%",
                      "text": "<p style=\"margin: 0; color: #374151; font-size: 16px; line-height: 24px;\">您好 <strong style=\"color: #1f2937;\">{{username}}</strong>，</p><p style=\"margin: 15px 0 0 0; color: #374151; font-size: 16px; line-height: 24px;\">我们注意到您的账户从一个新的位置登录。如果这是您本人操作，请忽略此邮件。</p>"
                    }
                  },
                  {
                    "id": "ip-change-details",
                    "type": "text",
                    "values": {
                      "containerPadding": "0px 40px 30px",
                      "fontSize": "14px",
                      "textAlign": "left",
                      "lineHeight": "150%",
                      "text": "<div style=\"background-color: #fafafa; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px;\"><h4 style=\"margin: 0 0 15px 0; color: #1f2937; font-size: 16px; font-weight: 600;\">登录详情：</h4><table style=\"width: 100%; border-collapse: collapse;\"><tr><td style=\"padding: 8px 0; color: #374151; font-size: 14px; border-bottom: 1px solid #e5e7eb;\"><strong>登录时间：</strong></td><td style=\"padding: 8px 0; color: #374151; font-size: 14px; border-bottom: 1px solid #e5e7eb; text-align: right;\">{{login_time}}</td></tr><tr><td style=\"padding: 8px 0; color: #374151; font-size: 14px; border-bottom: 1px solid #e5e7eb;\"><strong>新 IP 地址：</strong></td><td style=\"padding: 8px 0; color: #dc2626; font-size: 14px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600;\">{{new_ip_address}}</td></tr><tr><td style=\"padding: 8px 0; color: #374151; font-size: 14px; border-bottom: 1px solid #e5e7eb;\"><strong>位置：</strong></td><td style=\"padding: 8px 0; color: #374151; font-size: 14px; border-bottom: 1px solid #e5e7eb; text-align: right;\">{{location}}</td></tr><tr><td style=\"padding: 8px 0; color: #374151; font-size: 14px;\"><strong>设备：</strong></td><td style=\"padding: 8px 0; color: #374151; font-size: 14px; text-align: right;\">{{device_info}}</td></tr></table></div>"
                    }
                  },
                  {
                    "id": "ip-change-warning",
                    "type": "text",
                    "values": {
                      "containerPadding": "0px 40px 30px",
                      "fontSize": "16px",
                      "textAlign": "left",
                      "lineHeight": "150%",
                      "text": "<p style=\"margin: 0; color: #dc2626; font-size: 16px; line-height: 24px; font-weight: 600;\">如果这不是您本人操作：</p><ul style=\"margin: 10px 0 0 20px; color: #374151; font-size: 14px; line-height: 21px;\"><li style=\"margin-bottom: 8px;\">立即更改您的密码</li><li style=\"margin-bottom: 8px;\">检查您的账户是否有异常活动</li><li style=\"margin-bottom: 8px;\">启用两步验证（如果尚未启用）</li><li>联系我们的支持团队</li></ul>"
                    }
                  },
                  {
                    "id": "ip-change-cta-container",
                    "type": "text",
                    "values": {
                      "containerPadding": "0px 40px 40px",
                      "fontSize": "16px",
                      "textAlign": "center",
                      "lineHeight": "150%",
                      "text": "<table style=\"width: 100%; border-collapse: collapse;\"><tr><td style=\"width: 48%; padding-right: 2%;\"><a href=\"{{change_password_url}}\" style=\"display: inline-block; width: 100%; background-color: #dc2626; color: white; text-decoration: none; padding: 14px 20px; border-radius: 8px; font-weight: 600; text-align: center; font-size: 14px;\">立即更改密码</a></td><td style=\"width: 48%; padding-left: 2%;\"><a href=\"{{contact_support_url}}\" style=\"display: inline-block; width: 100%; background-color: #6b7280; color: white; text-decoration: none; padding: 14px 20px; border-radius: 8px; font-weight: 600; text-align: center; font-size: 14px;\">联系支持</a></td></tr></table>"
                    }
                  }
                ],
                "values": {
                  "backgroundColor": "#ffffff",
                  "padding": "0px",
                  "borderRadius": "0 0 12px 12px"
                }
              }
            ]
          }
        ],
        "values": {
          "contentWidth": "600px",
          "fontFamily": {
            "label": "Inter",
            "value": "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          },
          "textColor": "#1f2937",
          "backgroundColor": "#f9fafb"
        }
      }
    }
  },
  {
    id: 'email-verification',
    name: '邮箱验证码',
    description: '邮箱验证码邮件模板',
    thumbnail: '/templates/verification-thumb.png',
    isActive: true,
    design: {
      "counters": {
        "u_column": 1,
        "u_row": 2,
        "u_content_text": 4,
        "u_content_button": 1
      },
      "body": {
        "id": "verification-body",
        "rows": [
          {
            "id": "verification-header",
            "cells": [1],
            "columns": [
              {
                "id": "verification-header-col",
                "contents": [
                  {
                    "id": "verification-title",
                    "type": "text",
                    "values": {
                      "containerPadding": "40px 40px 20px",
                      "fontSize": "24px",
                      "textAlign": "center",
                      "lineHeight": "130%",
                      "fontWeight": "bold",
                      "text": "<h1 style=\"margin: 0; color: #7c3aed; font-size: 24px; line-height: 31.2px; font-weight: 700;\">📧 邮箱验证</h1>"
                    }
                  }
                ],
                "values": {
                  "backgroundColor": "#ffffff",
                  "padding": "0px",
                  "borderRadius": "12px 12px 0 0"
                }
              }
            ]
          },
          {
            "id": "verification-content",
            "cells": [1],
            "columns": [
              {
                "id": "verification-content-col",
                "contents": [
                  {
                    "id": "verification-message",
                    "type": "text",
                    "values": {
                      "containerPadding": "0px 40px 30px",
                      "fontSize": "16px",
                      "textAlign": "left",
                      "lineHeight": "150%",
                      "text": "<p style=\"margin: 0; color: #374151; font-size: 16px; line-height: 24px;\">您好，</p><p style=\"margin: 15px 0 0 0; color: #374151; font-size: 16px; line-height: 24px;\">您请求了邮箱验证。请使用以下验证码完成验证：</p>"
                    }
                  },
                  {
                    "id": "verification-code",
                    "type": "text",
                    "values": {
                      "containerPadding": "0px 40px 30px",
                      "fontSize": "32px",
                      "textAlign": "center",
                      "lineHeight": "120%",
                      "text": "<div style=\"background: linear-gradient(135deg, #a855f7 0%, #7c3aed 100%); border-radius: 12px; padding: 30px; margin: 20px 0;\"><div style=\"background-color: rgba(255, 255, 255, 0.15); border: 2px dashed rgba(255, 255, 255, 0.3); border-radius: 8px; padding: 20px;\"><p style=\"margin: 0; color: white; font-size: 36px; font-weight: 800; letter-spacing: 8px; font-family: 'Courier New', monospace;\">{{verification_code}}</p></div></div>"
                    }
                  },
                  {
                    "id": "verification-instructions",
                    "type": "text",
                    "values": {
                      "containerPadding": "0px 40px 30px",
                      "fontSize": "16px",
                      "textAlign": "left",
                      "lineHeight": "150%",
                      "text": "<div style=\"background-color: #faf5ff; border: 1px solid #e9d5ff; border-radius: 8px; padding: 20px;\"><h4 style=\"margin: 0 0 15px 0; color: #6b21a8; font-size: 16px; font-weight: 600;\">📝 使用说明：</h4><ul style=\"margin: 0; padding: 0 0 0 20px; color: #581c87; font-size: 14px; line-height: 21px;\"><li style=\"margin-bottom: 8px;\">请在验证页面输入上述6位数字验证码</li><li style=\"margin-bottom: 8px;\">验证码有效期为 <strong>10分钟</strong></li><li style=\"margin-bottom: 8px;\">验证码区分大小写，请准确输入</li><li>如果验证码过期，请重新申请</li></ul></div>"
                    }
                  },
                  {
                    "id": "verification-security",
                    "type": "text",
                    "values": {
                      "containerPadding": "0px 40px 30px",
                      "fontSize": "14px",
                      "textAlign": "left",
                      "lineHeight": "150%",
                      "text": "<p style=\"margin: 0; color: #dc2626; font-size: 14px; line-height: 21px; font-weight: 600;\">⚠️ 安全提醒：</p><p style=\"margin: 10px 0 0 0; color: #6b7280; font-size: 14px; line-height: 21px;\">如果您没有请求此验证码，请忽略此邮件。请不要将验证码分享给任何人。</p>"
                    }
                  },
                  {
                    "id": "verification-cta",
                    "type": "button",
                    "values": {
                      "containerPadding": "0px 40px 40px",
                      "href": {
                        "name": "web",
                        "values": {
                          "href": "{{verification_url}}",
                          "target": "_blank"
                        }
                      },
                      "buttonColors": {
                        "color": "#ffffff",
                        "backgroundColor": "#7c3aed",
                        "hoverColor": "#ffffff",
                        "hoverBackgroundColor": "#6d28d9"
                      },
                      "size": {
                        "autoWidth": true,
                        "width": "100%"
                      },
                      "fontSize": "16px",
                      "textAlign": "center",
                      "lineHeight": "120%",
                      "padding": "16px 32px",
                      "borderRadius": "8px",
                      "text": "<span style=\"line-height: 19.2px; font-weight: 600;\">前往验证页面</span>"
                    }
                  }
                ],
                "values": {
                  "backgroundColor": "#ffffff",
                  "padding": "0px",
                  "borderRadius": "0 0 12px 12px"
                }
              }
            ]
          }
        ],
        "values": {
          "contentWidth": "600px",
          "fontFamily": {
            "label": "Inter",
            "value": "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          },
          "textColor": "#1f2937",
          "backgroundColor": "#f9fafb"
        }
      }
    }
  },
  {
    id: 'password-reset',
    name: '密码重置',
    description: '密码重置邮件模板',
    thumbnail: '/templates/password-reset-thumb.png',
    isActive: true,
    design: {
      "counters": {
        "u_column": 1,
        "u_row": 2,
        "u_content_text": 3,
        "u_content_button": 1
      },
      "body": {
        "id": "password-reset-body",
        "rows": [
          {
            "id": "password-reset-header",
            "cells": [1],
            "columns": [
              {
                "id": "password-reset-header-col",
                "contents": [
                  {
                    "id": "password-reset-title",
                    "type": "text",
                    "values": {
                      "containerPadding": "40px 40px 20px",
                      "fontSize": "24px",
                      "textAlign": "center",
                      "lineHeight": "130%",
                      "fontWeight": "bold",
                      "text": "<h1 style=\"margin: 0; color: #f59e0b; font-size: 24px; line-height: 31.2px; font-weight: 700;\">🔑 重置密码</h1>"
                    }
                  }
                ],
                "values": {
                  "backgroundColor": "#ffffff",
                  "padding": "0px",
                  "borderRadius": "12px 12px 0 0"
                }
              }
            ]
          },
          {
            "id": "password-reset-content",
            "cells": [1],
            "columns": [
              {
                "id": "password-reset-content-col",
                "contents": [
                  {
                    "id": "password-reset-message",
                    "type": "text",
                    "values": {
                      "containerPadding": "0px 40px 30px",
                      "fontSize": "16px",
                      "textAlign": "left",
                      "lineHeight": "150%",
                      "text": "<p style=\"margin: 0; color: #374151; font-size: 16px; line-height: 24px;\">您好 <strong style=\"color: #1f2937;\">{{username}}</strong>，</p><p style=\"margin: 15px 0 0 0; color: #374151; font-size: 16px; line-height: 24px;\">我们收到了您重置密码的请求。点击下面的按钮来设置新密码：</p>"
                    }
                  },
                  {
                    "id": "password-reset-info",
                    "type": "text",
                    "values": {
                      "containerPadding": "0px 40px 30px",
                      "fontSize": "14px",
                      "textAlign": "left",
                      "lineHeight": "150%",
                      "text": "<div style=\"background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-left: 4px solid #f59e0b; border-radius: 8px; padding: 20px;\"><h4 style=\"margin: 0 0 15px 0; color: #92400e; font-size: 16px; font-weight: 600;\">⏰ 重要提醒：</h4><ul style=\"margin: 0; padding: 0 0 0 20px; color: #a16207; font-size: 14px; line-height: 21px;\"><li style=\"margin-bottom: 8px;\">此重置链接将在 <strong>1小时</strong> 后过期</li><li style=\"margin-bottom: 8px;\">为了您的安全，链接只能使用一次</li><li>如果您没有请求重置密码，请忽略此邮件</li></ul></div>"
                    }
                  },
                  {
                    "id": "password-reset-security",
                    "type": "text",
                    "values": {
                      "containerPadding": "0px 40px 30px",
                      "fontSize": "14px",
                      "textAlign": "left",
                      "lineHeight": "150%",
                      "text": "<p style=\"margin: 0; color: #6b7280; font-size: 14px; line-height: 21px;\">如果您无法点击按钮，请复制以下链接到浏览器地址栏：</p><p style=\"margin: 10px 0 0 0; color: #3b82f6; font-size: 12px; line-height: 18px; word-break: break-all; background-color: #f3f4f6; padding: 10px; border-radius: 4px; font-family: monospace;\">{{reset_url}}</p>"
                    }
                  },
                  {
                    "id": "password-reset-cta",
                    "type": "button",
                    "values": {
                      "containerPadding": "0px 40px 40px",
                      "href": {
                        "name": "web",
                        "values": {
                          "href": "{{reset_url}}",
                          "target": "_blank"
                        }
                      },
                      "buttonColors": {
                        "color": "#ffffff",
                        "backgroundColor": "#f59e0b",
                        "hoverColor": "#ffffff",
                        "hoverBackgroundColor": "#d97706"
                      },
                      "size": {
                        "autoWidth": true,
                        "width": "100%"
                      },
                      "fontSize": "16px",
                      "textAlign": "center",
                      "lineHeight": "120%",
                      "padding": "16px 32px",
                      "borderRadius": "8px",
                      "text": "<span style=\"line-height: 19.2px; font-weight: 600;\">重置我的密码</span>"
                    }
                  }
                ],
                "values": {
                  "backgroundColor": "#ffffff",
                  "padding": "0px",
                  "borderRadius": "0 0 12px 12px"
                }
              }
            ]
          }
        ],
        "values": {
          "contentWidth": "600px",
          "fontFamily": {
            "label": "Inter",
            "value": "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          },
          "textColor": "#1f2937",
          "backgroundColor": "#f9fafb"
        }
      }
    }
  },
  {
    id: 'blank',
    name: '空白模板',
    description: '从空白模板开始创建您的邮件',
    thumbnail: '/templates/blank-thumb.png',
    isActive: true,
    design: {
      "counters": {
        "u_column": 1,
        "u_row": 1,
        "u_content_text": 1
      },
      "body": {
        "id": "blank-body",
        "rows": [
          {
            "id": "blank-row",
            "cells": [1],
            "columns": [
              {
                "id": "blank-col",
                "contents": [
                  {
                    "id": "blank-text",
                    "type": "text",
                    "values": {
                      "containerPadding": "60px 40px",
                      "fontSize": "16px",
                      "textAlign": "center",
                      "lineHeight": "150%",
                      "text": "<p style=\"margin: 0; color: #9ca3af; font-size: 16px; line-height: 24px;\">✨ 开始编辑您的邮件内容...</p><p style=\"margin: 10px 0 0 0; color: #d1d5db; font-size: 14px; line-height: 21px;\">从这里开始创建您的精美邮件</p>"
                    }
                  }
                ]
              }
            ]
          }
        ],
        "values": {
          "contentWidth": "600px",
          "fontFamily": {
            "label": "Inter",
            "value": "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          },
          "textColor": "#374151",
          "backgroundColor": "#ffffff"
        }
      }
    }
  }
]

// 使用说明：
// 1. 这些模板是之前系统中的预设模板
// 2. 可以根据需要在模板管理页面手动添加
// 3. 每个模板都包含完整的设计JSON和变量支持
// 4. 所有模板都采用现代化设计，支持响应式布局