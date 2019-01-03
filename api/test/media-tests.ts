import * as supertest from "supertest";
import * as mockDatabaseHelpers from "./mock-database-helpers";
import * as assert from "assert";
import { app, db } from "./dependancies";
import { Media } from "../src/models/Media";
import { CreateMediaRequest } from "../src/models/CreateMediaRequest";
import { categoryTree } from "../src/helpers/categoryTree";
import { ObjectId } from "bson";
import { TeacherEntity } from "../src/entities/TeacherEntity";
import { SeriesEntity } from "../src/entities/SeriesEntity";
import { UpdateMediaRequest } from "../src/models/UpdateMediaRequest";
import { MediaEntity } from "../src/entities/MediaEntity";

describe("media API", function() {
    describe("GET requests", function() {
        it("can get media", function(done) {
            var entity = mockDatabaseHelpers.createMediaEntity();
            mockDatabaseHelpers.insertMedia(db, entity);
            supertest(app)
                .get("/media/" + entity.mediaCode)
                .expect(200)
                .expect("content-type", /json/)
                .expect(function(res){
                    let body: Media = res.body;
                    assert.equal(body.mediaCode, entity.mediaCode);
                    assert.equal(body.dateRecorded, entity.dateRecorded);
                    assert.equal(body.title, entity.title);
                    assert.equal(body.category, entity.category);
                    assert.equal(body.subCategory, entity.subCategory);
                    assert.equal(body.mp3, entity.mp3);
                    assert.equal(body.mp4, entity.mp4);
                    assert.equal(body.vimeoId, entity.vimeoId);
                    assert.equal(body.youtubeId, entity.youtubeId);
                    assert.equal(body.slidesUrl, entity.slidesUrl);
                    assert.equal(body.outlineUrl, entity.outlineUrl);
                    assert.equal(body.transcriptUrl, entity.transcriptUrl);
                })
                .end(done);
        });

        it("204s when the media was not found", function(done) {     
            supertest(app)
                .get("/media/hello")
                .expect(204)
                .end(done);
        });

        it("404s when no mediaCode is specified", function(done) {            
            supertest(app)
                .get("/media/")
                .expect(404)
                .end(done);
        });

        //not sure what behavior we want in this situation... maybe some sorta logging?
        it("500s when the mongodb document is missing required properties", function(done) { 
            var entity = mockDatabaseHelpers.createMediaEntity();
            delete entity.teacher._id 
            mockDatabaseHelpers.insertMedia(db, entity);
            supertest(app)
                .get("/media/" + entity.mediaCode)
                .expect(500)
                .end(done);
        });
    });

    describe("POST requests", function() {
        let teacherEntity: TeacherEntity;
        let seriesEntity: SeriesEntity;
        before(async function() {
            teacherEntity = mockDatabaseHelpers.createTeacherEntity();
            mockDatabaseHelpers.insertTeacher(db, teacherEntity);
            seriesEntity = mockDatabaseHelpers.createSeriesEntity();
            mockDatabaseHelpers.insertSeries(db, seriesEntity);
        })


        function getRequestObject(): CreateMediaRequest{
            var request = new CreateMediaRequest();
            request.dateRecorded = (new Date()).toString();
            request.title = "title #" + Math.ceil(Math.random() * 9999);
            request.text = "Psalm" + Math.ceil(Math.random() * 150);
            request.teacherId = teacherEntity._id.toHexString();
            request.seriesId = seriesEntity._id.toHexString();
            request.category = categoryTree[0].category;
            request.subCategory = categoryTree[0].subCategories[0];
            request.tags = ["tag #" + Math.ceil(Math.random() * 99)];
            return request;
        }

        it("can post media", function(done) {
            var request = getRequestObject();
            (<any>request).extraProperty = "hello";
            supertest(app)
                .post("/media")
                .send(request)
                .expect(201)
                .expect("content-type", /text/)
                .end(function(err, res){
                    if (err){
                        return done(err);
                    }
                    mockDatabaseHelpers.getMediaByCode(db, res.text).then(mediaEntity => {
                        assert.equal(mediaEntity.mediaCode, res.text);
                        assert.equal(mediaEntity.dateRecorded, request.dateRecorded);
                        assert.equal(mediaEntity.title, request.title);
                        assert.equal(mediaEntity.category, request.category);
                        assert.equal(mediaEntity.subCategory, request.subCategory);

                        assert.equal(mediaEntity.teacher._id, request.teacherId);
                        assert.equal(mediaEntity.teacher.firstName, teacherEntity.firstName);
                        assert.equal(mediaEntity.teacher.lastName, teacherEntity.lastName);
                        assert.equal(mediaEntity.teacher.fullName, teacherEntity.fullName);

                        assert.equal(mediaEntity.series._id, request.seriesId);
                        assert.equal(mediaEntity.series.title, seriesEntity.title);
                        assert.equal(mediaEntity.series.image, seriesEntity.image);
                        assert.equal(mediaEntity.series.imageSquare, seriesEntity.imageSquare);
                        assert.strictEqual((<any>teacherEntity).extraProperty, undefined)
                    }).then(done).catch(done)
                });
        });

        it("400s when the title property is missing", function(done) {  
            var request = getRequestObject();
            delete request.title;          
            supertest(app)
                .post("/media")
                .send(request)
                .expect(400)
                .expect("content-type", /text/)
                .expect(/title/)
                .end(done);
        });

        it("400s when the teacherId is an invalid format", function(done) {  
            var request = getRequestObject();
            request.teacherId = "hello";          
            supertest(app)
                .post("/media")
                .send(request)
                .expect(400)
                .expect("content-type", /text/)
                .expect(/teacherId/)
                .end(done);
        });

        it("400s when the series is not found", function(done) {  
            var request = getRequestObject();
            request.seriesId = (new ObjectId()).toHexString();          
            supertest(app)
                .post("/media")
                .send(request)
                .expect(400)
                .expect("content-type", /text/)
                .expect(/series/)
                .end(done);
        });

        it("400s when the subcategory is for the wrong category", function(done) {  
            var request = getRequestObject();
            request.subCategory = categoryTree[1].subCategories[0];
            request.seriesId = (new ObjectId()).toHexString();          
            supertest(app)
                .post("/media")
                .send(request)
                .expect(400)
                .expect("content-type", /text/)
                .expect(/subCategory/)
                .end(done);
        });
    });

    describe("PUT requests", function() {
        it("can modify media", async function() {
            let teacherEntity1 = mockDatabaseHelpers.createTeacherEntity();
            await mockDatabaseHelpers.insertTeacher(db, teacherEntity1);
            let seriesEntity1 = mockDatabaseHelpers.createSeriesEntity();
            await mockDatabaseHelpers.insertSeries(db, seriesEntity1);
            let teacherEntity2 = mockDatabaseHelpers.createTeacherEntity();
            await mockDatabaseHelpers.insertTeacher(db, teacherEntity2);
            let seriesEntity2 = mockDatabaseHelpers.createSeriesEntity();
            await mockDatabaseHelpers.insertSeries(db, seriesEntity2);

            let originalMediaEntity = mockDatabaseHelpers.createMediaEntity({teacher: teacherEntity1, series: seriesEntity1});
            await mockDatabaseHelpers.insertMedia(db, originalMediaEntity);

            var request = new UpdateMediaRequest();
            request.title = "title #" + Math.ceil(Math.random() * 9999);
            request.text = "Genesis" + Math.ceil(Math.random() * 50);
            request.teacherId = teacherEntity2._id.toHexString();
            request.seriesId = seriesEntity2._id.toHexString();
            (<any>request).extraProperty = "hello";


            var res = await supertest(app)
                .put("/media/" + originalMediaEntity.mediaCode)
                .send(request)
                .expect(200);
            var newMediaEntity = await mockDatabaseHelpers.getMediaByCode(db, originalMediaEntity.mediaCode);
            
            assert.equal(newMediaEntity.mediaCode, originalMediaEntity.mediaCode);
            assert.equal(newMediaEntity.dateRecorded.getTime(), originalMediaEntity.dateRecorded.getTime());
            assert.equal(newMediaEntity.title, request.title);
            assert.equal(newMediaEntity.category, originalMediaEntity.category);
            assert.equal(newMediaEntity.subCategory, originalMediaEntity.subCategory);

            assert.equal(newMediaEntity.teacher._id, request.teacherId);
            assert.equal(newMediaEntity.teacher.firstName, teacherEntity2.firstName);
            assert.equal(newMediaEntity.teacher.lastName, teacherEntity2.lastName);
            assert.equal(newMediaEntity.teacher.fullName, teacherEntity2.fullName);

            assert.equal(newMediaEntity.series._id, request.seriesId);
            assert.equal(newMediaEntity.series.title, seriesEntity2.title);
            assert.equal(newMediaEntity.series.image, seriesEntity2.image);
            assert.equal(newMediaEntity.series.imageSquare, seriesEntity2.imageSquare);
            assert.strictEqual((<any>newMediaEntity).extraProperty, undefined)
        });

        it("can modify just the media title", async function() {
            let originalMediaEntity = mockDatabaseHelpers.createMediaEntity();
            await mockDatabaseHelpers.insertMedia(db, originalMediaEntity);

            var request = new UpdateMediaRequest();
            request.title = "title #" + Math.ceil(Math.random() * 9999);

            var res = await supertest(app)
                .put("/media/" + originalMediaEntity.mediaCode)
                .send(request)
                .expect(200);
            var newMediaEntity = await mockDatabaseHelpers.getMediaByCode(db, originalMediaEntity.mediaCode);
            
            assert.equal(newMediaEntity.mediaCode, originalMediaEntity.mediaCode);
            assert.equal(newMediaEntity.dateRecorded.getTime(), originalMediaEntity.dateRecorded.getTime());
            assert.equal(newMediaEntity.title, request.title);
            assert.equal(newMediaEntity.teacher._id.toHexString(), originalMediaEntity.teacher._id.toHexString())
            assert.equal(newMediaEntity.series._id.toHexString(), originalMediaEntity.series._id.toHexString());
        });

        it("204s when the media was not found", function(done) {
            var request = new UpdateMediaRequest();
            request.title = "title #" + Math.ceil(Math.random() * 9999);
            supertest(app)
                .put("/media/hello")
                .send(request)
                .expect(204)
                .end(done);
        });

        it("404s when no media code is specified", function(done) {
            var request = new UpdateMediaRequest();
            request.title = "title #" + Math.ceil(Math.random() * 9999);
            supertest(app)
                .put("/media")
                .send(request)
                .expect(404)
                .end(done);
        });

        it("400s when the teacherId is an invalid format", function(done) {
            var request = new UpdateMediaRequest();
            request.teacherId = "hello";
            supertest(app)
                .put("/media/01022019-Adu")
                .send(request)
                .expect(400)
                .expect("content-type", /text/)
                .expect(/teacher/)
                .end(done);
        });

        it("400s when the series is not found", function(done) {
            var request = new UpdateMediaRequest();
            request.seriesId = (new ObjectId()).toHexString();
            supertest(app)
                .put("/media/01022019-Adu")
                .send(request)
                .expect(400)
                .expect("content-type", /text/)
                .expect(/series/)
                .end(done);
        });
    });

    describe("DELETE requests", function() {
        it("can delete media", async function() {
            let originalMediaEntity = mockDatabaseHelpers.createMediaEntity();
            await mockDatabaseHelpers.insertMedia(db, originalMediaEntity);

            var res = await supertest(app)
                .delete("/media/" + originalMediaEntity.mediaCode)
                .expect(200);

            var newMediaEntity = await mockDatabaseHelpers.getMediaByCode(db, originalMediaEntity.mediaCode);
            assert.equal(newMediaEntity, null);
        });

        it("204s when the media was not found", async function() {
            let originalMediaEntity = mockDatabaseHelpers.createMediaEntity();
            await mockDatabaseHelpers.insertMedia(db, originalMediaEntity);

            var res = await supertest(app)
                .delete("/media/hello")
                .expect(204);

            var newMediaEntity = await mockDatabaseHelpers.getMediaByCode(db, originalMediaEntity.mediaCode);
            assert.notEqual(newMediaEntity, null);
        });

        it("404s when no media code is specified", function(done) {
            supertest(app)
                .delete("/media")
                .expect(404)
                .end(done);
        });
    });
});