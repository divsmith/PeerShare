var peer;
var server_conn;
var server_conn_open = false;

(function() {
    var id = (Math.random() + 1).toString(36).substr(6);

    peer = new Peer(id);

    peer.on('open', function(id) {
        console.log('id: ' + id);
    });

    peer.on('connection', function(conn) {
        server_conn = conn; 
        conn.on('open', function() {
            server_conn_open = true;
            conn.send('Hello world!');
        })
    });

    console.log('working');

    server = confirm("Server?");

    if (!server) {
        dest_id = prompt("ID?");

        var conn = peer.connect(dest_id);

        conn.on('open', function() {
            console.log('client conn');
            conn.on('data', function(data) {
                console.log('client data');
                console.log(data);
            });
        });
    }
})();

function sendFile(files) {
    var reader = new FileReader();

    reader.onloadend = function() {
        console.log(reader.result);

        if (server_conn_open) {
            server_conn.send(reader.result);
        }
    }

    reader.readAsBinaryString(files[0]);
}