const API_URL =
"https://script.google.com/macros/s/AKfycbzvTP0fucQOfvu-H3eOnseMO2cDa2bzMdKgYIejdlYdWeXupyQ-7qaKEiKek6NzWUdt0g/exec";



function findProduct(){


let article =
document
.getElementById("article")
.value
.trim();



if(article===""){

alert("Введите артикул");

return;

}



fetch(
API_URL + "?article=" + encodeURIComponent(article)
)

.then(response=>response.json())

.then(data=>{


showProduct(data);


})

.catch(error=>{


console.error(error);

alert("Ошибка связи с API");


});


}




function showProduct(data){


let result =
document.getElementById("result");



if(!data.success){


result.innerHTML=`

<div class="card">

❌ ${data.error}

</div>

`;


return;

}



result.innerHTML=`

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
Ячейка:
</p>

<div class="cell">

${data.cell}

</div>


</div>

`;



}




function startScanner(){

alert(
"Сканер подключим следующим шагом"
);

}
