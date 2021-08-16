var firebaseConfig = {
    apiKey: "AIzaSyAYja0ZnbUcKrCH-idybSq8mFQpmXGGALc",
    authDomain: "it3100-project.firebaseapp.com",
    projectId: "it3100-project",
    storageBucket: "it3100-project.appspot.com",
    messagingSenderId: "365755845241",
    appId: "1:365755845241:web:12873e6c0f7dbe8c6122a8",
    measurementId: "G-R8142EQ8WE"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

var db = firebase.firestore()

const app = {

    data() {
        return {
            name: null,
            email: null,
            age: null,

            loan_amnt: null,
            loan_duration: null,
            income: null,
            loan_grade: "0",
            loan_int_rate: null,
            person_home_ownership_rent: "0",
            defaulted: "0",

            class_result: null,
            class_confi: null,

            adding_id: null,

            loans: []
        }
    },
    mounted: function () {

        var loanRow = {}

        db.collection("loans").get().then((loans) => {
            loans.forEach((loan) => {
                // doc.data() is never undefined for query doc snapshots
                loanRow = loan.data()
                loanRow["id"] = loan.id
                this.loans.push(loanRow)
            });

            this.loans = this.loans.sort(function (a, b) {
                if (Date.parse(a["datetime"]) > Date.parse(b["datetime"])) return -1
                return 1
            })

            console.log(this.loans)
        });



        this.adding_id = document.getElementById("adding_id").value
        console.log(this.adding_id)

        if (this.adding_id != "None") {

            var doc_ref = db.collection("customers").doc(this.adding_id);


            doc_ref.get().then((doc) => {
                console.log("Cached document data:", doc.data());
                
                this.name = doc.data()["name"]
                this.email = doc.data()["email"],
                this.datetime = new Date().toLocaleString(),
                this.age = doc.data()["age"],
                this.loan_amnt = doc.data()["loan_amnt"],
                this.income = doc.data()["income"],
                this.loan_int_rate = doc.data()["loan_int_rate"],
                this.person_home_ownership_rent = doc.data()["person_home_ownership_rent"],
                this.prediction = doc.data()["prediction"],
                this.confidence = doc.data()["confidence"],
                this.profit = doc.data()["profit"]



            }).catch((error) => {
                console.log("Error getting cached document:", error);
                alert("Error 301: Error getting prediction results, please contact trilliumtay@gmail.com for help")
            });
        }



    },
    methods: {
        resetInputs: function(){
            this.name = null,
            this.email = null,
            this.age = null,

            this.loan_amnt = null,
            this.income = null,
            this.loan_grade = "0",
            this.loan_int_rate = null,
            this.person_home_ownership_rent =  "0",
            this.defaulted = "0"
        },

        addToLoan: function () {

            fetch('http://127.0.0.1:8000/predictCredit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    {
                        age: parseFloat(this.age),
                        loan_amnt: parseFloat(this.loan_amnt),
                        income: parseFloat(this.income),
                        loan_grade: parseFloat(this.loan_grade),
                        loan_int_rate: parseFloat(this.loan_int_rate),
                        person_home_ownership_rent: parseFloat(this.person_home_ownership_rent),
                        defaulted: parseFloat(this.defaulted)
                    }
                )
            })
            .then(response => response.json())
            .then(result => {
                
                this.class_result = result.classResult
                this.class_confi = result.classProba

                var amntInterest = parseInt(this.loan_int_rate) / 100 + 1
                var totalInterest = Math.pow(amntInterest, parseInt(this.loan_duration))
                var finalAmount = this.loan_amnt * totalInterest
                var finalProfit = (Math.round((finalAmount - parseFloat(this.loan_amnt)) * 100) / 100).toString()
                console.log(amntInterest.toString())
                console.log(totalInterest.toString())
                console.log(finalAmount.toString())
                console.log(finalProfit.toString())


                db.collection("loans").add({
                    name: this.name,
                    email: this.email,
                    datetime: new Date().toLocaleString(),
                    age: this.age,
                    loan_amnt: this.loan_amnt,
                    income: this.income,
                    loan_int_rate: this.loan_int_rate,
                    person_home_ownership_rent: this.person_home_ownership_rent,
                    prediction: this.class_result,
                    confidence: this.class_confi,
    
                    loan_duration: this.loan_duration,
                    profit: finalProfit

                })
                .then(() => {
                    console.log("Loans Document successfully written!");
                    window.location.reload()
                })
                .catch((error) => {
                    console.error("Error writing document: ", error);
                    alert("Error 303: Error writing document, please contact trilliumtay@gmail.com for help")
                });

            })
            .catch(error => {
                console.error('Error:', error);
                alert("Error 302: Error getting prediction results, please contact trilliumtay@gmail.com for help")
            });



        }
    }
}


Vue.createApp(app).mount('#application')