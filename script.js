const API_URL =
"https://script.google.com/macros/s/AKfycbzvTP0fucQOfvu-H3eOnseMO2cDa2bzMdKgYIejdlYdWeXupyQ-7qaKEiKek6NzWUdt0g/exec";



let codeReader = null;



/*
========================================
Поиск товара
========================================
*/


function findProduct(){


    const article =
    document
    .getElementById("article")
    .value
    .trim();



    if(article===""){

        alert("Введите артикул");

        return;

    }



    fetch(
        API_URL +
        "?article=" +
        encodeURIComponent(article)
    )

    .then(response => response.json())

    .then(data => {

        showProduct(data);

    })

    .catch(error => {

        console.error(error);

        showMessage(
            "Ошибка соединения с сервером"
        );

    });


}





/*
========================================
Вывод товара
========================================
*/


function showProduct(data){


const result =
document.getElementById("result");



if(!data.success){


result.innerHTML = `

<div class="card">

❌ ${data.error}

</div>

`;

return;


}



result.innerHTML = `

<div class="card">


<div class="title">

${data.name}

</div>


<p>
Артикул:
<b>${data.article}</b>
</p>


<p>
Количество:
<b>${data.quantity}</b>
</p>


<p>
Ячейка хранения:
</p>


<div class="cell">

${data.cell}

</div>


</div>

`;



}





/*
========================================
Запуск сканера ZXing
========================================
*/


async function startScanner(){


const video =
document.getElementById("video");


const scanner =
document.getElementById("scanner");



scanner.style.display="block";



codeReader =
new ZXing.BrowserMultiFormatReader();



try{


const devices =
await codeReader.listVideoInputDevices();



if(devices.length===0){


alert(
"Камера не найдена"
);

return;


}




// выбираем последнюю камеру
// обычно задняя камера телефона

const selectedDeviceId =
devices[devices.length-1].deviceId;



codeReader.decodeFromVideoDevice(

selectedDeviceId,

video,

(result, error)=>{


if(result){


console.log(
"Штрихкод:",
result.text
);



let article =
formatArticle(result.text);



document
.getElementById("article")
.value =
article;



stopScanner();



findProduct();



}


}


);



}

catch(error){


console.error(
"Ошибка камеры:",
error
);


alert(
"Ошибка камеры: "
+
error.message
);


}



}





/*
========================================
Остановка камеры
========================================
*/


function stopScanner(){



if(codeReader){


codeReader.reset();


}



document
.getElementById("scanner")
.style.display="none";


}





/*
========================================
Формат артикула
2503001 → 25.03.001
========================================
*/


function formatArticle(code){


code =
String(code)
.replace(/\D/g,"");



if(code.length===7){


return (

code.substring(0,2)
+
"."
+
code.substring(2,4)
+
"."
+
code.substring(4)

);


}



return code;


}





function showMessage(text){


document
.getElementById("result")
.innerHTML = `

<div class="card">

${text}

</div>

`;

}
