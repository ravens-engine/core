import _ from "lodash";
import { Client } from "../client/Client";
import { Game } from "../core/Game";
import { AnyGame, PhaseClass } from "../core/Phase";
import { DumbAuthenticationProvider } from "../test-utils/DumbAuthenticationProvider";
import { DumbClientTransportLayer } from "../test-utils/DumbClientTransportLayer";
import { DumbServerTransportLayer } from "../test-utils/DumbServerTransportLayer";
import { flushPromises } from "../test-utils/flushPromises";
import SimpleCounterGame from "../test-utils/SimpleCounterGame";
import { ThreePhaseGame } from "../test-utils/ThreePhaseGame";
import { Server } from "./Server";

function createServerAndClients<Game extends AnyGame>(gameClass: PhaseClass<Game>, clientCounts = 2): [Server<Game>, Client<Game>[]] {
    const dumbServerTransportLayer = new DumbServerTransportLayer();

    const server = new Server({
        gameClass,
        transportLayer: dumbServerTransportLayer
    });

    server.start();

    const dumbClientTransportLayerForClientId = new Map<string, DumbClientTransportLayer>();

    const clients = _.range(clientCounts).map(i => {
        // For test purposes, use i as the user id (will also be used as the client id)
        const userId = i.toString();
        const clientId = userId;

        const dumbClientTransportLayer = new DumbClientTransportLayer();
        dumbClientTransportLayerForClientId.set(clientId, dumbClientTransportLayer);

        const client = new Client({
            gameClass,
            transportLayer: dumbClientTransportLayer,
            authenticationProvider: new DumbAuthenticationProvider(userId, userId, "1")
        });

        dumbClientTransportLayer.onMessageToTransport = message => {
            dumbServerTransportLayer.notifyMessageReceived(clientId, message);
        };

        dumbClientTransportLayer.onClose = () => {
            dumbServerTransportLayer.notifyClose(clientId);
        }

        return client;
    });

    dumbServerTransportLayer.onMessageToTransport = (clientId, message) => {
        dumbClientTransportLayerForClientId.get(clientId)!.notifyMessageReceived(message);
    };

    // Launch all the clients
    clients.forEach(client => client.start());

    return [server, clients];
}

test("Server and client works together correctly", async () => {
    const [_server, [clientOne, clientTwo]] = createServerAndClients(SimpleCounterGame);
    await flushPromises();

    expect(clientTwo.game.state.counter).toEqual(0);

    clientOne.sendAction({type: "increase"});

    await flushPromises();

    expect(clientTwo.game.state.counter).toEqual(1);
});

test("Server correctly broadcasts user connections and disconnections", async () => {
    class CustomGame extends Game<any> {
        initialize() {
            this.state = {
                connectedUsers: []
            }
        }

        onUserConnection(userId: string) {
            this.state.connectedUsers.push(userId);
        }

        onUserDisconnection(userId: string) {
            this.state.connectedUsers = _.without(this.state.connectedUsers, userId);
        }
    }

    const [_server, [clientOne, clientTwo]] = createServerAndClients(CustomGame);

    await flushPromises();

    expect(clientOne.game.state.connectedUsers).toHaveLength(2);

    clientTwo.stop();

    await flushPromises();

    expect(clientOne.game.state.connectedUsers).toHaveLength(1);
});

test("Server correctly save a match after an action is processed", async () => {
    const [server, [clientOne, _clientTwo]] = createServerAndClients(SimpleCounterGame);

    await flushPromises();

    const saveMatchSpy = jest.spyOn(server.persistenceLayer, "saveMatch");

    clientOne.sendAction({type: "increase"});

    await flushPromises();

    expect(saveMatchSpy).toHaveBeenCalledWith({
        id: "1",
        name: "Match #1",
        status: "IN_LOBBY",
        players: [],
        maxPlayers: 2,
        serializedGame: {state: {counter: 1}}
    });
});

test("Server correctly saves the new status of a game", async () => {
    const [server, [clientOne, _clientTwo]] = createServerAndClients(ThreePhaseGame);

    await flushPromises();

    const saveMatchSpy = jest.spyOn(server.persistenceLayer, "saveMatch");

    clientOne.sendAction({type: "start"});

    await flushPromises();

    expect(saveMatchSpy).toHaveBeenCalledWith({
        id: "1",
        name: "Match #1",
        players: [],
        status: "STARTED",
        maxPlayers: 2,
        serializedGame: {state: undefined, child: {id: "game-started", state: undefined}}
    });
});

test("Server correctly dispatches the seed to have predictable randomness", async () => {
    class RandomGame extends Game<{roll: number}> {
        initialize(): void {
            this.state = {
                roll: 0
            };
        }

        applyAction(userId: string, action: any): void {
            if (action.type == "roll") {
                this.state.roll = this.random.d100();
            }
        }
    }

    const [server, [clientOne, clientTwo]] = createServerAndClients(RandomGame);

    await flushPromises();

    clientOne.sendAction({type: "roll"});

    await flushPromises();

    expect(clientOne.game.state.roll).toBeGreaterThan(0);
    expect(clientTwo.game.state.roll).toBeGreaterThan(0);
    expect(clientOne.game.state.roll).toBe(clientTwo.game.state.roll);
});