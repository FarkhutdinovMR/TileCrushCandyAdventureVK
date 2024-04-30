// JavaScript source code
const express = require('express');
const app = express();
const md5 = require('md5');
    console.log('POST Success');
// ...

// Îáðàáîò÷èê POST-çàïðîñîâ, ïðèõîäÿùèõ íà àäðåñ /purchase 
app.post('/purchase', (request, response) => {

    var requestData = '';
    var requestParams = {};
    let responseData;

    console.log('POST Success');
    // Ïîëó÷åíèå äàííûõ
    request.on('data', (chunk) => {
        requestData += chunk;
    })
        .on('end', () => {

            // Ôîðìèðóåì ñïèñîê ïàðàìåòðîâ
            let s = String(requestData).split('&');
            s.map((item) => {
                let [k, v] = item.split('=');
                // Äåêîäèðóåì ñòðîêè.
                // Êîä ôóíêöèè PHPUrlDecode() ïðèâåä¸í íèæå.
                requestParams[k] = PHPUrlDecode(v);
            });

            // Ïðîâåðêà ïîäïèñè
            // Êîä ôóíêöèè calcSignature() ïðèâåä¸í íèæå.
            if (calcSignature(requestParams) == requestParams.sig) {

                // Îáðàáàòûâàåì çàïðîñ
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
                responseData = { // Îøèáêà ïîäïèñè
                    error: {
                        error_code: 20,
                        error_msg: 'Íåñîâïàäåíèå ïåðåäàííîé è âû÷èñëåííîé ïîäïèñè',
                        critical: true
                    }
                }
            }

            // Îòïðàâëÿåì îòâåò
            s = JSON.stringify(responseData);
            response.end(s);
        });
})

// Âû÷èñëåíèå ïîäïèñè
function calcSignature(params) {

    const ACCESS_KEY = 'sdznB44fjqoUmwL44JYF'; // Êëþ÷ äîñòóïà ïðèëîæåíèÿ

    // Ñîðòèðóåì ïàðàìåòðû
    let keys = Object.keys(params);
    keys.sort();

    // Ôîðìèðóåì ñòðîêó èç ïàð 'ïàðàìåòð=çíà÷åíèå'
    let str = '';
    keys.map((item) => {
        if (item != "sig") {
            str += item + '=' + params[item];
        }
    });
    str = str + ACCESS_KEY; // Äîáàâëÿåì êëþ÷ äîñòóïà

    // Âû÷èñëÿåì ïîäïèñü
    let calculatedSignature = md5(str);

    return calculatedSignature;
}

// Îáðàáîò÷èê óâåäîìëåíèÿ get_item
function handleGetItem(params) {

    let saleItems = [{
        "bundle1": {
            "title": "bundle1",
            "price": 49,
            "photo_url": "https://farkhutdinovmr.github.io/TileCrushCandyAdventureVK/StarterBundle.png",
            "item_id": "bundle1"
        },
        "bundle2": {
            "title": "Íàáîð «Ó÷åíèê»",
            "price": 99,
            "photo_url": "https://farkhutdinovmr.github.io/TileCrushCandyAdventureVK/ApprenticeBundle.png",
            "item_id": "bundle2"
        },
        "bundle3": {
            "title": "Ïðîôåññèîíàëüíûé ïàêåò",
            "price": 149,
            "photo_url": "https://farkhutdinovmr.github.io/TileCrushCandyAdventureVK/ProBundle.png",
            "item_id": "bundle3"
        },
        "bundle4": {
            "title": "Ìàñòåð-ïàêåò",
            "price": 249,
            "photo_url": "https://farkhutdinovmr.github.io/TileCrushCandyAdventureVK/MasterBundle.png",
            "item_id": "bundle4"
        },
        "bundle5": {
            "title": "Ãèãàíòñêèé êîìïëåêò",
            "price": 449,
            "photo_url": "https://farkhutdinovmr.github.io/TileCrushCandyAdventureVK/GiantBundle.png",
            "item_id": "bundle5"
        },
        "bundle6": {
            "title": "×åìïèîíñêèé íàáîð",
            "price": 999,
            "photo_url": "https://farkhutdinovmr.github.io/TileCrushCandyAdventureVK/ChampionsBundle.png",
            "item_id": "bundle6"
        },
        "disableAd": {
            "title": "Îòêëþ÷åíèå ðåêëàìû",
            "price": 99,
            "photo_url": "https://farkhutdinovmr.github.io/TileCrushCandyAdventureVK/DisableAd.png",
            "item_id": "disableAd"
        }
    }]

    let responseData
    // Ïîëó÷àåì èíôîðìàöèþ î òîâàðå
    let item = saleItems[params.item];

    // Âîçâðàùàåì îòâåò
    if (item) {
        responseData = {
            response: item
        };
    } else {
        responseData = {
            error: {
                "error_code": 20,
                "error_msg": "Òîâàðà íå ñóùåñòâóåò",
                "critical": true
            }
        };
    }

    return responseData;
}

// Îáðàáîò÷èê óâåäîìëåíèÿ order_status_change
function handleOrderStatusChange(params) {

    let responseData;

    switch (params.status) {
        case 'chargeable':
            // Ïðåäîñòàâëÿåì òîâàð â ïðèëîæåíèè
            // ... 

            // Ñîõðàíÿåì èíôîðìàöèþ î çàêàçå â ïðèëîæåíèè
            // ...

            // Ôîðìèðóåì îòâåò
            let appOrder = 1; // Èäåíòèôèêàòîð çàêàçà â ïðèëîæåíèè

            responseData = {
                response: {
                    order_id: params.order_id,
                    app_order_id: appOrder
                }
            };

            break;

        case 'refund':
            // Îáðàáàòûâàåì âîçâðàò
            // ...
            break;
        default:
            responseData = {
                error: {
                    error_code: 11,
                    error_msg: 'Îøèáêà â ñòðóêòóðå äàííûõ',
                    critical: true
                }
            };
    }

    return responseData;
}

// Ñëóæåáíàÿ ôóíêöèÿ äëÿ äåêîäèðîâàíèÿ ñòðîê
// èç ôîðìàòà PHP URL-encoded
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
