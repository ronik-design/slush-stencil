import React from 'tuxx/React';
import Room from './Room.jsx';

import Zoom from 'tuxx/Animations/Zoom';

var Rooms = React.createOwneeClass({
    propTypes: {
        rooms: React.PropTypes.array.isRequired
    },

    render() {
        var roomComponents = this.props.rooms.map((room) => {
            return <Room key={room.id} room={room} />;
        });

        return (
          <Zoom id={['room', 'id']}>
            { roomComponents }
          </Zoom>
        );
    }
});

export default Rooms;
