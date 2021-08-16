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
    },
    methods: {

    }
}


Vue.createApp(app).mount('#application')