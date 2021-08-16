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
            name: "Trillium",
            email: "trilliumtay@gmail.com",
            age: "20",

            loan_amnt: "10000",
            income: "50000",
            loan_grade: "0",
            loan_int_rate: "5",
            person_home_ownership_rent: "0",
            defaulted: "0",

            class_result: null,
            class_confi: null,
            regress_result: "102"
            
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
                fetch('http://127.0.0.1:5000/predictCredit', {
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
                        this.class_confi = result.class_confi
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
                            toastr.success('Hi! I am success message.');
                            window.scrollTo(0,document.body.scrollHeight);
                        })
                        .catch((error) => {
                            console.error("Error writing document: ", error);
                        });
    
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        alert("Error getting prediction results, please contact trilliumtay@gmail.com for help")
                    });
            } else {
                alert("All fields must not be empty!")
            }



        },

        firebaseTest: function () {
        }



    }
}


Vue.createApp(app).mount('#application')