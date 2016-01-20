var React = require('react');

import UserList from './UserList.jsx';
import * as parser from './../parser';
import * as lastfm from './../lastfm';
import determineType from './../determineType';

export default class Content extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            data: []
        };

        this.friendsRemaining = Infinity;
    }

    componentDidMount() {
        var username = parser.getUsername();

        lastfm.fetchFriends(username, (friends) => {
            this.friendsRemaining = friends.length;
            for (let friend of friends) {
                var type = determineType();
                var artist = parser.getArtist(type);
                switch (type) {
                    case 'artist':
                        lastfm.fetchArtist(artist, friend.username, (playCount) => {
                            this.handlePlayCountReceived(friend, playCount);
                        });
                        break;
                    case 'song':
                        var song = parser.getSong();
                        lastfm.fetchSong(artist, song, friend.username, (playCount) => {
                            this.handlePlayCountReceived(friend, playCount);
                        });
                        break;
                    case 'album':
                        var album = parser.getAlbum();
                        lastfm.fetchAlbum(artist, album, friend.username, (playCount) => {
                            this.handlePlayCountReceived(friend, playCount);
                        });
                        break;
                }
            }
        });
    }

    handlePlayCountReceived(user, playCount) {
        if (playCount) {
            this.setState((state) => {
                state.data = state.data.concat([
                    {
                        name: user.username,
                        image: user.image,
                        count: playCount
                    }
                ]);
                return state;
            });
        }

        this.friendsRemaining--;
        if (this.friendsRemaining === 0) {
            this.setState({
                done: true
            });
        }
    }

    render() {
        var title = parser.getTitle();

        // put non-breaking space between first two words
        // because title starting at the end of one line
        // and ending at the second line looks strange
        title = title.replace(' ', '\xa0');

        var childComponent = <UserList data={this.state.data} />;
        if (this.state.done && !this.state.data.length) {
            childComponent = <div>None of your friends listen to this.</div>
        }

        var styles = {
            title: {
                marginRight: 20
            }
        };

        return (
            <div>
                <h2 className="widget_title" style={styles.title}>Friends who listen to <i>{title}</i></h2>

                {childComponent}
            </div>
        );
    }
}