const fetch = require('node-fetch');
// const WebSocket = require('websocket').w3cwebsocket;
const { WebSocket } = require('ws');

const btoken = "ptlc_pEQPmQu6zQrLi06w4exB5rEPi5hF2BNPd81wDr8HxQ4"
const server = "35c24f19"

async function main(){
    let response = await fetch(
        `https://wi.goodanimemes.com/api/client/servers/${server}/websocket`, {
        "method": "GET",
        "headers": {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${btoken}`,
        }
    })
    // console.log(response);
    response = await response.json()
    // console.log(response);
    let token  = response.data.token
    let socketurl = response.data.socket


    const ws = new WebSocket(socketurl, { origin: 'https://wi.goodanimemes.com' });

    ws.on(`open`, () => {
        ws.send(JSON.stringify({ event: "auth", args: [token] }));
    });

    ws.on(`error`, (err) => {
        console.log(err);
    });

    ws.on(`message`, data => {
        data = JSON.parse(Buffer.from(data))
        // console.log(data);
        switch (data.event) {
            case "auth success":
                console.log("Authenticated");
            break;
            case "console output":
                console.log(data.args);
            //     if(data.args.toString().includes("[Server thread/INFO]"))
            //         // console.log(data.args);
            //         if(data.args.toString().matches(//g))
            break;
            case "token expiring":
                console.log("Token Expiring ... Requesting new token and authenticating");
                fetch(
                    `https://wi.goodanimemes.com/api/client/servers/${server}/websocket`, {
                    "method": "GET",
                    "headers": {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${btoken}`,
                    }
                }).then(async res => {
                    res = await res.json()
                    ws.send(JSON.stringify({ event: "auth", args: [res.data.token] }));
                    console.log("New token received and authenticated");
                })
            break;

            default:
                break;
        }
    });
}

main()