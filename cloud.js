var pkgcloud = require("pkgcloud");
var fs = require("fs");
var q = require("q");

var client = pkgcloud.storage.createClient({
    provider: 'azure',
    storageAccount: "neutronio",         // Name of your storage account
    storageAccessKey: "hm5coo0LL5ZRqR33ndg086HAXR297rN6VCiBCPSab+3nc2/3opZisqY6gdW3wfXhmkH39zD7ukqJYXh2mpqZoA==" // Access key for storage account
});

/*
client.getContainers(function (err, containers) {
    console.log(err, containers);
});

client.createContainer("neutron", function (err, container) {
    console.log(err, container);
});

var readStream = fs.createReadStream(__dirname + "/cloud.js");
var writeStream = client.upload({
    container: "neutron",
    remote: "1.0.0/cloud.js"
});

writeStream.on('error', function(err) {
    console.log("err", err);
});

writeStream.on('success', function(file) {
    console.log("success", file);
});

readStream.pipe(writeStream);


client.getFiles("neutron", function (err, files) {
    console.log(err, files);
});
*/

class AppFinder {
    constructor(client) {
        this.client = client;
    }

    async apps() {
        return q.ninvoke(this.client, "getContainers")
            .then(function *(containers) {
                for (let container of containers) {
                    yield container;
                }
            });
    }
}

var finder = new AppFinder(client);
finder.apps().then(generator => console.log(generator.next().done, generator.next().done));
