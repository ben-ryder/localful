//
// @WebSocketGateway({path: "/v1/events"})
// @UsePipes(
//     GatewayErrorFilter
// )
// //@UseGuards(GatewayAuthenticationGuard)
// export class EventsGateway implements OnGatewayConnection {
//     constructor(
//         private authService: AuthService,
//     ) {}
//
//     handleConnection(client: any, ...args: any[]): any {
//         client.on("message", (event: any) => {
//             const rawEvent = JSON.parse(event.body);
//             console.debug(rawEvent)
//         })
//     }
//
//     @SubscribeMessage("subscribe")
//     onSubscribe(client: any, data: string) {
//         console.debug('subscribe', data);
//     }
// }

const a = "a"
export default a
