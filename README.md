# OC/BACK-END<br/>
This is repository for OC backend.<br/>

## STACK<br/>
- node.js 
- express
- sequelize
- postgresql

## PURPOSE


## TODO
- app.js에 로그인 정보 유지하는 미들웨어 추가 해야되는지 여부. => 이미 mjwtdecode를 통해 req.user에 쿠키에서 가져온 refresh token을 디코드 하여 집어넣음. 이렇게 할 경우 refresh토큰의 validity가 유지될 수 있는지가 생각해볼 점이므로 추가적인 validation이 필요한 경우에만 mcheckrefresh 미들웨어를 통해서 db와 refresh token 크로스 체크<br/>

## IDEA
- charges_tbl 및 payments_tbl 을 따로 만들고 각각 journals을 keep하도록 만든다. 
