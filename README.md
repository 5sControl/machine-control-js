# Работа с контейнером

*Подключение по SSH к Каунасу (ноутбук HP)*

ssh admin1@7.tcp.eu.ngrok.io -p 17306

Если не подключачется - можно попробовать AnyDesk:
address: 145 479 941
password: just4Taqtile

Для доступа к https://5s-kaunas-hp.netlify.app/
email: admin
password: admin

Для отображения картинок нажать кнопку Visite Site здесь:
https://65b5-81-7-77-205.ngrok-free.app

Этот и вышеуказанный ngrok периодически обновляются, в группе должны оповещать:
tcp://7.tcp.eu.ngrok.io:17306

*Сборка и обновление удалённого билда*

Локально:
- sudo docker login или просто запустить Docker Desktop или Rancher
- username и password для аккаунта 5scontrol спросить у кого-нибудь из команды
- sudo docker build -t 5scontrol/machine_control_js:v0.1.0 . --platform=linux/amd64
- sudo docker push 5scontrol/machine_control_js:v0.1.0

Удалённо:
- подключиться по SSH к Каунасу (ноутбук HP)
- sudo docker pull 5scontrol/machine_control_js:v0.1.0
- cd /home/server/reps
- sudo docker-compose down && sudo docker-compose up

Временно до включения имеджа machine_control_js в общий билд:
sudo docker run -v /home/server/reps/images:/var/www/5scontrol/images 5scontrol/machine_control_js:v0.1.0

*Полезные команды при работе с докером*

sudo docker ps - список запущенных контейнеров
sudo docker ps -a - список всех контейнеров
sudo docker logs айди_контейнера - посмотреть логи
sudo docker stats - статистика использования ресурсов

# Модульная архитектура

У оперейшн-контрол и машин-контрол одная и та же модульная архитектура.

Модули:
- [globals](https://github.com/5sControl/machine-control-js/blob/main/src/globals.js) - глобальные переменные
- [Translation](https://github.com/5sControl/machine-control-js/tree/main/src/Translation) - приём снепшотов с камеры, создание Snapshot и упаковка Batch
- [Detector](https://github.com/5sControl/machine-control-js/tree/main/src/Detector) - распознавание нужных объектов на снепшоте
- [Control](https://github.com/5sControl/machine-control-js/tree/main/src/Control) - анализ полученных детекций
- [Report](https://github.com/5sControl/machine-control-js/tree/main/src/Report) - приём нужных снепшотов для формирования репорта и его отправка
- [Debugger](https://github.com/5sControl/machine-control-js/tree/main/src/Debugger) - среда для тестирования и отладки контрола

В будущем модули Control и Detector планируется вынести в отдельные контейнеры: логика алгоритмов будет в Control, cv-модели в Detector, общие для оперейшена и машин - Common:

*Жёлтые прямоугольники - докер-имеджи/контейнера*

![Modules](./arch.png)


# Событийная система

В обоих алгоритмах нет временного тика (например, в 1 секунду): модули общаются между собой через события - диспатчер, на который можно подписаться через метод on и который генерирует событие методом emit.
Как правило, помимо имени события диспатчер передаёт в теле [Snapshot](https://github.com/5sControl/machine-control-js/blob/main/src/Translation/Snapshot.js) - сквозную сущность, в которой содержится буфер и информация о полученном снепшоте с камеры.

Самые главные события можно разделить на три уровня:
- детекция - генерируется из модуля Detector
  - рабочий обнаружен
  - рабочий не обнаружен
- накопительное (EventAccumulator) - генерируется из модуля Control: когда что-то происходит подряд несколько раз - генерируется это событие.
  - рабочий на рабочем месте
  - рабочий не на рабочем месте
- регион - тоже из модуля временной промежуток от одного события до другого

Логика сущностей не привязана к одному языку, может быть переписана на любой язык, в том числе на Питон.

Диспатчер наследуется от нодовского EventEmitter'а, но может быть написан с нуля - это обычный паттерн обозревателя. Хороший пример - [в three.js](https://github.com/mrdoob/three.js/blob/dev/src/core/EventDispatcher.js) или [здесь](https://refactoring.guru/ru/design-patterns/observer)
