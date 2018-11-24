const request = require('supertest');
const app = require('../../app');
const chai = require('chai');
const should = chai.should();

describe('POST /api/v1', function () {
  it('User is not authorized. It should return 401 error with message USER_AUTHENTICATION_PROBLEM', function (done) {
    request(app)
      .post('/')
      .expect('Content-Type', /json/)
      .expect(function (res) {
        res.body.error.code.should.equal(401);
        res.body.error.message.should.equal('USER_AUTHENTICATION_PROBLEM');
      })
      .expect(200)
      .end(done);
  });
});

describe('POST /api/v1', function () {
  it('User is authorized. It should return hi bye', function (done) {
    request(app)
      .post('/api/v1')
      .set({'user_id': '1', Accept: 'application/json'})
      .expect('Content-Type', /json/)
      .expect(function (res) {
        res.body.data.hi.should.equal('bye');
      })
      .expect(200)
      .end(done);
  });
});