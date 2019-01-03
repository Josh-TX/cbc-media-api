import * as supertest from "supertest";
import { app, db } from "./dependancies";

describe("teacher API", function() {
    describe("GET requests", function() {
        it("404s when no id is specified", (done) => {
            supertest(app)
                .get("/teacher")
                .expect(404)
                .end(done);
        });

        it("400s when the id is invalid", (done) => {
            supertest(app)
                .get("/teacher/hello")
                .expect(400)
                .expect("content-type", /text/)
                .expect(/failed to parse/)
                .end(done);
        });
    });

    describe("POST requests", function() {
        it("400s when missing required properties", (done) => {
            supertest(app)
                .post("/teacher")
                .send({})
                .expect(400, done);
        });
    });
});