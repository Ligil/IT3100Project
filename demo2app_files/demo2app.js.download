const demo2App = {
    
    data() {
        return {
            sepalLength: "",
            sepalWidth: "",
            petalLength: "",
            petalWidth: ""
        }
    }, 
    methods: {
        predictIrisSpecies: function() {
            console.log(JSON.stringify(
                {
                    sepalLength: this.sepalLength,
                    sepalWidth: this.sepalWidth,
                    petalLength: this.petalLength,
                    petalWidth: this.petalWidth,
                }
            ))
            fetch('http://127.0.0.1:8000/classifyIris', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },                
                body: JSON.stringify(
                    {
                        sepalLength: parseFloat(this.sepalLength),
                        sepalWidth: parseFloat(this.sepalWidth),
                        petalLength: parseFloat(this.petalLength),
                        petalWidth: parseFloat(this.petalWidth),
                    }
                )
            })
            .then(response => response.json())
            .then(result => {
                alert(result.result)
            })
            .catch(error => {
                console.error('Error:', error);
            });            
        }
    }
}


Vue.createApp(demo2App).mount('#demo2app')