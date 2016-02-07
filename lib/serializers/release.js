import assert from "assert";
import Release from "../models/release";

export default class ReleaseSerializer {
    serialize(release) {
        assert(release instanceof Release, "release is not an instance of Release");

        const { name, notes, date } = release;

        return { name, notes, date };
    }

    unserialize({ name, notes, date }) {
        return new Release(name, notes, date);
    }
}
