import * as supertest from "supertest";
import { app, db } from "./dependancies";
import * as mockDatabaseHelpers from "./mock-database-helpers";
import { Teacher } from "../src/models/Teacher";
import * as assert from "assert";
import { CreateTeacherRequest } from "../src/models/CreateTeacherRequest";
import { ObjectId } from "bson";
import { UpdateTeacherRequest } from "../src/models/UpdateTeacherRequest";

describe("teacher API", function() {
    describe("GET requests", function() {
        it("can get media", function(done) {
            var entity = mockDatabaseHelpers.createTeacherEntity();
            mockDatabaseHelpers.insertTeacher(db, entity);
            supertest(app)
                .get("/teacher/" + entity._id.toHexString())
                .expect(200)
                .expect("content-type", /json/)
                .expect(function(res){
                    let body: Teacher = res.body;
                    assert.equal(body._id, entity._id);
                    assert.equal(body.firstName, entity.firstName);
                    assert.equal(body.lastName, entity.lastName);
                    assert.equal(body.fullName, entity.fullName);
                    assert.equal(body.bio, entity.bio);
                    assert.equal(body.imageUrl, entity.imageUrl);
                })
                .end(done);
        });

        it("404s when the teacher was not found", function(done) {     
            supertest(app)
                .get("/teacher/" + (new ObjectId()).toHexString())
                .expect(404)
                .end(done);
        });

        it("404s when no id is specified", function(done) {           
            supertest(app)
                .get("/teacher")
                .expect(404)
                .end(done);
        });

        it("400s when the id is invalid", function(done) {          
            supertest(app)
                .get("/teacher/hello")
                .expect(400)
                .expect("content-type", /text/)
                .expect(/failed to parse/)
                .end(done);
        });
    });

    describe("POST requests", function() {
        function getRequestObject(): CreateTeacherRequest{
            var request = new CreateTeacherRequest();
            request.firstName = "first #" +  Math.ceil(Math.random() * 999);
            request.lastName = "last #" + Math.ceil(Math.random() * 999);
            request.fullName = "full #" + Math.ceil(Math.random() * 99999);
            request.bio = "I was created for no purpose other than testing # " + Math.ceil(Math.random() * 999);
            request.imageUrl = "http://img.com/" + Math.ceil(Math.random() * 99999);
            return request;
        }

        it("can post media", function(done) {
            var request = getRequestObject();
            (<any>request).extraProperty = "hello";
            supertest(app)
                .post("/teacher")
                .send(request)
                .expect(201)
                .expect("content-type", /text/)
                .end(function(err, res){
                    if (err){
                        return done(err);
                    }
                    mockDatabaseHelpers.getTeacherById(db, res.text).then(teacherEntity => {
                        assert.equal(teacherEntity._id.toHexString(), res.text);
                        assert.equal(teacherEntity.firstName, request.firstName);
                        assert.equal(teacherEntity.lastName, request.lastName);
                        assert.equal(teacherEntity.fullName, request.fullName);
                        assert.equal(teacherEntity.fullName, request.fullName);
                        assert.equal(teacherEntity.bio, request.bio);
                        assert.equal(teacherEntity.imageUrl, request.imageUrl);
                        assert.strictEqual((<any>teacherEntity).extraProperty, undefined)
                    }).then(done).catch(done)
                });
        });

        it("400s when the firstName property is missing", function(done) {  
            var request = getRequestObject();
            delete request.firstName;          
            supertest(app)
                .post("/teacher")
                .send(request)
                .expect(400)
                .expect("content-type", /text/)
                .expect(/firstName/)
                .end(done);
        });

        it("400s when the imageUrl is an invalid format", function(done) {  
            var request = getRequestObject();
            request.imageUrl = "not a url";          
            supertest(app)
                .post("/teacher")
                .send(request)
                .expect(400)
                .expect("content-type", /text/)
                .expect(/imageUrl/)
                .end(done);
        });
    });

    describe("PUT requests", function() {
        it("can modify a teacher", async function() {
            let originalTeacherEntity = mockDatabaseHelpers.createTeacherEntity();
            await mockDatabaseHelpers.insertTeacher(db, originalTeacherEntity);

            var request = new UpdateTeacherRequest();
            request.firstName = "first #" +  Math.ceil(Math.random() * 999);
            request.lastName = "last #" + Math.ceil(Math.random() * 999);
            request.fullName = "full #" + Math.ceil(Math.random() * 99999);
            request.bio = "I was created for no purpose other than testing # " + Math.ceil(Math.random() * 999);
            request.imageUrl = "http://img.com/" + Math.ceil(Math.random() * 99999);
            (<any>request).extraProperty = "hello";

            var res = await supertest(app)
                .put("/teacher/" + originalTeacherEntity._id)
                .send(request)
                .expect(204);

            var newTeacherEntity = await mockDatabaseHelpers.getTeacherById(db, originalTeacherEntity._id.toHexString());
            
            assert.equal(newTeacherEntity._id.toHexString(), originalTeacherEntity._id.toHexString());
            assert.equal(newTeacherEntity.firstName, request.firstName);
            assert.equal(newTeacherEntity.lastName, request.lastName);
            assert.equal(newTeacherEntity.fullName, request.fullName);
            assert.equal(newTeacherEntity.bio, request.bio);
            assert.equal(newTeacherEntity.imageUrl, request.imageUrl);
            assert.strictEqual((<any>newTeacherEntity).extraProperty, undefined)
        });

        it("can modify just the firstName", async function() {
            let originalTeacherEntity = mockDatabaseHelpers.createTeacherEntity();
            await mockDatabaseHelpers.insertTeacher(db, originalTeacherEntity);

            var request = new UpdateTeacherRequest();
            request.firstName = "first #" +  Math.ceil(Math.random() * 999);

            var res = await supertest(app)
                .put("/teacher/" + originalTeacherEntity._id)
                .send(request)
                .expect(204);

            var newTeacherEntity = await mockDatabaseHelpers.getTeacherById(db, originalTeacherEntity._id.toHexString());
            assert.equal(newTeacherEntity._id.toHexString(), originalTeacherEntity._id.toHexString());
            assert.equal(newTeacherEntity.firstName, request.firstName);
            assert.equal(newTeacherEntity.lastName, originalTeacherEntity.lastName);
            assert.equal(newTeacherEntity.fullName, originalTeacherEntity.fullName);
            assert.equal(newTeacherEntity.bio, originalTeacherEntity.bio);
            assert.equal(newTeacherEntity.imageUrl, originalTeacherEntity.imageUrl);
        });

        it("404s when the teacher was not found", function(done) {
            var request = new UpdateTeacherRequest();
            request.firstName = "first #" +  Math.ceil(Math.random() * 999);
            supertest(app)
            .put("/teacher/" + (new ObjectId).toHexString())
                .send(request)
                .expect(404)
                .end(done);
        });

        it("404s when no id is specified", function(done) {
            var request = new UpdateTeacherRequest();
            request.firstName = "first #" +  Math.ceil(Math.random() * 999);     
            supertest(app)
                .put("/teacher")
                .send(request)
                .expect(404)
                .end(done);
        });

        it("400s when the id is invalid", function(done) {  
            var request = new UpdateTeacherRequest();
            request.firstName = "first #" +  Math.ceil(Math.random() * 999);        
            supertest(app)
                .put("/teacher/hello")
                .send(request)
                .expect(400)
                .expect("content-type", /text/)
                .expect(/failed to parse/)
                .end(done);
        });

        it("400s when the lastName is too long", function(done) {
            var request = new UpdateTeacherRequest();
            request.lastName = "the lastName property has a maximum length of 30 characters, which this string exceeds"; 
            supertest(app)
                .put("/teacher/" + (new ObjectId).toHexString())
                .send(request)
                .expect(400)
                .expect("content-type", /text/)
                .expect(/lastName/)
                .end(done);
        });
    });

    describe("DELETE requests", function() {
        it("can delete teacher", async function() {
            let originalTeacherEntity = mockDatabaseHelpers.createTeacherEntity();
            await mockDatabaseHelpers.insertTeacher(db, originalTeacherEntity);

            var res = await supertest(app)
                .delete("/teacher/" + originalTeacherEntity._id.toHexString())
                .expect(204);

            var newTeacherEntity = await mockDatabaseHelpers.getTeacherById(db, originalTeacherEntity._id.toHexString());
            assert.equal(newTeacherEntity, null);
        });

        it("404s when the teacher was not found", async function() {
            let originalMediaEntity = mockDatabaseHelpers.createMediaEntity();
            await mockDatabaseHelpers.insertMedia(db, originalMediaEntity);

            var res = await supertest(app)
                .delete("/teacher/" + (new ObjectId).toHexString())
                .expect(404);

            var newMediaEntity = await mockDatabaseHelpers.getMediaByCode(db, originalMediaEntity.mediaCode);
            assert.notEqual(newMediaEntity, null);
        });

        it("404s when no teacher id is specified", function(done) {
            supertest(app)
                .delete("/teacher")
                .expect(404)
                .end(done);
        });

        it("400s when the id is invalid", function(done) {
            supertest(app)
                .delete("/teacher/hello")
                .expect(400)
                .expect("content-type", /text/)
                .expect(/failed to parse/)
                .end(done);
        });
    });
});