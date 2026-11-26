window.OASeed = {
  "employees": [
    {
      "jobNo": "M001",
      "name": "演示主管甲",
      "phone": "138****0001",
      "dept": "研发中心",
      "post": "研发经理",
      "supervisor": "总经理",
      "role": "主管",
      "status": "启用",
      "remark": "主管账号；团队审批、报表与系统管理权限",
      "email": "m001@example.com"
    },
    {
      "jobNo": "M002",
      "name": "演示主管乙",
      "phone": "138****0002",
      "dept": "运营部",
      "post": "运营主管",
      "supervisor": "总经理",
      "role": "主管",
      "status": "启用",
      "remark": "主管账号；用于登录用户切换",
      "email": "m002@example.com"
    },
    {
      "jobNo": "E001",
      "name": "演示员工甲",
      "phone": "138****8901",
      "dept": "产品部",
      "post": "产品经理",
      "supervisor": "演示主管甲",
      "role": "员工",
      "status": "启用",
      "remark": "核心需求负责人",
      "email": "e001@example.com"
    },
    {
      "jobNo": "E002",
      "name": "演示员工乙",
      "phone": "139****8902",
      "dept": "研发一部",
      "post": "前端工程师",
      "supervisor": "演示主管甲",
      "role": "员工",
      "status": "启用",
      "remark": "前端开发",
      "email": "e002@example.com"
    },
    {
      "jobNo": "E003",
      "name": "演示员工丙",
      "phone": "137****8903",
      "dept": "研发二部",
      "post": "后端工程师",
      "supervisor": "演示主管丙",
      "role": "员工",
      "status": "启用",
      "remark": "接口开发",
      "email": "e003@example.com"
    },
    {
      "jobNo": "E004",
      "name": "演示员工丁",
      "phone": "136****8904",
      "dept": "产品部",
      "post": "测试工程师",
      "supervisor": "演示主管甲",
      "role": "员工",
      "status": "启用",
      "remark": "测试支持",
      "email": "e004@example.com"
    },
    {
      "jobNo": "E005",
      "name": "演示主管丙",
      "phone": "135****8905",
      "dept": "研发中心",
      "post": "研发主管",
      "supervisor": "总经理",
      "role": "主管",
      "status": "启用",
      "remark": "审批人",
      "email": "e005@example.com"
    },
    {
      "jobNo": "E006",
      "name": "演示员工戊",
      "phone": "134****8906",
      "dept": "产品部",
      "post": "产品经理",
      "supervisor": "演示主管甲",
      "role": "员工",
      "status": "停用",
      "remark": "历史数据保留",
      "email": "e006@example.com"
    }
  ],
  "applications": [
    {
      "id": "A001",
      "no": "JB20260612001",
      "type": "加班申请",
      "applicant": "演示员工甲",
      "jobNo": "E001",
      "dept": "产品部",
      "period": "2026-06-12 - 2026-06-12",
      "start": "2026-06-12",
      "end": "2026-06-12",
      "hours": 4,
      "reason": "项目上线支持",
      "submittedAt": "2026-06-10 09:30",
      "status": "待审批",
      "balance": 26,
      "remark": "生产环境发布窗口支持",
      "details": [
        {
          "date": "2026-06-12",
          "period": "晚上",
          "start": "18:30",
          "end": "22:30",
          "hours": 4
        }
      ],
      "approval": [],
      "ruleHit": "R001 单次最大加班8h；最小单位1h"
    },
    {
      "id": "A002",
      "no": "TX20260616001",
      "type": "调休申请",
      "applicant": "演示员工甲",
      "jobNo": "E001",
      "dept": "产品部",
      "period": "2026-06-16 - 2026-06-17",
      "start": "2026-06-16",
      "end": "2026-06-17",
      "hours": 12,
      "reason": "家庭事务",
      "submittedAt": "2026-06-10 10:20",
      "status": "待审批",
      "balance": 26,
      "remark": "跨日调休，按日期拆分",
      "details": [
        {
          "date": "2026-06-16",
          "period": "全天",
          "start": "09:00",
          "end": "18:00",
          "hours": 8
        },
        {
          "date": "2026-06-17",
          "period": "上午",
          "start": "09:00",
          "end": "13:00",
          "hours": 4
        }
      ],
      "approval": [],
      "ruleHit": "R002 跨日调休按日期拆分；R003 余额足够"
    },
    {
      "id": "A003",
      "no": "JB20260603002",
      "type": "加班申请",
      "applicant": "演示员工乙",
      "jobNo": "E002",
      "dept": "研发一部",
      "period": "2026-06-03 - 2026-06-03",
      "start": "2026-06-03",
      "end": "2026-06-03",
      "hours": 6,
      "reason": "紧急问题处理",
      "submittedAt": "2026-06-03 20:10",
      "status": "已通过",
      "balance": 18,
      "remark": "线上缺陷修复",
      "details": [
        {
          "date": "2026-06-03",
          "period": "晚上",
          "start": "18:00",
          "end": "24:00",
          "hours": 6
        }
      ],
      "approval": [
        {
          "node": 1,
          "approver": "演示主管甲",
          "role": "直属主管",
          "result": "通过",
          "opinion": "同意，已核对加班明细。",
          "time": "2026-06-04 09:15"
        }
      ],
      "ruleHit": "R001 单次最大加班8h；最小单位1h"
    },
    {
      "id": "A004",
      "no": "TX20260605001",
      "type": "调休申请",
      "applicant": "演示员工丙",
      "jobNo": "E003",
      "dept": "研发二部",
      "period": "2026-06-05 - 2026-06-05",
      "start": "2026-06-05",
      "end": "2026-06-05",
      "hours": 8,
      "reason": "个人事务",
      "submittedAt": "2026-06-02 08:50",
      "status": "已驳回",
      "balance": 2,
      "remark": "余额不足但允许提交提醒",
      "details": [
        {
          "date": "2026-06-05",
          "period": "全天",
          "start": "09:00",
          "end": "18:00",
          "hours": 8
        }
      ],
      "approval": [
        {
          "node": 1,
          "approver": "演示主管甲",
          "role": "直属主管",
          "result": "驳回",
          "opinion": "当前剩余调休余额不足，请调整调休时长后重新提交。",
          "time": "2026-06-02 11:30"
        }
      ],
      "ruleHit": "R003 余额不足允许提交但审批提醒"
    },
    {
      "id": "A005",
      "no": "JB20260608001",
      "type": "加班申请",
      "applicant": "演示员工丁",
      "jobNo": "E004",
      "dept": "产品部",
      "period": "2026-06-08 - 2026-06-08",
      "start": "2026-06-08",
      "end": "2026-06-08",
      "hours": 3,
      "reason": "验收测试支持",
      "submittedAt": "2026-06-08 21:10",
      "status": "草稿",
      "balance": 8,
      "remark": "待补充说明",
      "details": [
        {
          "date": "2026-06-08",
          "period": "晚上",
          "start": "19:00",
          "end": "22:00",
          "hours": 3
        }
      ],
      "approval": [],
      "ruleHit": "R001 单次最大加班8h；最小单位1h"
    },
    {
      "id": "A006",
      "no": "TX20260527003",
      "type": "调休申请",
      "applicant": "演示员工甲",
      "jobNo": "E001",
      "dept": "产品部",
      "period": "2026-05-27 - 2026-05-27",
      "start": "2026-05-27",
      "end": "2026-05-27",
      "hours": 4,
      "reason": "医院预约",
      "submittedAt": "2026-05-24 12:10",
      "status": "草稿",
      "balance": 30,
      "remark": "撤回后回到草稿，可重新编辑提交",
      "details": [
        {
          "date": "2026-05-27",
          "period": "下午",
          "start": "14:00",
          "end": "18:00",
          "hours": 4
        }
      ],
      "approval": [],
      "ruleHit": "R002 调休明细必填"
    },
    {
      "id": "A007",
      "no": "TX20260618001",
      "type": "调休申请",
      "applicant": "演示员工乙",
      "jobNo": "E002",
      "dept": "研发一部",
      "period": "2026-06-18 - 2026-06-19",
      "start": "2026-06-18",
      "end": "2026-06-19",
      "hours": 12,
      "reason": "跨日调休",
      "submittedAt": "2026-06-15 09:20",
      "status": "已通过",
      "balance": 38,
      "remark": "用于报表调休申请明细日期拆分示例",
      "details": [
        {
          "date": "2026-06-18",
          "period": "全天",
          "start": "09:00",
          "end": "18:00",
          "hours": 8
        },
        {
          "date": "2026-06-19",
          "period": "上午",
          "start": "09:00",
          "end": "13:00",
          "hours": 4
        }
      ],
      "approval": [
        {
          "approver": "演示主管甲",
          "result": "通过",
          "opinion": "同意，调休余额充足，明细已按日期拆分。",
          "time": "2026-06-15 10:05"
        }
      ],
      "ruleHit": "R002 跨日调休按日期拆分；R003 余额足够"
    }
  ],
  "roles": [
    {
      "id": "R01",
      "name": "主管",
      "desc": "负责审批、统计和系统配置管理权限",
      "dataScope": "所有数据",
      "moduleCount": 12,
      "status": "启用",
      "updatedAt": "2026-06-09 10:25",
      "permissions": [
        "主管工作台",
        "加班调休申请",
        "报表统计",
        "我的待办",
        "审批记录查询",
        "员工信息管理",
        "角色权限配置",
        "部门管理",
        "规则流程配置",
        "消息管理",
        "操作日志管理",
        "导出",
        "审批",
        "规则编辑"
      ]
    },
    {
      "id": "R02",
      "name": "员工",
      "desc": "负责个人申请、个人报表和员工工作台查看",
      "dataScope": "本人",
      "moduleCount": 4,
      "status": "启用",
      "updatedAt": "2026-06-09 09:16",
      "permissions": [
        "员工工作台",
        "加班调休申请",
        "报表统计",
        "申请新增",
        "申请撤回"
      ]
    }
  ],
  "departments": [
    {
      "code": "D001",
      "name": "总部",
      "parent": "-",
      "leader": "总经理",
      "count": 86,
      "status": "启用"
    },
    {
      "code": "D010",
      "name": "研发中心",
      "parent": "总部",
      "leader": "演示主管丙",
      "count": 45,
      "status": "启用"
    },
    {
      "code": "D011",
      "name": "研发一部",
      "parent": "研发中心",
      "leader": "演示经理甲",
      "count": 18,
      "status": "启用"
    },
    {
      "code": "D012",
      "name": "研发二部",
      "parent": "研发中心",
      "leader": "演示部门主管",
      "count": 17,
      "status": "启用"
    },
    {
      "code": "D020",
      "name": "产品中心",
      "parent": "总部",
      "leader": "演示主管甲",
      "count": 26,
      "status": "启用"
    },
    {
      "code": "D021",
      "name": "产品部",
      "parent": "产品中心",
      "leader": "演示主管甲",
      "count": 16,
      "status": "启用"
    },
    {
      "code": "D030",
      "name": "运维中心",
      "parent": "总部",
      "leader": "演示经理乙",
      "count": 15,
      "status": "停用"
    }
  ],
  "rules": [
    {
      "id": "R001",
      "group": "时长规则",
      "template": "加班时长规则",
      "name": "单次加班时长上限",
      "object": "加班申请",
      "scope": "全公司；部门可覆盖",
      "params": "默认最大8h；最小单位1h；超上限禁止提交",
      "ref": "新增/编辑加班、申请详情、报表统计",
      "version": "V1",
      "status": "启用",
      "effective": "2026-06-01",
      "expire": "长期",
      "priority": "10"
    },
    {
      "id": "R002",
      "group": "时长规则",
      "template": "调休时长规则",
      "name": "跨日调休日期拆分",
      "object": "调休申请",
      "scope": "全公司",
      "params": "允许跨日；日期拆分；最小单位1h；调休明细必填",
      "ref": "新增/编辑调休、审批处理、调休明细报表",
      "version": "V1",
      "status": "启用",
      "effective": "2026-06-01",
      "expire": "长期",
      "priority": "20"
    },
    {
      "id": "R003",
      "group": "余额规则",
      "template": "剩余调休时长计算规则",
      "name": "余额不足允许提交但提醒",
      "object": "调休申请",
      "scope": "全公司",
      "params": "累计剩余调休余额=历史余额+年度加班-年度调休；余额不足允许提交；提交提醒；审批提醒",
      "ref": "工作台、申请、审批、报表汇总",
      "version": "V1",
      "status": "启用",
      "effective": "2026-06-01",
      "expire": "长期",
      "priority": "30"
    },
    {
      "id": "R004",
      "group": "审批流程规则",
      "template": "审批流程规则",
      "name": "直属主管一级审批",
      "object": "加班/调休申请",
      "scope": "全公司",
      "params": "审批节点=直属主管；一级审批",
      "ref": "我的待办、审批记录查询、消息管理",
      "version": "V1",
      "status": "启用",
      "effective": "2026-06-01",
      "expire": "长期",
      "priority": "40"
    },
    {
      "id": "R005",
      "group": "消息触发规则",
      "template": "消息触发规则",
      "name": "审批完成通知规则",
      "object": "加班/调休申请",
      "scope": "全公司",
      "params": "审批通过/驳回后通知申请人；失败重发3次",
      "ref": "消息管理、工作台提醒、操作日志",
      "version": "V1",
      "status": "启用",
      "effective": "2026-06-01",
      "expire": "长期",
      "priority": "50"
    }
  ],
  "messageTemplates": [
    {
      "id": "M001",
      "name": "审批通过通知",
      "node": "审批通过",
      "receiver": "申请人",
      "channel": "钉钉、邮件",
      "status": "启用",
      "title": "您的${申请类型}已审批通过",
      "content": "您好，${申请人}：您的${申请类型}（单号：${申请单号}）已审批通过。申请时间段范围：${申请时间段范围}，申请时长：${申请时长}，当前剩余调休余额：${调休余额}。",
      "updatedAt": "2026-06-10 10:20"
    },
    {
      "id": "M002",
      "name": "审批驳回通知",
      "node": "审批驳回",
      "receiver": "申请人",
      "channel": "钉钉、短信",
      "status": "启用",
      "title": "您的${申请类型}已被驳回",
      "content": "您的${申请类型}已被驳回，请进入“加班调休申请”页面修改后重新提交。审批意见：${审批意见}。",
      "updatedAt": "2026-06-10 10:30"
    },
    {
      "id": "M003",
      "name": "提交审批提醒",
      "node": "提交审批",
      "receiver": "直属主管",
      "channel": "钉钉",
      "status": "启用",
      "title": "您有新的加班调休申请待审批",
      "content": "${申请人}提交了${申请类型}，申请时长${申请时长}，请及时审批。",
      "updatedAt": "2026-06-09 18:10"
    }
  ],
  "sendRecords": [
    {
      "noticeNo": "N20260610001",
      "relatedNo": "OT20260610001",
      "type": "审批通过通知",
      "receiver": "演示员工甲",
      "channel": "钉钉",
      "status": "成功",
      "triggerAt": "2026-06-10 10:11",
      "sendAt": "2026-06-10 10:11",
      "failReason": "-",
      "retry": 0,
      "content": "您的加班申请已审批通过。",
      "receiverContact": "138****8901"
    },
    {
      "noticeNo": "N20260610002",
      "relatedNo": "OT20260610002",
      "type": "审批驳回通知",
      "receiver": "演示员工乙",
      "channel": "短信",
      "status": "失败",
      "triggerAt": "2026-06-10 10:13",
      "sendAt": "2026-06-10 10:13",
      "failReason": "账号不存在",
      "retry": 1,
      "content": "您的调休申请已被驳回，请进入“加班调休申请”页面修改后重新提交。",
      "receiverContact": "139****8902"
    },
    {
      "noticeNo": "N20260610003",
      "relatedNo": "OT20260612001",
      "type": "提交审批提醒",
      "receiver": "演示主管甲",
      "channel": "钉钉",
      "status": "成功",
      "triggerAt": "2026-06-12 09:31",
      "sendAt": "2026-06-12 09:31",
      "failReason": "-",
      "retry": 0,
      "content": "演示员工甲提交了加班申请，请及时审批。",
      "receiverContact": "138****0001"
    },
    {
      "noticeNo": "N20260610004",
      "relatedNo": "JB20260612001",
      "type": "审批通过通知",
      "receiver": "演示员工甲",
      "receiverContact": "e001@example.com",
      "channel": "邮件",
      "status": "成功",
      "triggerAt": "2026-06-12 10:11",
      "sendAt": "2026-06-12 10:11",
      "failReason": "-",
      "retry": 0,
      "content": "您的加班申请已审批通过，请登录系统查看详情。"
    }
  ],
  "logs": [
    {
      "time": "2026-06-10 09:30",
      "operator": "演示员工甲",
      "module": "加班调休申请",
      "object": "JB20260612001",
      "objectName": "演示员工甲-加班申请",
      "objectType": "加班申请",
      "type": "提交申请",
      "result": "成功",
      "ip": "10.10.2.15",
      "client": "Chrome",
      "detail": "提交加班申请，状态由草稿变更为待审批。"
    },
    {
      "time": "2026-06-10 10:15",
      "operator": "演示主管甲",
      "module": "审批管理",
      "object": "JB20260603002",
      "objectName": "演示员工乙-加班申请",
      "objectType": "加班申请",
      "type": "审批通过",
      "result": "成功",
      "ip": "10.10.2.20",
      "client": "Chrome",
      "detail": "审批通过演示员工乙的加班申请。"
    },
    {
      "time": "2026-06-10 10:20",
      "operator": "系统",
      "module": "消息管理",
      "object": "N20260610002",
      "objectName": "审批完成通知",
      "objectType": "消息发送记录",
      "type": "发送消息",
      "result": "失败",
      "ip": "-",
      "client": "消息服务",
      "detail": "短信发送失败，失败原因：账号不存在。"
    },
    {
      "time": "2026-06-11 14:05",
      "operator": "演示主管甲",
      "module": "规则流程配置",
      "object": "R003",
      "objectName": "余额不足提交提醒规则",
      "objectType": "规则配置",
      "type": "编辑规则",
      "result": "成功",
      "ip": "10.10.2.20",
      "client": "Chrome",
      "detail": "调整余额不足提交提醒配置。"
    }
  ],
  "reportSummary": [
    {
      "seq": 1,
      "jobNo": "E001",
      "name": "演示员工甲",
      "dept": "产品部",
      "overtime": 40,
      "leave": 16,
      "balance": 50
    },
    {
      "seq": 2,
      "jobNo": "E002",
      "name": "演示员工乙",
      "dept": "研发一部",
      "overtime": 88,
      "leave": 4,
      "balance": 102
    },
    {
      "seq": 3,
      "jobNo": "E003",
      "name": "演示员工丙",
      "dept": "研发二部",
      "overtime": 48,
      "leave": 16,
      "balance": 34
    },
    {
      "seq": 4,
      "jobNo": "E004",
      "name": "演示员工丁",
      "dept": "产品部",
      "overtime": 24,
      "leave": 8,
      "balance": 24
    },
    {
      "seq": 5,
      "jobNo": "E005",
      "name": "演示主管丙",
      "dept": "研发中心",
      "overtime": 16,
      "leave": 0,
      "balance": 16
    }
  ],
  "monthly": {
    "months": [
      "1月",
      "2月",
      "3月",
      "4月",
      "5月",
      "6月",
      "7月",
      "8月",
      "9月",
      "10月",
      "11月",
      "12月"
    ],
    "overtime": [
      4,
      6,
      10,
      8,
      12,
      14,
      0,
      0,
      0,
      0,
      0,
      0
    ],
    "leave": [
      0,
      2,
      4,
      0,
      8,
      6,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  }
};
