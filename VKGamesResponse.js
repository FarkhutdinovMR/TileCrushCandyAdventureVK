// JavaScript source code
const express = require('express');
const app = express();
const md5 = require('md5');

// ...

// Обработчик POST-запросов, приходящих на адрес /purchase 
app.post('/purchase', (request, response) => {

    var requestData = '';
    var requestParams = {};
    let responseData;


    // Получение данных
    request.on('data', (chunk) => {
        requestData += chunk;
    })
        .on('end', () => {

            // Формируем список параметров
            let s = String(requestData).split('&');
            s.map((item) => {
                let [k, v] = item.split('=');
                // Декодируем строки.
                // Код функции PHPUrlDecode() приведён ниже.
                requestParams[k] = PHPUrlDecode(v);
            });

            // Проверка подписи
            // Код функции calcSignature() приведён ниже.
            if (calcSignature(requestParams) == requestParams.sig) {

                // Обрабатываем запрос
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
                responseData = { // Ошибка подписи
                    error: {
                        error_code: 20,
                        error_msg: 'Несовпадение переданной и вычисленной подписи',
                        critical: true
                    }
                }
            }

            // Отправляем ответ
            s = JSON.stringify(responseData);
            response.end(s);
        });
})

// Вычисление подписи
function calcSignature(params) {

    const ACCESS_KEY = 'sdznB44fjqoUmwL44JYF'; // Ключ доступа приложения

    // Сортируем параметры
    let keys = Object.keys(params);
    keys.sort();

    // Формируем строку из пар 'параметр=значение'
    let str = '';
    keys.map((item) => {
        if (item != "sig") {
            str += item + '=' + params[item];
        }
    });
    str = str + ACCESS_KEY; // Добавляем ключ доступа

    // Вычисляем подпись
    let calculatedSignature = md5(str);

    return calculatedSignature;
}

// Обработчик уведомления get_item
function handleGetItem(params) {

    let saleItems = [{
        "bundle1": {
            "title": "bundle1",
            "price": 49,
            "photo_url": "https://farkhutdinovmr.github.io/TileCrushCandyAdventureVK/StarterBundle.png",
            "item_id": "bundle1"
        },
        "bundle2": {
            "title": "Набор «Ученик»",
            "price": 99,
            "photo_url": "https://farkhutdinovmr.github.io/TileCrushCandyAdventureVK/ApprenticeBundle.png",
            "item_id": "bundle2"
        },
        "bundle3": {
            "title": "Профессиональный пакет",
            "price": 149,
            "photo_url": "https://farkhutdinovmr.github.io/TileCrushCandyAdventureVK/ProBundle.png",
            "item_id": "bundle3"
        },
        "bundle4": {
            "title": "Мастер-пакет",
            "price": 249,
            "photo_url": "https://farkhutdinovmr.github.io/TileCrushCandyAdventureVK/MasterBundle.png",
            "item_id": "bundle4"
        },
        "bundle5": {
            "title": "Гигантский комплект",
            "price": 449,
            "photo_url": "https://farkhutdinovmr.github.io/TileCrushCandyAdventureVK/GiantBundle.png",
            "item_id": "bundle5"
        },
        "bundle6": {
            "title": "Чемпионский набор",
            "price": 999,
            "photo_url": "https://farkhutdinovmr.github.io/TileCrushCandyAdventureVK/ChampionsBundle.png",
            "item_id": "bundle6"
        },
        "disableAd": {
            "title": "Отключение рекламы",
            "price": 99,
            "photo_url": "https://farkhutdinovmr.github.io/TileCrushCandyAdventureVK/DisableAd.png",
            "item_id": "disableAd"
        }
    }]

    let responseData
    // Получаем информацию о товаре
    let item = saleItems[params.item];

    // Возвращаем ответ
    if (item) {
        responseData = {
            response: item
        };
    } else {
        responseData = {
            error: {
                "error_code": 20,
                "error_msg": "Товара не существует",
                "critical": true
            }
        };
    }

    return responseData;
}

// Обработчик уведомления order_status_change
function handleOrderStatusChange(params) {

    let responseData;

    switch (params.status) {
        case 'chargeable':
            // Предоставляем товар в приложении
            // ... 

            // Сохраняем информацию о заказе в приложении
            // ...

            // Формируем ответ
            let appOrder = 1; // Идентификатор заказа в приложении

            responseData = {
                response: {
                    order_id: params.order_id,
                    app_order_id: appOrder
                }
            };

            break;

        case 'refund':
            // Обрабатываем возврат
            // ...
            break;
        default:
            responseData = {
                error: {
                    error_code: 11,
                    error_msg: 'Ошибка в структуре данных',
                    critical: true
                }
            };
    }

    return responseData;
}

// Служебная функция для декодирования строк
// из формата PHP URL-encoded
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