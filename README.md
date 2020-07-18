# OC/BACK-END<br/>
This is repository for OC backend.<br/>

## STACK<br/>
- node.js 
- express
- sequelize
- postgresql

## TABLE INDEX 
- https://www.erdcloud.com/d/M8sngcQTf7GLBj842 </br>
- charge_items_tbl : 부과 종목 (전기, 수도, 난방 등) + 자의적으로 추가 가능 <br/>
- charges_tbl : 부과 journal 테이블. 부과 대상 room과 수납 payment를 여러개 가질수 있음 </br> 
- payments_tbl : 수납 journal 테이블. charge_journal의 uuid 혹은 pk를 fk로 가짐.</br>
- ledgers_tbl : 원장 목록 테이블. 현재 사용방법 모색중. 일차적으로 몇기에 해당하는 수납 혹은 부과 인지 알아내는데 필요한 정보를 담고 있을 수 있음</br>
- rooms_tbl : 부과 및 수납의 대상이 되는 room들의 테이블 tenants_tbl의 여러 tenant를 가질 수 있고, 여러개의 charge_journal을 가질 수 있음</br>
- settings_tbl : 기본정보를 담고 있는 테이블 </br>


## TODO
- app.js에 로그인 정보 유지하는 미들웨어 추가 해야되는지 여부. => 이미 mjwtdecode를 통해 req.user에 쿠키에서 가져온 refresh token을 디코드 하여 집어넣음. 이렇게 할 경우 refresh토큰의 validity가 유지될 수 있는지가 생각해볼 점이므로 추가적인 validation이 필요한 경우에만 mcheckrefresh 미들웨어를 통해서 db와 refresh token 크로스 체크<br/>
-

## IDEA
- charges_tbl 및 payments_tbl 을 따로 만들고 각각 journals을 keep하도록 만든다. 
