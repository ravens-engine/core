import { Component, ReactNode } from "react";
import * as React from "react";
import { Client, ClientState } from "../client/Client";
import { ClientSocketTransportLayer } from "../client-transport-layer/ClientSocketTransportLayer";
import { AnyGame, PhaseClass } from "../core/Phase";

export interface RootComponentProps<Game extends AnyGame> {
    client: Client<Game>,
    game: Game
}

interface RavensGameComponentProps<Game extends AnyGame> {
    gameClass: PhaseClass<Game>,
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

    render(): ReactNode {
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

    componentDidMount(): void {
        const client = new Client({
            gameClass: this.props.gameClass,
        });

        // @ts-expect-error To add a property to the browser console
        window["client"] = client;

        client.onStateChange = () => {
            this.forceUpdate();
        };

        this.setState({client});

        client.start();
    }   
}