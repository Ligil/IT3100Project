const app = {
    
    data() {
        return {
            income: "50000",
            loan_perc_income: "0.5",
            loan_grade: "0",
            loan_int_rate: "5",
            person_home_ownership_rent: "1",
            defaulted: "0"
        }
    }, 
    methods: {
        test: function(){
            console.log("Hi")
        },

        predictCredit: function() {
            console.log(JSON.stringify(
                {
                    income: this.income,
                    loan_perc_income: this.loan_perc_income,
                    loan_grade: this.loan_grade,
                    loan_int_rate: this.loan_int_rate,
                    person_home_ownership_rent: this.person_home_ownership_rent,
                    defaulted: this.defaulted
                }
            ))
            fetch('http://127.0.0.1:5000/predictCredit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },                
                body: JSON.stringify(
                    {
                        income: parseFloat(this.income),
                        loan_perc_income: parseFloat(this.loan_perc_income),
                        loan_grade: parseFloat(this.loan_grade),
                        loan_int_rate: parseFloat(this.loan_int_rate),
                        person_home_ownership_rent: parseFloat(this.person_home_ownership_rent),
                        defaulted: parseFloat(this.defaulted)
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


Vue.createApp(app).mount('#application')