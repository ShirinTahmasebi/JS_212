# JS_212

[Overall directory tree](#directory-tree)

[Overall architecture](#overall-architecture)

[Web services](#web-service)

[Error codes](#error-codes)

## Task List:
### Request handlers:
- [ ] Add authentication section
- [x] Add handler for get simple question
- [x] Add handler for get multi-choice question
- [x] Add handler for answer simple question
- [x] Add handler for answer multi-choice question
- [x] Add handler for retrieve conversations
- [x] Add handler for retrieve conversations
- [x] Add suitable error handlers
### Test cases:
- [x] Add test cases for questions queries
- [x] Add test cases for answers queries
### Persistance:
- [ ] Store sessions in redis
- [x] Store questions in mysql
- [x] Store answers in mongodb
### Refactoring:
- [x] Code review
- [x] Complete test case to see if all scenarios are added or not 


## Directory Tree
```
+-- docs      ===> Contains exported files from mysql database schema
+-- src
|   +-- controller
|   |   +-- v1
|   |   |   +-- answers.js     ===> Contains handler methods for routes which are defined in routes/v1/answers.js
|   |   |   +-- questions.js     ===> Contains handler methods for routes which are defined in routes/v1/questions.js
|   |   |   +-- index.js
|   +-- db
|   |   +-- mongo_connection.js    ===> Contains methods to create connection to mongodb
|   |   +-- mysql_connection.js    ===> Contains methods to create connection and make query to mysql
|   |   +-- queries.js    ===> Contains query strings
|   |   +-- index.js
|   +-- model
|   +-- repository
|   |   +-- answers.js     ===> Contains methods to retrieve answers info from databases
|   |   +-- questions.js     ===> Contains methods to retrieve questions info from databases
|   |   +-- index.js
|   +-- routes
|   |   +-- errors    ===> Contains error code and relevant methods 
|   |   +-- v1        ===> Contains middlewares
|   +-- utils
+-- test/v1
|   +-- index.test.js   
|   +-- answers.test.js    ===> Contains test cases for answers' requests
|   +-- questions.test.js    ===> Contains test cases for questions' requests
+-- app.js
|
|
...
```

## Overall Architecture
<img src="https://github.com/ShirinTahmasebi/JS_212/blob/master/docs/overall_architecture.png" alt="architecture" width="1000" height="1000">


## Web Service
 
### Get a question (and its choices)


* Request: ```GET http://localhost:3000/api/v1/questions/single```</br>
* Header: ```{user_id: 1}``` </br>
* Response:</br>
Different types of questions will be returned:</br>
  1. Simple
      ```
      {
        "error": {},
        "data": {
            "question_id": 3,
            "question_type": 1,
            "question_text": "Question 3 Text"
        }
      }
      ```
  
  2. Multi-choice
  
      Every choice has a choice_id field which specifies if it is audio, text, image or video. If the choice has text type, the choice field will be a simple text. Otherwise, choice field will be a link to get the file from.

      Type  | choice_type field
      ------------ | -------------
      Text | 1
      Audio | 2
      Image | 3
      Video | 4

      ```
      {
        "error": {},
        "data": {
            "question_id": 1,
            "question_type": 2,
            "question_text": "Question 1 Text",
            "choices": [
                {
                    "choice_id": 1,
                    "choice_type": "1",
                    "choice": "choice 1"
                }, ...
            ]
        }
      }
      ```


### Get a question with specific type
To get question with specific type, you should add question_type at the end of the url based on the below table: 
 
   Type  | question_type field
  ------------ | -------------
  Simple | 1
  Multi-choice | 2
  
  So, here is an example of getting a simple question:
  
  * Request: ```GET http://localhost:3000/api/v1/questions/single?question_type=1```</br>
  * Header: ```{user_id: 1}``` </br>
  * Response:</br>
    ```
    {
      "error": {},
      "data": {
          "question_id": 3,
          "question_type": 1,
          "question_text": "Question 3 Text"
      }
    }
    ```
  
  ### Answer to simple question
  To answer to a simple question, you should add `answer_text` field in request body. By the way, the question id should be placed in the URL.
  E.g. we want to send answer to a question which its id is 2 and its type is simple:
  
  * Request: ```POST http://localhost:3000/api/v1/questions/2/answer```</br>
  * Header: ```{user_id: 1}``` </br>
  * Body: ```{"answer_text": "Hi"}```
  * Response:</br>
    ```
    {
      "error": {},
      "data": {
          "question_type": 1,
          "question_id": "2",
          "answer_text": "Hi"
      }
    }
    ```
    
### Answer to multi-choice question

  To answer to a multi-choice question, you should add `answer_choices_ids` field in request body. This field is an array of choice ids.
  By the way, the question id should be placed in the URL.
  E.g. we want to send answer to a question which its id is 2 and its type is multi-choice:
  
  * Request: ```POST http://localhost:3000/api/v1/questions/2/answer```</br>
  * Header: ```{user_id: 1}``` </br>
  * Body:  ```{"answer_choices_ids": [1,2]}``` </br>  
  * Response:</br>
    ```
    {
      "error": {},
      "data": {
          "question_id": "1",
          "answer_choices_ids": [
              1,
              2
          ],
          "question_type": 2
      }
    }
    ```
    
### Get questions and answers of a user
  
  * Request: ```GET http://localhost:3000/api/v1/questions/```</br>
  * Header: ```{user_id: 1}``` </br>
  * Response:</br>
    ```
    {
        "error": {},
        "data": [
            {
                "answer_choices": [
                    {
                        "choice_id": "1",
                        "choice_type": 1,
                        "choice": "choice 1"
                    },
                    ...
                ],
                "question_id": "1",
                "user_id": "1",
                "answer_text": "1,2",
                "question_type": 2
            },
            {
              "answer_choices": [],
              "question_id": "2",
              "user_id": "1",
              "answer_text": "Hi",
              "question_type": 1
            },
            ...
        ]
    }
    ```  
    
    
## Error codes
      
 
Error Code  | Error Message | Reason 
----------- | ------------- | -------------
401 | USER_AUTHENTICATION_PROBLEM | User id doesn't exist in header.
404 | PAGE_NOT_FOUND | URL is not correct
100001 | RETRIEVE_QUESTIONS_PROBLEM | A problem occured in getting question from database.
100002 | QUESTION_NOT_FOUND | -
100003 | RETRIEVE_CHOICES_PROBLEM | A problem occured in getting choices from database.
200001 | QUESTION_ANSWER_TYPE_MISMATCH | Question is simple but answer is for multi-choice question or vice versa.
200002 | INVALID_CHOICE_IDS | Choice ids which are in body are not for the question with mentioned id.
200003 | NO_NEW_QUESTION | User has answered to all questions.
