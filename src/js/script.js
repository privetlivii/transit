/* BEGIN: Menu toggle */
function clickHeaderToggle() {
    document.querySelector('body').classList.toggle('menu-opened');
}

window.addEventListener("DOMContentLoaded", function () {
    document.querySelector('.nav-menu__toggle').addEventListener("click", clickHeaderToggle);
});
/* END: Menu toggle */


/* BEGIN: Mask input */
[].forEach.call(document.querySelectorAll('.header-form__phone'), function (input) {
    var keyCode;

    function mask(event) {
        event.keyCode && (keyCode = event.keyCode);
        var pos = this.selectionStart;
        if (pos < 3) event.preventDefault();
        var matrix = "+7 (___) ___ __-__",
            i = 0,
            def = matrix.replace(/\D/g, ""),
            val = this.value.replace(/\D/g, ""),
            new_value = matrix.replace(/[_\d]/g, function (a) {
                return i < val.length ? val.charAt(i++) || def.charAt(i) : a
            });
        i = new_value.indexOf("_");
        if (i !== -1) {
            i < 5 && (i = 3);
            new_value = new_value.slice(0, i)
        }
        var reg = matrix.substr(0, this.value.length).replace(/_+/g,
            function (a) {
                return "\\d{1," + a.length + "}"
            }).replace(/[+()]/g, "\\$&");
        reg = new RegExp("^" + reg + "$");
        if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) this.value = new_value;
        if (event.type === "blur" && this.value.length < 5) this.value = ""
    }

    input.addEventListener("input", mask, false);
    input.addEventListener("focus", mask, false);
    input.addEventListener("blur", mask, false);
    input.addEventListener("keydown", mask, false)
});

/* END: Mask input */

var linkNav = document.querySelectorAll('[href^="#"]'), //выбираем все ссылки к якорю на странице
    V = 1;  // скорость, может иметь дробное значение через точку (чем меньше значение - тем больше скорость)
for (var i = 0; i < linkNav.length; i++) {
    linkNav[i].addEventListener('click', function (e) { //по клику на ссылку
        e.preventDefault(); //отменяем стандартное поведение
        var w = window.pageYOffset,  // производим прокрутка прокрутка
            hash = this.href.replace(/[^#]*(.*)/, '$1');  // к id элемента, к которому нужно перейти
        t = document.querySelector(hash).getBoundingClientRect().top,  // отступ от окна браузера до id
            start = null;
        requestAnimationFrame(step);  // подробнее про функцию анимации [developer.mozilla.org]
        function step(time) {
            if (start === null) start = time;
            var progress = time - start,
                r = (t < 0 ? Math.max(w - progress / V, w + t) : Math.min(w + progress / V, w + t));
            window.scrollTo(0, r);
            if (r != w + t) {
                requestAnimationFrame(step)
            } else {
                location.hash = hash  // URL с хэшем
            }
        }
    }, false);
}

/* Код для отправки писем на почту */

if (document.forms[0] && window.FormData) {

    var message = new Object();
    message.loading = 'Загрузка...';
    message.success = 'Спасибо! У Вас все получилось';
    message.failure = 'Ээххх! Что-то пошло не так...';

    var form = document.forms[0];

    var statusMessage = document.createElement('div');
    statusMessage.className = 'status';

    // Настройка AJAX запроса
    var request = new XMLHttpRequest();
    request.open('POST', 'php/sendmail.php', true);
    request.setRequestHeader('accept', 'application/json');

    // Добавляем обработчик на событие `submit`
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        form.appendChild(statusMessage);

        // Это простой способ подготавливить данные для отправки (все браузеры и IE > 9)
        var formData = new FormData(form);

        // Отправляем данные
        request.send(formData);

        // Функция для наблюдения изменения состояния request.readyState обновления statusMessage соответственно
        request.onreadystatechange = function () {
            // <4 =  ожидаем ответ от сервера
            if (request.readyState < 4)
                statusMessage.innerHTML = message.loading;
            // 4 = Ответ от сервера полностью загружен
            else if (request.readyState === 4) {
                // 200 - 299 = успешная отправка данных!
                if (request.status == 200 && request.status < 300) {
                    statusMessage.innerHTML = message.success;
                    document.getElementById("header-form").reset();
                } else {
                    form.insertAdjacentHTML('beforeend', message.failure);
                }
            }
        }
    });

}

/* END */