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
            income: null,
            loan_grade: "0",
            loan_int_rate: null,
            person_home_ownership_rent: "0",
            defaulted: "0",

            class_result: null,
            class_confi: null,
            regress_result: null,
            
        }
    },
    methods: {
        test: function () {
            console.log(this.name)
        },

        whatOwner: function () {
            console.log(this.person_home_ownership_rent, this.defaulted)
        },

        predictCredit: function () {
            if (true) {
                console.log(JSON.stringify(
                    {
                        age: this.age,
                        loan_amnt: this.loan_amnt,
                        income: this.income,
                        loan_grade: this.loan_grade,
                        loan_int_rate: this.loan_int_rate,
                        person_home_ownership_rent: this.person_home_ownership_rent,
                        defaulted: this.defaulted
                    }
                ))
                fetch('http://it3100-191885t-it3100project.southeastasia.azurecontainer.io/predictCredit', {
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
                        this.regress_result = result.regressResult
    
                        db.collection("customers").add({
                            name: this.name,
                            email: this.email,
                            datetime: new Date().toLocaleString(),
                            age: this.age,
                            loan_amnt: this.loan_amnt,
                            income: this.income,
                            loan_int_rate: this.loan_int_rate,
                            person_home_ownership_rent: this.person_home_ownership_rent,
                            prediction: this.class_result,
                            confidence: this.class_confi
                        })
                        .then(() => {
                            console.log("Document successfully written!");
                            window.scrollTo(0,document.body.scrollHeight);
                        })
                        .catch((error) => {
                            console.error("Error writing document: ", error);
                        });
    
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        alert("Error 101: Error getting prediction results, please contact trilliumtay@gmail.com for help")
                    });
            } else {
                alert("All fields must not be empty!")
            }



        },

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
        }



    }
}


Vue.createApp(app).mount('#application')