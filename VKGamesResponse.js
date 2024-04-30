// JavaScript source code
const express = require('express');
const app = express();
const md5 = require('md5');

// ...

// ���������� POST-��������, ���������� �� ����� /purchase 
app.post('/purchase', (request, response) => {

    var requestData = '';
    var requestParams = {};
    let responseData;


    // ��������� ������
    request.on('data', (chunk) => {
        requestData += chunk;
    })
        .on('end', () => {

            // ��������� ������ ����������
            let s = String(requestData).split('&');
            s.map((item) => {
                let [k, v] = item.split('=');
                // ���������� ������.
                // ��� ������� PHPUrlDecode() ������� ����.
                requestParams[k] = PHPUrlDecode(v);
            });

            // �������� �������
            // ��� ������� calcSignature() ������� ����.
            if (calcSignature(requestParams) == requestParams.sig) {

                // ������������ ������
                switch (requestParams.notification_type) {
                    case "get_item":
                        responseData = handleGetItem(requestParams);
                        break;
                    case "get_item_test":
                        responseData = handleGetItem(requestParams);
                        break;
                    case "order_status_change":
                    case "order_status_change_test":
                        responseData = handleOrderStatusChange(requestParams);
                        break;
                }
            } else {
                responseData = { // ������ �������
                    error: {
                        error_code: 20,
                        error_msg: '������������ ���������� � ����������� �������',
                        critical: true
                    }
                }
            }

            // ���������� �����
            s = JSON.stringify(responseData);
            response.end(s);
        });
})

// ���������� �������
function calcSignature(params) {

    const ACCESS_KEY = 'sdznB44fjqoUmwL44JYF'; // ���� ������� ����������

    // ��������� ���������
    let keys = Object.keys(params);
    keys.sort();

    // ��������� ������ �� ��� '��������=��������'
    let str = '';
    keys.map((item) => {
        if (item != "sig") {
            str += item + '=' + params[item];
        }
    });
    str = str + ACCESS_KEY; // ��������� ���� �������

    // ��������� �������
    let calculatedSignature = md5(str);

    return calculatedSignature;
}

// ���������� ����������� get_item
function handleGetItem(params) {

    let saleItems = [{
        "bundle1": {
            "title": "bundle1",
            "price": 49,
            "photo_url": "https://farkhutdinovmr.github.io/TileCrushCandyAdventureVK/StarterBundle.png",
            "item_id": "bundle1"
        },
        "bundle2": {
            "title": "����� �������",
            "price": 99,
            "photo_url": "https://farkhutdinovmr.github.io/TileCrushCandyAdventureVK/ApprenticeBundle.png",
            "item_id": "bundle2"
        },
        "bundle3": {
            "title": "���������������� �����",
            "price": 149,
            "photo_url": "https://farkhutdinovmr.github.io/TileCrushCandyAdventureVK/ProBundle.png",
            "item_id": "bundle3"
        },
        "bundle4": {
            "title": "������-�����",
            "price": 249,
            "photo_url": "https://farkhutdinovmr.github.io/TileCrushCandyAdventureVK/MasterBundle.png",
            "item_id": "bundle4"
        },
        "bundle5": {
            "title": "���������� ��������",
            "price": 449,
            "photo_url": "https://farkhutdinovmr.github.io/TileCrushCandyAdventureVK/GiantBundle.png",
            "item_id": "bundle5"
        },
        "bundle6": {
            "title": "����������� �����",
            "price": 999,
            "photo_url": "https://farkhutdinovmr.github.io/TileCrushCandyAdventureVK/ChampionsBundle.png",
            "item_id": "bundle6"
        },
        "disableAd": {
            "title": "���������� �������",
            "price": 99,
            "photo_url": "https://farkhutdinovmr.github.io/TileCrushCandyAdventureVK/DisableAd.png",
            "item_id": "disableAd"
        }
    }]

    let responseData
    // �������� ���������� � ������
    let item = saleItems[params.item];

    // ���������� �����
    if (item) {
        responseData = {
            response: item
        };
    } else {
        responseData = {
            error: {
                "error_code": 20,
                "error_msg": "������ �� ����������",
                "critical": true
            }
        };
    }

    return responseData;
}

// ���������� ����������� order_status_change
function handleOrderStatusChange(params) {

    let responseData;

    switch (params.status) {
        case 'chargeable':
            // ������������� ����� � ����������
            // ... 

            // ��������� ���������� � ������ � ����������
            // ...

            // ��������� �����
            let appOrder = 1; // ������������� ������ � ����������

            responseData = {
                response: {
                    order_id: params.order_id,
                    app_order_id: appOrder
                }
            };

            break;

        case 'refund':
            // ������������ �������
            // ...
            break;
        default:
            responseData = {
                error: {
                    error_code: 11,
                    error_msg: '������ � ��������� ������',
                    critical: true
                }
            };
    }

    return responseData;
}

// ��������� ������� ��� ������������� �����
// �� ������� PHP URL-encoded
function PHPUrlDecode(str) {
    return decodeURIComponent(
        str.replace(/%21/g, '!')
            .replace(/%27/g, '\'')
            .replace(/%28/g, '(')
            .replace(/%29/g, ')')
            .replace(/%2A/g, '*')
            .replace(/%7E/g, '~')
            .replace(/\+/g, '%20'));
}