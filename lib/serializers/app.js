import assert from "assert";
import App from "../models/app";

export default class AppSerializer {
    serialize(app) {
        assert(app instanceof App, "app is not an instance of App");

        return app.name;
    }

    unserialize(data) {
        return new App(data);
    }
}
