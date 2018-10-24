# NodejsChat
Chat-Server with Node.js<br>
Node.js 채팅 서버입니다.

## Install the three modules :
    - npm install express
    - npm install request
    - npm install socket.io
    - npm install cheerio
    - npm install redis

## How to use :
    - npm start
    
## Functions
    - 기본적인 채팅 기능, 특정 방(방아이디) 구성원끼리 메세지 주고받기
    - 메세지에 URL 포함시 미리보기 기능
    - 대화내용 저장 및 불러오기 기능
    - Redis Examples. (set/get/hmset/hgetall/rpush/lrange/sadd/smembers/zadd/zrange/keys)
    - Redis data navigator 

<hr/>

## Version history.
1. (v0.1)    2018.10.29. 최초 생성. <br>
   - 기본적인 채팅 기능, 특정 방(방아이디) 구성원끼리 메세지 주고받기
   - 메세지에 URL 포함시 미리보기 기능
2. (v0.2)    2018.10.19. Redis 예제 추가. <br>
   - Redis Examples. (set/get/hmset/hgetall/rpush/lrange/sadd/smembers/zadd/zrange/keys) 추가.
3. (v0.2.1)    2018.10.22. 채팅 Redis 추가. <br>
   - 대화내용 Redis 에 저장 및 방 입장시 이전 메시지 불러오기 기능 추가.
   - Redis data navigator 기능 추가.
4. (v0.2.2)    2018.10.22. Redis 추가. <br>
   - Redis data navigator 개선
