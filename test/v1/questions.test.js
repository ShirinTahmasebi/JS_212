const request = require('supertest');
const app = require('../../app');
const chai = require('chai');
const should = chai.should();
const expect = chai.expect;

describe('GET /api/v1/questions', function () {
  it('User is not authorized. It should return 401 error with message USER_AUTHENTICATION_PROBLEM', function (done) {
    request(app)
      .get('/api/v1/questions')
      .expect('Content-Type', /json/)
      .expect(function (res) {
        res.body.error.code.should.equal(401);
        res.body.error.message.should.equal('USER_AUTHENTICATION_PROBLEM');
      })
      .expect(200)
      .end(done);
  });
});

describe('GET /api/v1/questions', function () {
  it('User is authorized. It should return ping PONG', function (done) {
    request(app)
      .get('/api/v1/questions')
      .set({'user_id': '1', Accept: 'application/json'})
      .expect('Content-Type', /json/)
      .expect(function (res) {
        res.body.ping.should.equal('PONG');
      })
      .expect(200)
      .end(done);
  });
});

describe('GET /api/v1/questions/single', function () {
  it('It should return a random question', function (done) {
    request(app)
      .get('/api/v1/questions/single')
      .set({'user_id': '1', Accept: 'application/json'})
      .expect('Content-Type', /json/)
      .expect(function (res) {
        res.body.data.should.have.property('question_id');
        res.body.data.should.have.property('question_type');
        res.body.data.should.have.property('question_text');
        expect(res.body.error).to.eql({});
        // noinspection BadExpressionStatementJS
        expect(res.body.error.code).to.be.undefined;
        // noinspection BadExpressionStatementJS
        expect(res.body.error.message).to.be.undefined;
      })
      .expect(200)
      .end(done);
  });
});

describe('GET /api/v1/questions/single', function () {
  it('It should return a simple question', function (done) {
    request(app)
      .get('/api/v1/questions/single')
      .query({question_type: '1'})
      .set({'user_id': '1', Accept: 'application/json'})
      .expect('Content-Type', /json/)
      .expect(function (res) {
        res.body.data.should.have.property('question_id');
        res.body.data.should.have.property('question_type').equal(1);
        res.body.data.should.have.property('question_text');
        expect(res.body.error).to.eql({});
        // noinspection BadExpressionStatementJS
        expect(res.body.error.code).to.be.undefined;
        // noinspection BadExpressionStatementJS
        expect(res.body.error.message).to.be.undefined;
      })
      .expect(200)
      .end(done);
  });
});

describe('GET /api/v1/questions/single', function () {
  it('It should return a multichoice question', function (done) {
    request(app)
      .get('/api/v1/questions/single')
      .query({question_type: '2'})
      .set({'user_id': '1', Accept: 'application/json'})
      .expect('Content-Type', /json/)
      .expect(function (res) {
        res.body.data.should.have.property('question_id');
        res.body.data.should.have.property('question_type').equal(2);
        res.body.data.should.have.property('question_text');
        expect(res.body.error).to.eql({});
        // noinspection BadExpressionStatementJS
        expect(res.body.error.code).to.be.undefined;
        // noinspection BadExpressionStatementJS
        expect(res.body.error.message).to.be.undefined;
      })
      .expect(200)
      .end(done);
  });
});

describe('GET /api/v1/questions/single', function () {
  it('It should return error because there is no question type equal to 0', function (done) {
    request(app)
      .get('/api/v1/questions/single')
      .query({question_type: '0'})
      .set({'user_id': '1', Accept: 'application/json'})
      .expect('Content-Type', /json/)
      .expect(function (res) {
        res.body.error.code.should.equal(100001);
        res.body.error.message.should.equal('RETRIEVE_QUESTIONS_PROBLEM');
        // noinspection BadExpressionStatementJS
        expect(res.body.data.question_id).to.be.undefined;
        // noinspection BadExpressionStatementJS
        expect(res.body.data.question_type).to.be.undefined;
        // noinspection BadExpressionStatementJS
        expect(res.body.data.question_text).to.be.undefined;
      })
      .expect(200)
      .end(done);
  });
});