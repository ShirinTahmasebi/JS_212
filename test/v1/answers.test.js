const request = require('supertest');
const app = require('../../app');
const chai = require('chai');
const assert = chai.assert;
const should = chai.should();
const expect = chai.expect;

describe('GET /api/v1/answer', function () {
  it('User is not authorized. It should return 401 error with message USER_AUTHENTICATION_PROBLEM', function (done) {
    request(app)
      .get('/api/v1/answer')
      .expect('Content-Type', /json/)
      .expect(function (res) {
        res.body.error.code.should.equal(401);
        res.body.error.message.should.equal('USER_AUTHENTICATION_PROBLEM');
      })
      .expect(200)
      .end(done);
  });
});

describe('GET /api/v1/questions/answer', function () {
  it('User is authorized. It should return felan bisar', function (done) {
    request(app)
      .get('/api/v1/questions/answer')
      .set({'user_id': '1', Accept: 'application/json'})
      .expect('Content-Type', /json/)
      .expect(function (res) {
        res.body.felan.should.equal('BISAR');
      })
      .expect(200)
      .end(done);
  });
});

describe('POST /api/v1/questions/{simple_question_id}/answer', function () {
  it('Question type is simple. Request should have answer_text field', function (done) {
    let simple_question_id = 0;
    request(app)
      .get('/api/v1/questions/single')
      .query({question_type: '1'})
      .set({'user_id': '1', Accept: 'application/json'})
      .expect(function (res) {
        simple_question_id = res.body.data.question_id;

        request(app)
          .post(`/api/v1/questions/${simple_question_id}/answer`)
          .set({'user_id': '1', Accept: 'application/json'})
          .send({answer_text: 'some text'})
          .expect('Content-Type', /json/)
          .expect(function (res) {
            res.body.data.should.have.property('question_id');
            res.body.data.should.have.property('question_type');
            res.body.data.should.have.property('answer_text');
            expect(res.body.error).to.eql({});
            // noinspection BadExpressionStatementJS
            expect(res.body.error.code).to.be.undefined;
            // noinspection BadExpressionStatementJS
            expect(res.body.error.message).to.be.undefined;
          })
          .expect(200);
      })
      .end(done);
  });
});

describe('POST /api/v1/questions/{simple_question_id}/answer', function () {
  it('Question type is simple. Request has answer_choices_ids field. Result is 200001 error code.', async function () {
    let simple_question_id = 0;
    await request(app)
      .get('/api/v1/questions/single')
      .query({question_type: '1'})
      .set({'user_id': '1', Accept: 'application/json'})
      .expect(function (res) {
        simple_question_id = res.body.data.question_id;
      });

    await request(app)
      .post(`/api/v1/questions/${simple_question_id}/answer`)
      .set({'user_id': '1', Accept: 'application/json'})
      .send({answer_choices_ids: [1]})
      .expect('Content-Type', /json/)
      .expect(function (res) {
        res.body.error.should.have.property('code');
        res.body.error.should.have.property('message');
        res.body.error.code.should.equal(200001);
        res.body.error.message.should.equal('QUESTION_ANSWER_TYPE_MISMATCH');

        expect(res.body.data).to.eql({});
        // noinspection BadExpressionStatementJS
        expect(res.body.data.question_id).to.be.undefined;
        // noinspection BadExpressionStatementJS
        expect(res.body.data.question_type).to.be.undefined;
        // noinspection BadExpressionStatementJS
        expect(res.body.data.answer_text).to.be.undefined;
      })
      .expect(200);

    await Promise.resolve();

    assert.ok(true);
  });
});

