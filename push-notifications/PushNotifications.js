PushNotifications = function () {
    this.init();
};

PushNotifications.prototype.init = function () {
    var self = this;
    firebase.initializeApp({
        messagingSenderId: '418086820458'
    });

    if ('Notification' in window) {
        self.messaging = firebase.messaging();
        if (Notification.permission === 'granted') {
            self.subscribe();
        }
    }

    $('.js-header').on('click', function () {
        self.subscribe();
    });
};

PushNotifications.prototype.subscribe = function () {
    console.log(1)
    var self = this;
    self.messaging.requestPermission()
        .then(function () {
            // получаем ID устройства
            self.messaging.getToken()
                .then(function (currentToken) {
                    if (currentToken) {
                        self.sendTokenToServer(currentToken);
                    } else {
                        console.warn('Не удалось получить токен.');
                        self.setTokenSentToServer(false);
                    }
                })
                .catch(function (err) {
                    console.warn('При получении токена произошла ошибка.', err);
                    self.setTokenSentToServer(false);
                });
        })
        .catch(function (err) {
            console.warn('Не удалось получить разрешение на показ уведомлений.', err);
        });
};

// отправка ID на сервер
PushNotifications.prototype.sendTokenToServer = function (currentToken) {
    var self = this;
    if (!self.isTokenSentToServer(currentToken)) {
        console.log(currentToken)
        console.log('Отправка токена на сервер...');

        var url = ''; // адрес скрипта на сервере который сохраняет ID устройства
        $.post(url, {
            token: currentToken
        });

        self.setTokenSentToServer(currentToken);
    } else {
        console.log('Токен уже отправлен на сервер.');
    }
};

// используем localStorage для отметки того,
// что пользователь уже подписался на уведомления
PushNotifications.prototype.isTokenSentToServer =  function (currentToken) {
    return window.localStorage.getItem('sentFirebaseMessagingToken') == currentToken;
};

PushNotifications.prototype.setTokenSentToServer = function (currentToken) {
    window.localStorage.setItem(
        'sentFirebaseMessagingToken',
        currentToken ? currentToken : ''
    );
};