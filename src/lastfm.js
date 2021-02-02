import { default as $ } from 'jquery';
import { getPathWithoutLanguage } from './language';
import * as cache from './storage';

const API_KEY = '21350e3b1ce07ff776b1a2286670e635';
const API_URL = 'https://ws.audioscrobbler.com/2.0/';

const PLACEHOLDER_AVATAR = 'https://lastfm.freetls.fastly.net/i/u/avatar170s/818148bf682d429dc215c1705eb27b98.webp';

$.ajaxSetup({
    method: 'GET',
    url: API_URL,
    data: {
        'api_key': API_KEY,
        'format': 'json',
        'dataType': 'json'
    }
});

export function fetchFriends(user, callback) {
    var value;
    if (value = cache.getFriends()) {
        callback(value);
    } else {
        $.ajax({
            data: {
                method: 'user.getFriends',
                user: user,
                limit: '500'
            }
        }).done(function (data) {
            var friends = [];
            for (let friend of data.friends.user) {
                var image = friend.image[1]['#text'];
                image = image ? image : PLACEHOLDER_AVATAR;
                friends.push({
                    username: friend.name,
                    image: image
                });
            }

            if (cache.shouldCacheFriends())
                cache.setFriends(friends);
            callback(friends);
        });
    }
}

export function fetchArtist(artist, user, callback) {
    var data = {
        method: 'artist.getInfo',
        artist: artist,
        username: user
    };

    fetchPlayCount(data, user, callback, function (responseData) {
        return responseData.artist.stats.userplaycount;
    });
}

export function fetchSong(artist, song, user, callback) {
    var data = {
        method: 'track.getInfo',
        artist: artist,
        track: song,
        username: user
    };

    fetchPlayCount(data, user, callback, function (responseData) {
        return responseData.track.userplaycount;
    });
}

export function fetchAlbum(artist, album, user, callback) {
    var data = {
        method: 'album.getInfo',
            artist: artist,
            album: album,
            username: user
    };

    fetchPlayCount(data, user, callback, function (responseData) {
        return responseData.album.userplaycount;
    });
}

function fetchPlayCount(data, user, callback, parseCount) {
    var key = getPathWithoutLanguage().replace('/music/', '').replace(/\/\+\w+$/, '') + '.' + user;
    var value;
    if ((value =cache.getScrobbles(key)) !== null) {
        callback(value)
    } else {
        $.ajax({
            data: data
        }).done(function (responseData) {
            var count = parseInt(parseCount(responseData));
            count = (isNaN(count)) ? 0 : count;
            if (cache.shouldCacheScrobbles())
                cache.setScrobbles(key, count);
            callback(count);
        });
    }
}

export function fetchRecentTracks(user, callback) {
    //     http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=user&api_key=21350e3b1ce07ff776b1a2286670e635&format=json
    var data = {
        method: 'user.getrecenttracks',
        user: user.username,
        limit: 10
    };

    $.ajax({
        data: data
    }).done(function (responseData) {
        callback(responseData);
    });
}