describe('POST /api/v1/questions/{multi_choice_question_id}/answer', function () {
  it('Question type is multi_choice. Request has answer_text field. Result is 200001 error code.', async function () {
    let simple_question_id = 0;
    await request(app)
      .get('/api/v1/questions/single')
      .query({question_type: '2'})
      .set({'user_id': '1', Accept: 'application/json'})
      .expect(function (res) {
        simple_question_id = res.body.data.question_id;
      });

    await request(app)
      .post(`/api/v1/questions/${simple_question_id}/answer`)
      .set({'user_id': '1', Accept: 'application/json'})
      .send({answer_text: 'some text'})
      .expect('Content-Type', /json/)
      .expect(function (res) {
        res.body.error.should.have.property('code');
        res.body.error.should.have.property('message');
        res.body.error.code.should.equal(200001);
        res.body.error.message.should.equal('QUESTION_ANSWER_TYPE_MISMATCH');

        expect(res.body.data).to.eql({});
        // noinspection BadExpressionStatementJS
        expect(res.body.data.question_id).to.be.undefined;
        // noinspection BadExpressionStatementJS
        expect(res.body.data.question_type).to.be.undefined;
        // noinspection BadExpressionStatementJS
        expect(res.body.data.answer_text).to.be.undefined;
      })
      .expect(200);

    await Promise.resolve();

    assert.ok(true);
  });
});

describe('POST /api/v1/questions/{multichoice_question_id}/answer', function () {
  it('Question type is multi-choice. Request has valid answer_choices_ids. Result should be answer info', async function () {

    let multi_choice_question_id = '';
    let answer_choices_ids = [];

    await request(app)
      .get('/api/v1/questions/single')
      .query({question_type: '2'})
      .set({'user_id': '1', Accept: 'application/json'})
      .expect(async function (res) {
          multi_choice_question_id = res.body.data.question_id;
        },
      );

    const execute_query = require('../../src/db/mysql_connection').execute_query;
    const mysql_queries = require('../../src/db/queries').mysql;

    const result = await execute_query(mysql_queries.answers.get_choice_ids_by_question_id.replace('{question_id}', multi_choice_question_id));

    for (const item of result) {
      await answer_choices_ids.push(item.choice_id);
    }

    await request(app)
      .post(`/api/v1/questions/${multi_choice_question_id}/answer`)
      .set({'user_id': '1', Accept: 'application/json'})
      .send({answer_choices_ids: answer_choices_ids})
      .expect('Content-Type', /json/)
      .expect(function (res) {

        res.body.data.should.have.property('question_id');
        res.body.data.should.have.property('question_type');
        res.body.data.should.have.property('answer_choices_ids');

        expect(res.body.error).to.eql({});
        // noinspection BadExpressionStatementJS
        expect(res.body.error.code).to.be.undefined;
        // noinspection BadExpressionStatementJS
        expect(res.body.error.message).to.be.undefined;
      })
      .expect(200);

    await Promise.resolve();
    assert.ok(true);
  });
})
;

describe('POST /api/v1/questions/{multichoice_question_id}/answer', function () {
  it('Question type is multi-choice. Request has invalid answer_choices_ids. Result is 200002 error code.', async function () {

    let multi_choice_question_id = '';
    let answer_choices_ids = [];
    let isResolved = true;

    await request(app)
      .get('/api/v1/questions/single')
      .query({question_type: '2'})
      .set({'user_id': '1', Accept: 'application/json'})
      .expect(async function (res) {
          multi_choice_question_id = res.body.data.question_id;
        },
      );

    const execute_query = require('../../src/db/mysql_connection').execute_query;
    const mysql_queries = require('../../src/db/queries').mysql;

    const result = await execute_query(mysql_queries.answers.get_choice_ids_by_question_id.replace('{question_id}', multi_choice_question_id));

    for (const item of result) {
      await answer_choices_ids.push(item.choice_id + 10000);
    }

    await request(app)
      .post(`/api/v1/questions/${multi_choice_question_id}/answer`)
      .set({'user_id': '1', Accept: 'application/json'})
      .send({answer_choices_ids: answer_choices_ids})
      .expect('Content-Type', /json/)
      .expect(function (res) {

        // noinspection BadExpressionStatementJS
        expect(res.body.data.question_id).to.be.undefined;
        // noinspection BadExpressionStatementJS
        expect(res.body.question_type).to.be.undefined;
        // noinspection BadExpressionStatementJS
        expect(res.body.data.answer_choices_id).to.be.undefined;

        res.body.error.should.have.property('code');
        res.body.error.should.have.property('message');
        res.body.error.code.should.equal(200002);
        res.body.error.message.should.equal('INVALID_CHOICE_IDS');
      })
      .expect(200);

    await Promise.resolve();
    assert.ok(true);
  });
});
