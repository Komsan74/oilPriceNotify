## ดึงราคาน้ำมัน ปตท. จาก SOAP-XML WEB SERVICE
สำหรับการดึงราคาน้ำมันจากเว็บเซอร์วิสของ ปตท. ในปัจจุบันก็มีกันหลากหลายวิธี ที่นิยมกันมากก็คือการฝังโค้ด iframe ลงไปเลยเพราะง่ายดี
แต่หากผู้พัฒนาต้องการจะนำข้อมูลที่ได้มา ไปปรับเปลี่ยนปรุงแต่งให้เป็นเอกลักษณ์เฉพาะตัว หรือต้องการเพียงแค่ข้อความธรรมดา ๆ เพื่อนำไปส่งข้อความแจ้งเตือน
หรือจะนำข้อมูลที่ได้ไปใช้ประโยชน์อื่น ๆ ตัวอย่างนี้ อาจจะเป็นแนวทางหนึ่ง ที่มีประโยชน์ให้นำไปพัฒนาต่อยอดได้อีก

## PTTOR OilPrice Web Service
URL : 	https://orapiweb.pttor.com/oilservice/OilPrice.asmx  
Document : https://orapiweb.pttor.com/oilservice/OilPrice.asmx?wsdl   

เมื่อคลิก URL เข้าไปดูก็จะพบว่ามีเว็บเซอร์วิสรอให้เลือกใช้งานอยู่ 4 รายการดังนี้
- [CurrentOilPrice](https://orapiweb.pttor.com/oilservice/OilPrice.asmx?op=CurrentOilPrice)
- [CurrentOilPriceProvincial](https://orapiweb.pttor.com/oilservice/OilPrice.asmx?op=CurrentOilPriceProvincial)
- [GetOilPrice](https://orapiweb.pttor.com/oilservice/OilPrice.asmx?op=GetOilPrice)
- [GetOilPriceProvincial](https://orapiweb.pttor.com/oilservice/OilPrice.asmx?op=GetOilPriceProvincial)   

โดยตัวอย่างนี้จะเลือกใช้ [CurrentOilPrice](https://orapiweb.pttor.com/oilservice/OilPrice.asmx?op=CurrentOilPrice) มาเขียน Google AppScript เพื่อดึงข้อมูลจากเว็บเซอร์วิสออกมาใช้งาน

## HTTP Method
SOAP 1.2 request    
```HTTP
POST /oilservice/OilPrice.asmx HTTP/1.1
Host: orapiweb.pttor.com
Content-Type: application/soap+xml; charset=utf-8
Content-Length: length

<?xml version="1.0" encoding="utf-8"?>
<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
  <soap12:Body>
    <CurrentOilPrice xmlns="http://www.pttor.com">
      <Language>string</Language>
    </CurrentOilPrice>
  </soap12:Body>
</soap12:Envelope>
```
จากข้อความ *xml* ด้านบน ในส่วนของ *`string`*  
ภายใต้แท็ก `<Language>string</Language>`  

เราก็เปลี่ยนเป็นชื่อย่อของภาษาที่ต้องการ  
ในที่นี้มีสองภาษาคือ  

*`en`* ภาษาอังกฤษ  

```<Language>en</Language>```  
  
*`th`* ภาษาไทย  

```<Language>th</Language>```

## Google AppScript
### getSoapContent()   
เมื่อพิจารณาโครงสร้างของ HTTP Request ข้างต้นแล้ว เราสามารถแยกส่วนสำคัญที่จะเรียกใช้ดังนี้
- Web Service URL
- HTTP Options
- XML Body  

และนำรายละเอียดสำคัญจาก HTTP Options มาเขียนเป็นฟังก์ชั่นเปล่า ๆ ไว้รอเรียกใช้งานแบบนี้   
```javascript
function getSoapContent(url, bodyXML) {
  var xml = bodyXML;
  var options = {
    method: "post",
    contentType: "text/xml",
    charset: "utf-8",
    payload: xml,
    muteHttpExceptions: true,
  }
  var soapContent = UrlFetchApp.fetch(url, options);
  let result = XmlService.parse(soapContent).getRootElement();

  return result;
}
```
เมื่อทำการเรียกให้ฟังก์ชั่น ถ้าเราใส่ *url* และ *bodyXML* ที่ถูกต้องเข้าไป ก็ควรจะได้ผลลัพท์ดังนี้
```xml
[Element: <soap:Envelope [Namespace: http://www.w3.org/2003/05/soap-envelope]/>]
```

ซึ่งเป็น *root element* ของ  *SOAP Message*

### ยังเขียนไม่จบนะครับ จะรีบกลับมาเพิ่มเติมเร็ว ๆ นี้...
