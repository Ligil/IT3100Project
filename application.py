from flask import Flask
from flask import jsonify
from flask import request

from joblib import dump, load

from sklearn.preprocessing import StandardScaler
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

CreditClassif = load("models/CreditClassif.joblib")

@app.route("/")
def hello():
    target = ['Non-default', 'Default']


    sc = StandardScaler()
    result = CreditClassif.predict([[50000, 0.5, 0, 5.00, 1, 0]])
    #result = CreditClassif.predict([[sc.fit_transform(50000), 0.5, 0, sc.fit_transform(5.00), 1, 0]])
    # Return the result to your app or Postman
    print(result)
    return jsonify({'result' : str(result[0])})


@app.route('/predictCredit', methods=['POST'])
def predict():
    input = request.get_json()
    target = ['Non-default', 'Default']

    # Process input
    #[["person_income", "loan_percent_income", "loan_grade", "loan_int_rate", "person_home_ownership_RENT", "cb_person_default_on_file", "loan_status"]]
    #Annual income, decimal of loan that income is, Letter A B C (0, 1, 2) [A representing lower return but safer]
    #Interest rate, 1 or 0 if lending for RENT, 1 or 0 if defaulted before

    sc = StandardScaler()
    #sc.fit_transform([[input['income']]])
    income = input['income']
    print(income)
    loan_perc_income = input['loan_perc_income']
    loan_grade = input['loan_grade']
    loan_int_rate = input['loan_int_rate']
    person_home_ownership_rent = input['person_home_ownership_rent']
    defaulted = input['defaulted']

    result = CreditClassif.predict([[income, loan_perc_income, loan_grade, loan_int_rate, person_home_ownership_rent, defaulted]])
    # Return the result to your app or Postman
    return jsonify({'result' : target[int(result[0])]})

if __name__ == "__main__":
    app.run(debug=False)


