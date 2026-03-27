# API Testing Methodswen dang

## gai shu
ben wen dang jian yao zong jie nei buEnterprise MallAPIdeTestfang fa he shi yong gong ju。

## Testgong ju
- shi yongNode.jsyuan sheng`http`he`https`mo kuai jin xingAPITest
- Testjiao ben wei zhi：`backend/test-api.js`

## Testfang fa

### 1. ji chuHTTPqing qiu han shu
Createfeng zhuangPromisede`makeRequest`han shu，zhi chiGEThePOSTqing qiu，chu li xiang ying shu ju。

### 2. Testliu cheng
1. **Health CheckTest**：yan zheng fu wu qi shi fou zheng chang yun xing
   - GETqing qiu：`/api/health`

2. **Adminren zhengTest**：huo quJWTling pai yong yu hou xu ren zheng
   - POSTqing qiu：`/api/admin/login`
   - qing qiu ti：`{"username": "admin", "password": "admin123"}`

3. **gong kaiAPITest**（wu xu ren zheng）：
   - huo quProductList：`GET /api/products`
   - huo quProductCategory：`GET /api/products/categories`

4. **AdminAPITest**（xu yao ren zheng）：
   - huo quAdminProductList：`GET /api/admin/products`
   - huo quAdminCategoryList：`GET /api/admin/categories`
   - CreateProduct：`POST /api/admin/products`
   - qing qiu ti shi li：
     ```json
     {
       "name": "APITestProduct",
       "description": "TestProductmiao shu",
       "price": 99.99,
       "pointsRequired": 20,
       "stock": 50,
       "categoryId": 1,
       "specifications": {
         "color": "lan se",
         "size": "L"
       },
       "exchangeRules": "mei ren xian dui1ge"
     }
     ```

## ren zheng ji zhi
- shi yongBearer Tokenren zheng
- qing qiu tou ge shi：`Authorization: Bearer ${token}`

## Testjie guo yan zheng
mei geAPITestdu hui shu chu：
- HTTPStatusma
- xiang ying ti nei rong

## yun xingTest
```bash
cd backend
node test-api.js
```

## Testshun xu yao qiu
1. bi xu xian jin xingHealth Check
2. ran hou jin xingAdminLoginhuo qutoken
3. wu xu ren zheng de gong kaiAPIke sui shiTest
4. xu yao ren zheng deAdminAPIbi xu xian huo qu you xiaotoken