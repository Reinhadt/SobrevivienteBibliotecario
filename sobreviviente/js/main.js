
const starterBtn     = document.querySelector('#start')
const jugadoresInput = document.querySelector('#jugadores')
const turnosInput    = document.querySelector('#turnos')
const turnosBtn      = document.querySelector('#turnosBtn')
const perdedoresFront= document.querySelector('#losers')


var gameController = (function(){

    //data o estado inicial de la aplicación, se actualiza conforme se juega.
    const data = {
        eliminados: [],
        jugadores: 0,
        turnos:0,
        listaJugadores: [],
        turnosInit: 0
    }

    return {
        //función que recibe un objeto y actualiza la data o state
        updateData: function(datos){
            data.jugadores = datos.jugadores;
            data.turnos    = datos.turnos;
            data.listaJugadores = datos.listaJugadores;
            data.turnosInit = datos.turnosInit;
            data.eliminados = datos.eliminados
        },
        getData: function(){
            return data;
        },
        //función que genera un rango de números entre un menor y un mayor (igual que range de php)
        range: function(start, end){
            start = parseInt(start);
            end   = parseInt(end)

            //si el mayor es igual al menor retornamos un arreglo con un elemento
            if(start === end) return [start];
            //si no, usamos recursividad para volver a llamar la función y usamos el spread operator para concatenar los nuevos elementos
            return [start, ...this.range(start + 1, end)];
        },
        //función para eliminar un elemento
        deletePlayer: function(lista){
            //primero obtenemos el elemento aleatoriamente
            let rand = lista[Math.floor(Math.random() * lista.length)];
            //retornamos un objeto a usar
            return {
                eliminado: rand,
                //filtramos entre la lista original y el elemento rand
                lista: lista.filter(el => {
                    return el !== rand
                })
            }
        }
    }

})()

//controlador para hacer cambios en el dom
var uiController = (function(){
    
    const frontListaJugadores = document.querySelector('#jugadoresLista')
    const turnosRestantes     = document.querySelector('#turnosRestantes')

    return{
        //cuando damos a start y necesitamos resetear el juego
        resetPlayers: function(){
            perdedoresFront.innerHTML = "";
        },
        //función comodín para loguear lo que necesitemos al usuario
        alerter: function(str){
            alert(str)
        },
        //función para hacer append de el estatus del juego
        listaPerdedores: function(sobrevivientes, perdedores){
            
            let html;

            //si los sobrevivientes son mayores a uno
            if(sobrevivientes.length > 1){
                html = `<p>El jugador ${perdedores[perdedores.length-1]}, ha sido eliminado, quedan ${sobrevivientes.length}</p>`
            }else{
                //si no, adjuntamos el ganador
                html = `<p>El jugador ${sobrevivientes[0]}, ha sido el sobreviviente!</p>`
            }
            
            perdedoresFront.insertAdjacentHTML('beforeend', html)
            
        },
        //función para hacer update de la data general en el DOM
        updateData: function(juegoOBJ){
            turnosRestantes.innerHTML = juegoOBJ.turnos;
            frontListaJugadores.innerHTML = juegoOBJ.listaJugadores
        }
    }

})()

//Controlador principal
var controller = (function(gameCTRL, uiCTRL){

    //función para inicializar los event listeners(turno y start)
    const setupEventListeners = function(){
        starterBtn.addEventListener('click', function(e){ 
            e.preventDefault(); 
            startGame();
        });

        turnosBtn.addEventListener('click', function(e){ 
            e.preventDefault(); 
            updateTurno();
        });
    }

    //con ésta funcióniniciamos el juego
    const startGame = function(){
        //obtenemos los datos inicializados en una variable accesible
        const datosJuego = getDatosJuego()
        //reseteo el área de jugadores que sobrevivieron y no
        uiCTRL.resetPlayers()
        //actualizamos el UI con los datos ya seteados
        uiCTRL.updateData(datosJuego)

    }

    //función para actualizar el turno
    const updateTurno = function(){

        //obtenemos la última versión de la data (como un state management)
        const gd = gameCTRL.getData();

        //si la lista de jugadores es mayor a 1 (si es menor o igual ya acabó el juego)
        if(gd.listaJugadores.length > 1){
            const newData = {...gd,turnos: gd.turnos-1};
            
            //Actualizo la data
            gameCTRL.updateData(newData)
            uiCTRL.updateData(newData)

            //si los turnos se acabaron eliminamos un jugador
            if(newData.turnos === 0){    
                eliminaJugador()
            }    
        }else{
            uiCTRL.alerter('Ingresa jugadores y turnos para comenzar de nuevo!')
        }
        
    }
    
    const eliminaJugador = function(){
        //obtenemos data actualizada(o bien un state actualizado)
        const datos = gameCTRL.getData()
        //uso una función en el controlador del juego para filtrar el eliminado
        const nuevaLista = gameCTRL.deletePlayer(datos.listaJugadores);

        //concateno en el objeto los nuevos datos
        const newData = {...datos, turnos: datos.turnosInit ,listaJugadores: nuevaLista.lista, eliminados: [...datos.eliminados, nuevaLista.eliminado]};

        //actualizamos la data
        gameCTRL.updateData(newData)
        uiCTRL.updateData(newData)

        //mandamos los datos actualizados a la lista de perdedores y sobrevivientes
        uiCTRL.listaPerdedores(newData.listaJugadores, newData.eliminados);


    }

    //función para setear los datos de inicio
    const getDatosJuego = function(){
        let jugadores
        let turnos

        //validamos que los inputs sean números
        if(/^[1-9]\d*$/.test(jugadoresInput.value) && /^[1-9]\d*$/.test(turnosInput.value)){
            //los parseamos
            jugadores = parseInt(jugadoresInput.value);
            turnos    = parseInt(turnosInput.value);
        }else{
            jugadores = null;
            turnos    = null;
        }
        
        //si no son nulos o undefined
        if(jugadores && turnos){
            //si son mayores a cero
            if(jugadores > 0 && turnos > 0){
                gameCTRL.updateData({jugadores, turnos, listaJugadores: gameCTRL.range(1, jugadores), turnosInit: turnos, eliminados: []})
            
                return {
                    jugadores,
                    turnos,
                    listaJugadores: gameCTRL.range(1, jugadores),

                }    
            }else{
                uiCTRL.alerter('Los números debes ser mayores a cero')
            }
            
        }else{
            uiCTRL.alerter('Los datos recibidos deben ser números enteros positivos')
        }
    }

    return{
        init:function(){
            setupEventListeners();
            const datos = gameCTRL.getData();
            uiCTRL.updateData(datos)
        }
    }

})(gameController, uiController)

//Función de inicio
controller.init()