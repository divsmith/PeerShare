var peer;
var server_conn;
var server_conn_open = false;

(function() {
    var id = (Math.random() + 1).toString(36).substr(6);

    peer = new Peer(id);

    peer.on('open', function(id) {
        id_element = document.getElementById('peerID');
        id_element.innerHTML = id;
        console.log('id: ' + id);
    });

    peer.on('connection', function(conn) {
        server_conn = conn; 
        conn.on('open', function() {
            server_conn_open = true;
            conn.send({"type": "text", "data": "hello world!"});
        })

        conn.on('data', function(data) {
            write_data(data);
        })
    });

    //console.log('working');
        
})();

function text_key_press(event)
{
    if (event.keyCode == 13)
    {
        console.log('keycode');
        sendText();
    }
}

function write_data(data)
{
    console.log(data)
    switch(data.type)
    {
        case "text": {
            node = document.createElement('li');
            text = document.createTextNode(data.data);
            node.classList.add('list-group-item');
            node.appendChild(text);
            document.getElementById('feed').appendChild(node);
            break;
        }

        case "file": {
            node = document.createElement('li');
            text = document.createTextNode(data.name);
            node.classList.add('list-group-item');
            node.appendChild(text);

            button = document.createElement('a');
            button.classList.add('btn');
            button.classList.add('btn-success');
            button.classList.add('float-right');
            button.appendChild(document.createTextNode('Download'));
            button.setAttribute('href', data.data);
            button.setAttribute('download', data.name);
            node.appendChild(button);

            document.getElementById('feed').appendChild(node);
            break;
        }
    }
}

function connect_to_peer()
{
    dest_id = document.getElementById('connect_to_id').value;

    var conn = peer.connect(dest_id);

    server_conn = conn;

    conn.on('open', function() {
        //console.log('client conn');
        conn.on('data', function(data) {
            write_data(data);
            //console.log('client data');
            // console.log(file.data);

            // // var download_button = document.getElementById("download");
            // // download_button.setAttribute('href', file.data);
            // // download_button.setAttribute('download', file.name);
            //     console.log(data)
            //     node = document.createElement('li');
            //     text = document.createTextNode(data.data);
            //     node.classList.add('list-group-item');
            //     node.appendChild(text);
            //     document.getElementById('feed').appendChild(node);
            // 
            });
    });
}

function sendText()
{
    text_element = document.getElementById('text');
    data = {
        "type": "text",
        "data": text_element.value
    }
    server_conn.send(data);
    write_data(data); // Write the data the sent data to the sender's screen
    text_element.value = '';
}

function sendFile(files) {
    var reader = new FileReader();

    reader.onloadend = function() {
        data = {
            "type": "file",
            "name": files[0].name,
            "data": reader.result
        }

        console.log(data);

        if (server_conn_open) {
            server_conn.send(data);
        }
    }

    reader.readAsDataURL(files[0]);
}