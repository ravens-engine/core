import { Component } from "react";
import * as React from "react";
import { Client, ClientState } from "../client/Client";
import { ClientSocketTransportLayer } from "../client-transport-layer/ClientSocketTransportLayer";
import { AnyGame, PhaseClass } from "../core/Phase";

export interface RootComponentProps<Game extends AnyGame> {
    client: Client<Game>,
    game: Game
}

interface RavensGameComponentProps<Game extends AnyGame> {
    rootPhaseClass: PhaseClass<Game>,
    rootComponent: React.ComponentClass<RootComponentProps<Game>>
}

interface GameComponentState<Game extends AnyGame> {
    client: Client<Game> | null
}


export class GameComponent<Game extends AnyGame> extends Component<RavensGameComponentProps<Game>, GameComponentState<Game>> {
    constructor(props: any) {
        super(props);
        this.state = {
            client: null
        };
    }

    render() {
        return this.state.client && (
            <div>
                {this.state.client.state == ClientState.CONNECTING ? (
                    "Connecting"
                ) : this.state.client.state == ClientState.WAITING_FOR_SYNC ? (
                    "Waiting for sync"
                ) : this.state.client.state == ClientState.DISCONNECTED ? (
                    "Disconnected"
                ) : (
                    React.createElement(this.props.rootComponent, {client: this.state.client, game: this.state.client.game})
                )}
            </div>
        );
    }

    componentDidMount() {
        const client = new Client({
            rootPhaseClass: this.props.rootPhaseClass,
            transportLayer: new ClientSocketTransportLayer("ws://localhost:8081")
        });

        client.onStateChange = () => {
            this.forceUpdate();
        };

        this.setState({client});

        client.start();
    }   
}