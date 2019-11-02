
function reduceBooks(b){

    //declaro un arreglo vacío para guardar los objetos únicos
    const unique = []
    
    //itero en el arreglo de objetos que recibo (splitted en este caso)
    b.forEach(item => {
        //filtro si hay elementos existentes en el arreglo unique que coincidan con 
        //la propiedad "cat" de cada objeto de mi arreglo 'b'
        let existing = unique.filter((v, i) => {
            return v.cat == item.cat
        });
        
        //Si existing tiene elementos(si encontró coincidencias)
        if(existing.length){

            //busco dentro del arreglo el index coincidente
            let existingIndex = unique.indexOf(existing[0])
            
            //ya que encontró la coincidencia obtengo la cantidad y la asigno a la suma
            //de la coincidencia(unique[existingIndex].cantidad + la cantidad del item del objeto que estamos iterando)
            unique[existingIndex].cantidad = parseInt(unique[existingIndex].cantidad) + parseInt(item.cantidad)

        }else{
            //si no hay coincidencias, checamos que el item iterado sea string
            if(typeof item.cantidad == 'string'){
                //lo convertimos a entero
                item.cantidad = parseInt(item.cantidad)
                //se agrega al arreglo a devolver
                unique.push(item)
            }
        }

    });
    
    //retornamos el arreglo con coincidencias de objetos
    return unique
}


//función que recibe un arreglo, separa
function splitBooks(b){

    const splitted = b.map(el => {
        let book = el.split(' ');
        //extraigo el primer caracter que funciona como categoría en éste caso
        let first = book[0].charAt(0);

        //retorno los valores en un objeto compuesto de categoría y cantidad
        return {cat:first, cantidad:book[1]}
    })
    
    return splitted;
}


//La función makeDictionary toma ambos parámetros
function makeDictionary(booksArr, cats){

    //Llamo la función splitBooks para separar título del libro de las existencias 
    // por ejemplo: {'HARRY_POTTER_Y_LA_ORDEN_DEL_FENIX 10', 10}
    const splitted = splitBooks(booksArr);

    //Llamo la función reduceBooks para mandar los elementos ya en split 
    //y reducir los que coincidan
    const reduced = reduceBooks(splitted);

    //arreglo vacío a llenar
    const f = []

    //iteramos en categorías
    for(var i in cats){
        //iteramos en el arreglo ya reducido con las cantidades sumadas
        for (var j in reduced){
            //si el elemento de cats que estamos iterando coincide con el elemento del objeto que estamos iterando
            if(cats[i] ===  reduced[j].cat){
                //se integra a nuestro arreglo vacío
                f.push(reduced[j])
            }
        }
    }

    console.log(f)
    //arreglo a devolver
    return f

}

//Variable que almacena los libros y sus existencias
const books = ['BARCELONA_HISTORIA 20', 'HARRY_POTTER 30', 'HARRY_POTTER_Y_LA_ORDEN_DEL_FENIX 10', 'BATMAN_LEGACY 30', 'BATMAN_LEGACY_EL_REGRESO 30', 'EL_TUNEL 10'];

//Función que toma los dos parámetros(libros y categorías)
makeDictionary(books, ['H', 'X', 'Z', 'B'])