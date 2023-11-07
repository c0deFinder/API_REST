const resultado = document.getElementById("resultado")
const ApiURL = 'https://mindicador.cl/api/';;
const GetCantidad = document.getElementById("cantidad_1").value;
const boton = document.getElementById("tasa")
const cambio = document.getElementById("cambio")
const moneda2 = document.getElementById("moneda2")
const graphic = document.getElementById("grafica");
let chart;



    async function getCoins() {
        try {
            const res = await fetch(ApiURL);
            const data = await res.json();
            console.log(data);
            return data;
        } catch (error) {
            alert('No se pudo acceder, intente mas tarde')
        }      
        }
        getCoins();

        async function ShowCoins() { //agreaga los option a la etiqueta select desde la api
            try {
                const data = await getCoins();
                Object.keys(data).forEach((Coin_k) => {
                    const coin = data[Coin_k];
                    if (coin.codigo && coin.valor) {
                        const option = document.createElement('option');
                        option.value = coin.valor;
                        option.textContent = `${coin.codigo}`;
                        moneda2.appendChild(option);
                    }
                });
            } catch (error) {
                console.error(error);
            }
        }
        async function convertCoins() { //convierte el valor a la moneda seleccionada y muestra el grafico
            const CoinSelection = parseFloat(moneda2.value);
            const pesosValue = parseFloat(cantidad_1.value);
            graphic.innerHTML = '';
            if (!isNaN(pesosValue) && !isNaN(CoinSelection) && pesosValue >= 0) {
                const results = pesosValue / CoinSelection;
                resultado.textContent = `$${results.toFixed(2)}`;
                let dates = await getDates();
                let value = await getValue();
                graphs(dates, value);
            } else {
                alert('seleccione una moneda válida y un monto superior a cero');
            }
        }
        function resetDate(date) { //formatea la fecha con el formato d/m/a
            const dateNow = new Date(date);
            const day = dateNow.getDate();
            const month = dateNow.getMonth() + 1;
            const year = dateNow.getFullYear();
            return `${day}/${month}/${year}`;
        }
        async function getDates() { //obtine las ultimas 10 fechas de la moneda seleccionada
            try {
                const selected = moneda2.options[moneda2.selectedIndex].textContent;
                const url = ApiURL+selected;
                const res = await fetch(url);
                const data = await res.json();
                const pickCoin = data.serie;
                const dates = pickCoin.map(coin1 => coin1.fecha);
                const newDate = dates.map(resetDate);
                const LastDates = newDate.slice(0, 10);
                LastDates.reverse();
                return LastDates;
            } catch (error) {
                console.error(error);
            }
        }
        async function getValue() { //obtiene los ultimos 10 valores de la moneda seleccionada
            try {
                const selected = moneda2.options[moneda2.selectedIndex].textContent;
                const url = ApiURL+selected;
                const res = await fetch(url);
                const data = await res.json();
                const pickCoin = data.serie;
                const value1 = pickCoin.map(coin1 => coin1.valor);
                const value10 = value1.slice(0, 10);
                return value10;
            } catch (error) {
                console.error(error);
            }
        }

        function graphs(date,value){ //despliega el grafico con los array de las ultimas 10 fehcas y valuees de la moneda seleccionada
            const labels = date;
            
            const dataset = {
                label: "Ultimos 10 días",
                data: value,
                borderColor: 'rgba(248, 37, 37, 0.8)',
                fill: false,
                tension: 0.1
            };
            
            const data = {
                labels: labels,
                datasets: [dataset]
            };
            
            const config = {
                type: 'line',
                data: data,
            };
            if (chart) chart.destroy();
            chart = new Chart(graphic, config);
            
        }

        window.addEventListener('load', ShowCoins);
        boton.addEventListener('click', convertCoins);


  
  
  
  
  
  
  
