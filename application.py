from flask import Flask
from flask import jsonify
from flask import request

from joblib import dump, load

from sklearn.preprocessing import StandardScaler
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

CreditClassif = load("models/CreditClassif.joblib")
CreditRegress = load("models/CreditRegress.joblib")

@app.route("/")
def hello():
    return jsonify({'result' : "meow"})

@app.route('/predictCredit', methods=['POST'])
def predict():
    input = request.get_json()
    target = ['Non-default', 'Default']

    # Process input
    #[["person_age", "loan_amnt", "person_income", "loan_percent_income", "loan_grade", "loan_int_rate", "person_home_ownership_RENT", "cb_person_default_on_file", "loan_status"]]
    #Annual income, decimal of loan that income is, Letter A B C (0, 1, 2) [A representing lower return but safer]
    #Interest rate, 1 or 0 if lending for RENT, 1 or 0 if defaulted before

    #[["person_age", "person_income", "loan_percent_income", "loan_grade", "loan_int_rate", "person_home_ownership_RENT", "cb_person_default_on_file"]]

    sc = StandardScaler()
    sc.scale_ = [6.23531198e+04, 6.32772655e+03, 3.22918456e+00]  
    sc.mean_ = [6.66452616e+04, 9.65524689e+03, 1.10398498e+01]
    sc.var_ = [3.88791155e+09, 4.00401233e+07, 1.04276329e+01]
    sc.n_samples_seen_ = 28636


    age = input['age']
    loan_perc_income = round(input['loan_amnt']/input['income'], 2)

    loan_grade = input['loan_grade']

    income, loan_amnt, loan_int_rate = sc.transform([[input['income'], input['loan_amnt'], input['loan_int_rate']]])[0]

    person_home_ownership_rent = input['person_home_ownership_rent']
    defaulted = input['defaulted']

    creditResult = CreditClassif.predict([[age, loan_amnt, income, loan_perc_income, loan_grade, loan_int_rate, person_home_ownership_rent, defaulted]])
    classProba = CreditClassif.predict_proba([[age, loan_amnt, income, loan_perc_income, loan_grade, loan_int_rate, person_home_ownership_rent, defaulted]])
    confidence = max(classProba[0])
    print(confidence)
    regressResult = CreditRegress.predict([[age, income, loan_grade, loan_int_rate, person_home_ownership_rent, defaulted]])
    # Return the result to your app or Postman
    return jsonify({   'classResult' : target[int(creditResult[0])], 'classProba' : confidence,  'regressResult' : regressResult[0]  })


@app.route('/test', methods=['POST'])
def test():
    

    return jsonify("Test")

if __name__ == "__main__":
    app.run(debug=False)


