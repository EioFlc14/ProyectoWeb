

function cambiarTotal(){
        document.querySelector("#cantidad")
            .addEventListener("blur", function (){
                console.log("si")
                const total = Number(document.getElementById("cantidad").value) * Number(document.getElementById("precio").value)
                document.getElementById("valor").value = total
            });
}

