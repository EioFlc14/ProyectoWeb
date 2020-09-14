function convertirImagen(){

    document.querySelector("#imagenData")
        .addEventListener("change", function (){
            //console.log(this.files)
            //const reader = new FileReader();
            window.location.assign("/imagenes");
            window.location.href= document.getElementById("#imagenData").value;
           /* reader.addEventListener("load", () => {
                //console.log(reader.result) // setear el valor en el campo
                //document.getElementById("imagenProducto").value = reader.result
                window.location.assign("/home/edison/Desktop/aaa");
                window.location.href= document.getElementById("#imagenProducto").value;
            }); */

            //reader.readAsDataURL(this.files[0]);
        });
}