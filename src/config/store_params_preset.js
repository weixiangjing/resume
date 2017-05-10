const STORE = "control"
export default [
    {
        "label" : "商户号",
        "type"  : STORE,
        "params": {
            "key"        : "merchantNo",
            "title"      : "商户号",
            "type"       : "text",
            "description": "商户在支付通道申请的唯一编号",
            "validator"  : [
                {
                    "rule": "required",
                    "value":true,
                    "message" : "商户号必须填写"
                },
                {
                    "rule": "pattern",
                    "value":"/^[\\w-]{4,50}$/",
                    "message": "商户号长度超出限制"
                },
                {
                    "rule": "pattern",
                    "value":"/^[\\w-]+$/",
                    "message": "商户号格式不正确，不允许输入数字或英文字母以外的特殊字符"
                }
            ]
        }
    },
    {
        "label" : "子商户号",
        "type"  : STORE,
        "params": {
            "key"        : "subMerchantNo",
            "title"      : "子商户号",
            "type"       : "text",
            "description": "商户下若创建了子商户，请填写对应的标识",
            "validator"  : [
                {
                    "rule": "pattern",
                    "value":"/^[\\w-]{4,50}$/",
                    "message": "子商户号长度超出限制"
                },
                {
                    "rule": "pattern",
                    "value":"/^[\\w-]+$/",
                    "message": "子商户号格式不正确，不允许输入数字或英文字母以外的特殊字符"
                }
            ]
        }
    },
    {
        "label" : "应用ID",
        "type"  : STORE,
        "params": {
            "key"        : "appId",
            "title"      : "应用ID",
            "type"       : "text",
            "description": "支付应用的唯一标识",
            "validator"  : [
                {
                    "rule": "required",
                    "value":true,
                    "message" : "应用ID必须填写"
                },
                { "rule": "pattern",
                    "value":"/^[0-9a-zA-Z]{4,50}$/",
                    "message": "应用ID长度超出限制"
                },
                {
                    "rule": "pattern",
                    "value":"/^[0-9a-zA-Z]+$/",
                  
                    "message": "应用ID格式不正确，只能输入数字及英文字符"
                }
            ]
        }
    },
    {
        "label" : "应用支付key",
        "type"  : STORE,
        "params": {
            "key"        : "key",
            "title"      : "应用支付key",
            "type"       : "text",
            "description": "商户应用支付密钥的Key",
            "validator"  : [
                {
                    "rule": "required",
                    "value":true,
                    "message" : "支付Key必须填写"
                },
                {
                    "rule": "pattern",
                    "value":"/^[0-9a-zA-Z]{4,50}$/",
                    "message": "支付Key长度超出限制"
                },
                {
                    "rule": "pattern",
                    "value":"/[0-9a-zA-Z]/g",
                    "message": "支付Key格式不正确，只能输入数字及英文字符"
                }
            ]
        }
    },
    {
        "label" : "应用secret",
        "type"  : STORE,
        "params": {
            "key"        : "appSecret",
            "title"      : "应用secret",
            "type"       : "text",
            "description": "商户应用API权限密钥",
            "validator"  : [
                {
                    "rule": "required",
                    "value":true,
                    "message" : "应用secret必须填写"
                },
                {
                    "rule": "pattern",
                    "value":"/^[0-9a-zA-Z]{4,256}$/",
                    "message": "应用secret长度超出限制"
                },
                {
                    "rule": "pattern",
                    "value":"/[0-9a-zA-Z]/g",
                    "message": "应用secret格式不正确，只能输入数字及英文字符"
                }
            ]
        }
    },
    {
        "label" : "外部门店ID",
        "type"  : STORE,
        "params": {
            "key"        : "shopId",
            "title"      : "外部门店ID",
            "type"       : "text",
            "description": "通道方的门店唯一标识"
        }
    },
    {
        "label" : "RSA公钥",
        "type"  : STORE,
        "params": {
            "key"        : "publicKey",
            "title"      : "RSA公钥",
            "type"       : "textarea",
            "rows"       : 5,
            "description": "应用的RSA公钥"
        }
    },
    {
        "label" : "RSA私钥",
        "type"  : STORE,
        "params": {
            "key"        : "privateKey",
            "title"      : "RSA私钥",
            "type"       : "textarea",
            "rows"       : 7,
            "description": "应用的RSA私钥"
        }
    },{
        "label" : "服务提供商标识",
        "type"  : STORE,
        "params": {
            "key"        : "agentId",
            "title"      : "服务提供商标识",
            "type"       : "text"
        }
    }
]
