const API_URL =
"https://script.google.com/macros/s/AKfycbzvTP0fucQOfvu-H3eOnseMO2cDa2bzMdKgYIejdlYdWeXupyQ-7qaKEiKek6NzWUdt0g/exec";


let codeReader = null;


/*
========================================
Поиск товара по артикулу
========================================
*/

function findProduct(){


    const article =
        document
        .getElementById("article")
        .value
        .trim();



    console.log(
        "Поиск артикула:",
        article
    );



    if(article === ""){


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


        console.log(
            "Ответ API:",
            data
        );


        showProduct(data);


    })


    .catch(error => {


        console.error(
            "Ошибка API:",
            error
        );


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



    scanner.style.display = "block";



    try {


        codeReader =
            new ZXing.BrowserMultiFormatReader();



        const devices =
            await codeReader.listVideoInputDevices();



        console.log(
            "Камеры:",
            devices
        );



        if(devices.length === 0){


            alert(
                "Камера не найдена"
            );


            return;


        }



        // выбираем заднюю камеру

        let selectedDeviceId =
            devices[devices.length - 1]
            .deviceId;




        codeReader.decodeFromVideoDevice(

            selectedDeviceId,

            video,


            (result,error)=>{


                if(result){


                    console.log(
                        "Получен штрихкод:",
                        result.text
                    );



                    let article =
                        formatArticle(
                            result.text
                        );



                    console.log(
                        "Сформирован артикул:",
                        article
                    );



                    const input =
                        document
                        .getElementById("article");



                    input.value = article;



                    input.dispatchEvent(
                        new Event("input")
                    );



                    stopScanner();



                    setTimeout(()=>{


                        findProduct();


                    },300);



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


    console.log(
        "formatArticle получил:",
        code
    );



    let value =
        String(code)
        .replace(/\D/g,"");



    /*
    Если штрихкод длиннее,
    берем последние 7 цифр
    */


    if(value.length > 7){


        value =
            value.slice(-7);


    }




    if(value.length === 7){


        return (

            value.substring(0,2)
            +
            "."
            +
            value.substring(2,4)
            +
            "."
            +
            value.substring(4,7)

        );


    }



    return value;


}







/*
========================================
Поиск всех товаров в ячейке
========================================
*/


function findCell(){


    const cell =
        document
        .getElementById("cell")
        .value
        .trim();



    if(cell===""){


        alert(
            "Введите ячейку"
        );


        return;


    }




    fetch(

        API_URL +
        "?cell=" +
        encodeURIComponent(cell)

    )


    .then(r=>r.json())


    .then(data=>{


        showCellProducts(data);


    });


}





function showCellProducts(data){


    const result =
        document.getElementById("result");



    if(!data.products ||
       data.products.length===0){


        result.innerHTML = `

        <div class="card">

        В ячейке нет товаров

        </div>

        `;


        return;


    }



    let html = `

    <div class="card">

    <h3>
    Ячейка:
    ${data.cell}
    </h3>

    `;



    data.products.forEach((p,index)=>{


        html += `

        <hr>


        <b>
        ${index+1}. ${p.name}
        </b>


        <p>
        Артикул:
        ${p.article}
        </p>


        <p>
        Количество:
        ${p.quantity}
        </p>


        `;


    });



    html += "</div>";



    result.innerHTML = html;


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
