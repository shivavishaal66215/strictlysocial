from flask import Flask, redirect,request,jsonify
import pandas as pd
from pymongo import MongoClient

app = Flask(__name__)

def recommend(target_user,blacklist):
    #connecting to database and fetching the collections
    client = MongoClient('localhost',27017)
    db = client.social #replace with name of your db
    interests = db.interests #replace with the collection that contains all the interests
    userInterests = db.userinterests #replace with the collection that has data of user-interests

    cursor = interests.find()
    record = cursor[0]
    global_interests = record['interests']
    global_interests.insert(0,'user')

    cursor = userInterests.find()
    
    #constructing a dataframe from collections: interests,userInterests
    users = []
    for record in cursor:
        d = {}
        d['user'] = record['username']
        
        for interest in record['interests']:
            d[interest] = 1.0

        users.append(d)

    df = pd.DataFrame(users)
    #Basic pre-processing
    df.fillna(0,axis=1,inplace=True)
    num_columns = len(df.columns)

    #finding out where the target_user occurs in df
    index_target = 0
    for user in df['user']:
        if(user == target_user):
            break
        index_target += 1

    users_score = {}
    #use manhattan distance to compute scores for users. [taken pairwise]
    for i in range(len(df)):
        if(i == index_target):
            continue
        cur_user = df.iloc[i,0]
        if(cur_user in blacklist): #use blacklist to prevent recommending existing friends
            continue
        users_score[cur_user] = 0
        for j in range(0,num_columns-1):
            users_score[cur_user] += abs(int(df.iloc[index_target,j+1]) - int(df.iloc[i,j+1]))

    #sorted in ascending order. similar users will have lower scores
    #as more users are added into the system, you might want to limit the number of recommendations
    users_score_sorted = dict(sorted(users_score.items(),key=lambda item: item[1]))


    result_set = []
    for users in users_score_sorted.keys():
        result_set.append(users)

    return result_set

@app.route("/recommend")
def home():
    # try:
    input_data = request.form.to_dict()
    user_id = input_data['userid']

    blacklist = input_data['blacklist'].split(',')
    data = recommend(user_id,blacklist)
    
    result = {
        'msg': "recommendation sucessfully made",
        'data': data
    }

    return jsonify(result),200
    # except:
    #     result = {
    #         'msg': "something went wrong",
    #         'data': {}
    #     }

    #     return jsonify(result),403

if __name__ == '__main__':
    app.run(debug = True)
