import assert from "assert";
import Release from "../models/release";

export default class ReleaseSerializer {
    serialize(release) {
        assert(release instanceof Release, "release is not an instance of Release");

        return { name, notes, date } = release;
    }

    unserialize(data) {
        return new Release(data.name, data.notes, data.date);
    }
}
